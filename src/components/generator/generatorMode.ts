export const GeneratorMode = {
  GENERATE: "generate",
  DERIVE: "derive",
} as const;

export type GeneratorMode = (typeof GeneratorMode)[keyof typeof GeneratorMode];
