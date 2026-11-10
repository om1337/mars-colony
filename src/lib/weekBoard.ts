import type { Commitment, Resource } from "./types";

export type BlockSegment = {
  dayStart: number;
  dayEnd: number;
  commitments: Commitment[];
  isCollision: boolean;
};

const rangesOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean => !(aEnd < bStart || bEnd < aStart);

/** Collisions only for exclusive assets (capacity 1). Consumables share windows. */
export const buildBlockSegments = (
  commitments: Commitment[],
  exclusive = true,
): BlockSegment[] => {
  const holds = commitments.filter((c) => c.kind === "hold");
  const specials = commitments.filter((c) => c.kind !== "hold");
  const segments: BlockSegment[] = [];
  const used = new Set<string>();

  if (!exclusive) {
    for (const hold of holds) {
      segments.push({
        dayStart: hold.dayStart,
        dayEnd: hold.dayEnd,
        commitments: [hold],
        isCollision: false,
      });
    }
    for (const s of specials) {
      segments.push({
        dayStart: s.dayStart,
        dayEnd: s.dayEnd,
        commitments: [s],
        isCollision: false,
      });
    }
    return segments.sort(
      (a, b) => a.dayStart - b.dayStart || a.dayEnd - b.dayEnd,
    );
  }

  for (const hold of holds) {
    if (used.has(hold.id)) continue;
    const group = [hold];
    used.add(hold.id);

    let changed = true;
    while (changed) {
      changed = false;
      for (const other of holds) {
        if (used.has(other.id)) continue;
        const overlaps = group.some((g) =>
          rangesOverlap(g.dayStart, g.dayEnd, other.dayStart, other.dayEnd),
        );
        if (overlaps) {
          group.push(other);
          used.add(other.id);
          changed = true;
        }
      }
    }

    const dayStart = Math.min(...group.map((g) => g.dayStart));
    const dayEnd = Math.max(...group.map((g) => g.dayEnd));
    const isCollision = group.length > 1;

    if (isCollision) {
      const collisionDays = new Set<number>();
      for (let d = dayStart; d <= dayEnd; d += 1) {
        const count = group.filter((g) => g.dayStart <= d && g.dayEnd >= d).length;
        if (count > 1) collisionDays.add(d);
      }
      const collisionStart = Math.min(...collisionDays);
      const collisionEnd = Math.max(...collisionDays);

      for (const g of group) {
        if (g.dayStart < collisionStart) {
          segments.push({
            dayStart: g.dayStart,
            dayEnd: collisionStart - 1,
            commitments: [g],
            isCollision: false,
          });
        }
        if (g.dayEnd > collisionEnd) {
          segments.push({
            dayStart: collisionEnd + 1,
            dayEnd: g.dayEnd,
            commitments: [g],
            isCollision: false,
          });
        }
      }

      segments.push({
        dayStart: collisionStart,
        dayEnd: collisionEnd,
        commitments: group.filter(
          (g) => g.dayStart <= collisionEnd && g.dayEnd >= collisionStart,
        ),
        isCollision: true,
      });
    } else {
      segments.push({ dayStart, dayEnd, commitments: group, isCollision: false });
    }
  }

  for (const s of specials) {
    segments.push({
      dayStart: s.dayStart,
      dayEnd: s.dayEnd,
      commitments: [s],
      isCollision: false,
    });
  }

  return segments.sort((a, b) => a.dayStart - b.dayStart || a.dayEnd - b.dayEnd);
};

export const consumableCommitted = (
  resource: Resource,
  commitments: Commitment[],
): number =>
  commitments
    .filter((c) => c.resourceId === resource.id && c.kind === "hold")
    .reduce((sum, c) => sum + (c.amount ?? 0), 0);

export const consumableAvailable = (
  resource: Resource,
  commitments: Commitment[],
): number => {
  const committed = consumableCommitted(resource, commitments);
  return Math.max(0, resource.onHand - committed - resource.reserveFloor);
};
