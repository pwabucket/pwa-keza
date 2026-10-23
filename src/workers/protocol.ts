import type { MnemonicType } from "../wallets/derive";
import type { VanityMatcher } from "../lib/vanity";
import type { WalletGeneratorOptions, WalletRow } from "../types/wallet";

/** A batch of wallets for one worker to generate */
export interface GenerateJob {
  moduleId: string;
  count: number;
  options: WalletGeneratorOptions;
}

/** Accounts start to start + count - 1 of an existing phrase */
export interface DeriveJob {
  moduleId: string;
  mnemonic: string;
  passphrase: string;
  mnemonicType: MnemonicType;
  pathTemplate: string;
  start: number;
  count: number;
  testnet: boolean;
}

/** A search for an address with a prefix and/or suffix */
export interface VanityJob {
  moduleId: string;
  matcher: VanityMatcher;
}

/** Receives generated wallets as they are produced */
export type ChunkHandler = (rows: WalletRow[]) => void | Promise<void>;

/** Receives the number of addresses tried since the last report */
export type AttemptsHandler = (attempts: number) => void;

export interface WalletWorkerAPI {
  generate(job: GenerateJob, onChunk: ChunkHandler): Promise<void>;
  derive(job: DeriveJob, onChunk: ChunkHandler): Promise<void>;
  /** Searches until a match is found or the worker is terminated */
  vanity(job: VanityJob, onAttempts: AttemptsHandler): Promise<WalletRow>;
}

export const JobStatus = {
  IDLE: "idle",
  RUNNING: "running",
  DONE: "done",
  CANCELLED: "cancelled",
  FAILED: "failed",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
