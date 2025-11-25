export type WorkerConstructor = new () => Worker;

export interface WalletGeneratorOptions {
  testnet?: boolean;
}

export type WorkerAPI<Result extends Record<string, string>> = {
  generate: (options: WalletGeneratorOptions) => Promise<Result>;
  generateBatch: (
    count: number,
    options: WalletGeneratorOptions
  ) => Promise<Result[]>;
};

export type WalletResult<T extends Record<string, string>> = Record<
  T[keyof T],
  string
>;

export interface GetParcelConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (wallets: Record<string, string>[], options?: Record<string, unknown>): any;
}

export interface GenerateWallet {
  (count: number, options: WalletGeneratorOptions): Promise<
    Record<string, string>[]
  >;
}

export interface WalletModule {
  id: string;
  title: string;
  icon: string;
  tags: string[];
  supportsTestnet?: boolean;
  worker: new (options?: { name?: string }) => Worker;
  getParcelConfig: (
    wallets: Record<string, string>[],
    options?: Record<string, unknown>
  ) => Record<string, unknown>;
}
