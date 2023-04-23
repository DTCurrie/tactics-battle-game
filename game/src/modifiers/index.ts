export type Modifier = Readonly<{ priority: number }>;
export type ValueModifier = Modifier & {
  modify: (from: number, to: number) => number;
};

export const comparePriorities = (a: Modifier, b: Modifier) =>
  a.priority >= b.priority ? 1 : -1;
