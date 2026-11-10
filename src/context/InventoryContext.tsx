"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { RESOURCES } from "@/lib/data";
import { FINDS } from "@/lib/finds";

export type CorrectionCause =
  | "miscount"
  | "spoilage"
  | "damage"
  | "unrecorded draw"
  | "found stock";

export type Correction = {
  id: string;
  kind: "gear" | "resource";
  itemId: string;
  itemName: string;
  from: number;
  to: number;
  unit: string;
  cause: CorrectionCause;
  reason: string;
  at: string;
  notifiedKai: boolean;
};

type InventoryContextValue = {
  gearOnHand: Record<string, number>;
  resourceOnHand: Record<string, number>;
  corrections: Correction[];
  priorEvaOpen: boolean;
  correctCount: (input: {
    kind: "gear" | "resource";
    itemId: string;
    to: number;
    cause: CorrectionCause;
    reason: string;
  }) => void;
  closePriorEva: (recovered: { findId: string; amount: number }[]) => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

const gearSeed = Object.fromEntries(RESOURCES.map((item) => [item.id, item.onHand]));
const resourceSeed = Object.fromEntries(FINDS.map((item) => [item.id, item.onHand]));

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [gearOnHand, setGearOnHand] = useState<Record<string, number>>(gearSeed);
  const [resourceOnHand, setResourceOnHand] =
    useState<Record<string, number>>(resourceSeed);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [priorEvaOpen, setPriorEvaOpen] = useState(true);

  const correctCount = useCallback(
    (input: {
      kind: "gear" | "resource";
      itemId: string;
      to: number;
      cause: CorrectionCause;
      reason: string;
    }) => {
      const gear = RESOURCES.find((item) => item.id === input.itemId);
      const find = FINDS.find((item) => item.id === input.itemId);
      const from =
        input.kind === "gear"
          ? (gearOnHand[input.itemId] ?? gear?.onHand ?? 0)
          : (resourceOnHand[input.itemId] ?? find?.onHand ?? 0);
      const unit = input.kind === "gear" ? (gear?.unit ?? "") : (find?.unit ?? "");
      const name = input.kind === "gear" ? (gear?.name ?? input.itemId) : (find?.name ?? input.itemId);
      const delta = Math.abs(input.to - from);
      const notifiedKai = delta >= 20 || (from > 0 && delta / from >= 0.1);

      if (input.kind === "gear") {
        setGearOnHand((prev) => ({ ...prev, [input.itemId]: input.to }));
      } else {
        setResourceOnHand((prev) => ({ ...prev, [input.itemId]: input.to }));
      }

      setCorrections((prev) => [
        {
          id: `cor-${Date.now()}`,
          kind: input.kind,
          itemId: input.itemId,
          itemName: name,
          from,
          to: input.to,
          unit,
          cause: input.cause,
          reason: input.reason.trim(),
          at: "Sol 189",
          notifiedKai,
        },
        ...prev,
      ]);
    },
    [gearOnHand, resourceOnHand],
  );

  const closePriorEva = useCallback(
    (recovered: { findId: string; amount: number }[]) => {
      setResourceOnHand((prev) => {
        const next = { ...prev };
        for (const line of recovered) {
          next[line.findId] = (next[line.findId] ?? 0) + line.amount;
        }
        return next;
      });
      setPriorEvaOpen(false);
    },
    [],
  );

  const value = useMemo(
    () => ({
      gearOnHand,
      resourceOnHand,
      corrections,
      priorEvaOpen,
      correctCount,
      closePriorEva,
    }),
    [gearOnHand, resourceOnHand, corrections, priorEvaOpen, correctCount, closePriorEva],
  );

  return (
    <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextValue => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
};
