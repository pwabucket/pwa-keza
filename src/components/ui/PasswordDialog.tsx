import { Dialog } from "radix-ui";
import { useState } from "react";

import Input from "../Input";
import { PopupDialog } from "../PopupDialog";
import { cn } from "../../lib/utils";

type PasswordDialogProps = {
  open: boolean;
  title: string;
  description: string;
  submitLabel: string;
  /** Asks for the password twice, for choosing a new one */
  confirm?: boolean;
  minLength?: number;
  /** Throws to show its message under the form */
  onSubmit: (password: string) => Promise<void>;
  onCancel: () => void;
};

/** Asks for a password and runs an action with it */
export default function PasswordDialog({
  open,
  onCancel,
  ...props
}: PasswordDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      {/* Mounted only while open, so the typed password is dropped on close */}
      {open ? <PasswordForm {...props} /> : null}
    </Dialog.Root>
  );
}

function PasswordForm({
  title,
  description,
  submitLabel,
  confirm = false,
  minLength = 1,
  onSubmit,
}: Omit<PasswordDialogProps, "open" | "onCancel">) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (password.length < minLength) {
      setError(`Use at least ${minLength} characters.`);
      return;
    }

    if (confirm && password !== confirmation) {
      setError("The passwords don't match.");
      return;
    }

    setError(null);
    setIsBusy(true);

    try {
      await onSubmit(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <PopupDialog>
      <Dialog.Title className="text-lg font-bold text-center">
        {title}
      </Dialog.Title>
      <Dialog.Description className="text-center text-neutral-300">
        {description}
      </Dialog.Description>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
        <Input
          type="password"
          aria-label="Password"
          placeholder="Password"
          autoComplete={confirm ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isBusy}
          autoFocus
        />
        {confirm ? (
          <Input
            type="password"
            aria-label="Repeat password"
            placeholder="Repeat password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            disabled={isBusy}
          />
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-red-400 text-center">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isBusy}
          className={cn(
            "px-4 py-2 rounded-xl bg-yellow-500 text-black",
            "disabled:opacity-60",
            "focus-visible:outline-hidden focus-visible:ring-3",
            "focus-visible:ring-yellow-300",
          )}
        >
          {isBusy ? "Working..." : submitLabel}
        </button>
        <Dialog.Close
          type="button"
          className="px-4 py-2 rounded-xl bg-neutral-700"
        >
          Cancel
        </Dialog.Close>
      </form>
    </PopupDialog>
  );
}
