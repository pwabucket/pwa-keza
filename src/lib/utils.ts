import clsx, { type ClassValue } from "clsx";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(content: string) {
  copy(content);
  toast.dismiss();
  toast.success("Copied!");
}
