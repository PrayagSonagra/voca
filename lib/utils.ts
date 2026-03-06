import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Pass directly as `onKeyDown` on any <input>.
 * Blocks a Space keystroke when the character immediately before
 * the cursor is already a space, preventing double-space entry.
 */
export function preventDoubleSpace(
  e: React.KeyboardEvent<HTMLInputElement>,
): void {
  if (e.key !== " ") return;
  const el = e.currentTarget;
  const before = el.value.slice(0, el.selectionStart ?? undefined);
  if (before.endsWith(" ")) e.preventDefault();
}

/**
 * Pass directly as `onPaste` on any <input>.
 * Strips consecutive spaces from pasted text before it lands in the field.
 */
export function sanitiseOnPaste(
  e: React.ClipboardEvent<HTMLInputElement>,
): void {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text").replace(/ {2,}/g, " ");
  document.execCommand("insertText", false, pasted);
}
