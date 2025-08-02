import { Buffer } from "buffer";

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

if (typeof self.window === "undefined") {
  self.window = self;
}
self.Buffer = Buffer;
