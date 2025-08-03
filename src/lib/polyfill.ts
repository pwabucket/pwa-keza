import { Buffer } from "buffer";

if (typeof self.window === "undefined") {
  self.window = self;
}
self.Buffer = Buffer;
