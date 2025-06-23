import clsx from "clsx";
import copy from "copy-to-clipboard";
import repeatElement from "repeat-element";
import toast from "react-hot-toast";
import { Fragment, createElement } from "react";
import { twMerge } from "tailwind-merge";

export function repeatComponent(component, times = 1) {
  return repeatElement(undefined, times).map((_, i) =>
    createElement(Fragment, { key: i, children: component })
  );
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(content) {
  copy(content);
  toast.dismiss();
  toast.success("Copied!");
}

export function downloadFile(name, content) {
  const href = `data:application/octet-stream;base64,${btoa(content)}`;

  const a = document.createElement("a");

  a.download = name;
  a.href = href;

  a.click();
}
