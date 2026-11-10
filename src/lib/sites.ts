export type Site = {
  id: string;
  name: string;
  region: string;
};

/** Where a crew deploys from, and where on Mars a resource is collected. */
export const SITES: Site[] = [
  { id: "dome-2", name: "Dome 2 airlock", region: "Habitat" },
  { id: "north-ridge", name: "North ridge", region: "4 km north" },
  { id: "south-crater", name: "South crater rim", region: "11 km south" },
  { id: "aquifer-trench", name: "Aquifer trench", region: "6 km east" },
  { id: "berm-cache", name: "Habitat berm cache", region: "400 m west" },
  { id: "west-basin", name: "West basin", region: "8 km west" },
];

export type ForageTarget = {
  missionId: string;
  findId: string;
  amount: number;
  siteId: string;
};

/** What this week's missions are out to bring back, and where they collect it. */
export const WEEK_FORAGE: ForageTarget[] = [
  { missionId: "m-ridge", findId: "water-ice", amount: 80, siteId: "north-ridge" },
  { missionId: "m-crater", findId: "hematite", amount: 25, siteId: "south-crater" },
  { missionId: "m-drill", findId: "subsurface-ice", amount: 40, siteId: "aquifer-trench" },
  { missionId: "m-pipe", findId: "scrap-alloy", amount: 10, siteId: "berm-cache" },
  { missionId: "m-standby", findId: "regolith", amount: 15, siteId: "west-basin" },
];

export const siteById = (id: string): Site | undefined =>
  SITES.find((site) => site.id === id);

export const forageForMission = (missionId: string): ForageTarget[] =>
  WEEK_FORAGE.filter((target) => target.missionId === missionId);
