export type WalletResult<T extends Record<string, string>> = Record<
  T[keyof T],
  string
>;

export interface GetParcelConfig<T = Record<string, string>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (wallets: T[]): any;
}

export interface GenerateWallet {
  (count: number, isTestnet: boolean, ...args: unknown[]): Promise<
    Record<string, string>[]
  >;
}
