/** Most wallets in one printout, so the page stays manageable */
export const MAX_PRINT_WALLETS = 100;

export interface PrintOptions {
  includeSecrets: boolean;
  includeQRCodes: boolean;
}

/** A print in progress: the chosen options and when it was started */
export interface PrintJob extends PrintOptions {
  printedAt: number;
}
