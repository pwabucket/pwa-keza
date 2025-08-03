export type WalletResult<T extends Record<string, string>> = Record<
  T[keyof T],
  string
>;
