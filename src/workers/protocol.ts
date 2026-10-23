import type { WalletGeneratorOptions, WalletRow } from "../types/wallet";

/** A batch of wallets for one worker to generate */
export interface GenerateJob {
  moduleId: string;
  count: number;
  options: WalletGeneratorOptions;
}

/** Receives generated wallets as they are produced */
export type ChunkHandler = (rows: WalletRow[]) => void | Promise<void>;

export interface WalletWorkerAPI {
  generate(job: GenerateJob, onChunk: ChunkHandler): Promise<void>;
}

export const JobStatus = {
  IDLE: "idle",
  RUNNING: "running",
  DONE: "done",
  CANCELLED: "cancelled",
  FAILED: "failed",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
