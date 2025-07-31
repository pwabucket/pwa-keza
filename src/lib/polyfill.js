import { Buffer } from "buffer";

if (typeof globalThis.window === "undefined") {
  globalThis.window = globalThis;
}
globalThis.Buffer = Buffer;
