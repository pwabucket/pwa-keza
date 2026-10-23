export const GeneratorMode = {
  GENERATE: "generate",
  DERIVE: "derive",
  VANITY: "vanity",
} as const;

export type GeneratorMode = (typeof GeneratorMode)[keyof typeof GeneratorMode];
