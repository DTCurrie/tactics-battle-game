export type Settings = Readonly<{
  board: {
    width: number;
    height: number;
    depth: number;
  };
  stepHeight: number;
}>;

export const settings: Settings = {
  board: {
    width: 10,
    height: 8,
    depth: 5,
  },
  stepHeight: 0.25,
} as const;
