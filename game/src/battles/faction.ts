import { Actor } from "./actor";

export type Faction = {
  name: string;
  members: Actor[];
  allyFactions: string[];
  isPlayer?: boolean;
};

export type Factions = Record<string, Faction>;
