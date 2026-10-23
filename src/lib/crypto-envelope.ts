import { base64ToBytes, bytesToBase64 } from "./base64";
import { isWalletRows } from "./walletRows";
import type { WalletRow } from "../types/wallet";

/** Marks a file as a Keza encrypted backup */
export const ENVELOPE_FORMAT = "keza-encrypted";
const ENVELOPE_VERSION = 1;

/** OWASP's recommended PBKDF2-SHA256 work factor */
const PBKDF2_ITERATIONS = 600_000;
/** Iteration counts accepted from a file, so a crafted one can't hang the device */
const MIN_ITERATIONS = 100_000;
const MAX_ITERATIONS = 10_000_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

export interface EncryptedEnvelope {
  format: typeof ENVELOPE_FORMAT;
  v: number;
  kdf: { name: "PBKDF2"; hash: "SHA-256"; iterations: number; salt: string };
  cipher: { name: "AES-GCM"; iv: string };
  /** Base64 ciphertext of the JSON payload */
  data: string;
}

/** What an encrypted backup holds */
export interface BackupPayload {
  v: number;
  /** Module the wallets belong to, null when unknown */
  moduleId: string | null;
  rows: WalletRow[];
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Encrypts wallets with a password into a self-describing envelope */
export async function encryptBackup(
  payload: Omit<BackupPayload, "v">,
  password: string,
): Promise<EncryptedEnvelope> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(password, salt, PBKDF2_ITERATIONS);
  const plaintext = encoder.encode(
    JSON.stringify({ v: ENVELOPE_VERSION, ...payload }),
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext,
  );

  return {
    format: ENVELOPE_FORMAT,
    v: ENVELOPE_VERSION,
    kdf: {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations: PBKDF2_ITERATIONS,
      salt: bytesToBase64(salt),
    },
    cipher: { name: "AES-GCM", iv: bytesToBase64(iv) },
    data: bytesToBase64(new Uint8Array(ciphertext)),
  };
}

/** True when parsed file content is an encrypted backup envelope */
export function isEncryptedEnvelope(
  value: unknown,
): value is EncryptedEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as EncryptedEnvelope).format === ENVELOPE_FORMAT
  );
}

/** Decrypts an envelope; throws when the password is wrong or data altered */
export async function decryptBackup(
  envelope: EncryptedEnvelope,
  password: string,
): Promise<BackupPayload> {
  if (envelope.v !== ENVELOPE_VERSION) {
    throw new Error("Unsupported backup version");
  }

  const { iterations } = envelope.kdf;

  if (
    !Number.isInteger(iterations) ||
    iterations < MIN_ITERATIONS ||
    iterations > MAX_ITERATIONS
  ) {
    throw new Error("Unsupported backup settings");
  }

  const key = await deriveKey(
    password,
    base64ToBytes(envelope.kdf.salt),
    iterations,
  );
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(envelope.cipher.iv) },
    key,
    base64ToBytes(envelope.data),
  );

  const payload = JSON.parse(decoder.decode(plaintext));

  if (!isWalletRows(payload?.rows)) {
    throw new Error("Invalid backup file");
  }

  return {
    v: payload.v,
    moduleId: typeof payload.moduleId === "string" ? payload.moduleId : null,
    rows: payload.rows,
  };
}
