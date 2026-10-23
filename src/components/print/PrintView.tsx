import { QRCodeSVG } from "qrcode.react";
import { createPortal } from "react-dom";
import { useMemo } from "react";

import useSession from "../../hooks/useSession";
import { MAX_PRINT_WALLETS, type PrintJob } from "./printOptions";
import { getSecretLabels, isSecretLabel } from "../../wallets/secrets";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Printable copy of the wallets, rendered outside the app for @media print */
export default function PrintView({ job }: { job: PrintJob }) {
  const rows = useSession((state) => state.rows);
  const module = useSession((state) => state.module);
  const secretLabels = useMemo(() => getSecretLabels(module), [module]);
  const printedRows = rows.slice(0, MAX_PRINT_WALLETS);
  const target = document.getElementById("print-root");

  if (!target) return null;

  return createPortal(
    <div className="print-view">
      <header className="print-header">
        <h1>
          {import.meta.env.VITE_APP_NAME} ·{" "}
          {module?.title ?? "Restored Wallets"}
        </h1>
        <p>{dateFormat.format(job.printedAt)}</p>
      </header>

      {printedRows.map((row, index) => (
        <section key={index} className="print-wallet">
          <h2>Wallet {index + 1}</h2>
          {Object.entries(row)
            .filter(
              ([label, value]) =>
                value !== "" &&
                (job.includeSecrets || !isSecretLabel(secretLabels, label)),
            )
            .map(([label, value]) => (
              <div key={label} className="print-field">
                <div className="print-field-text">
                  <h3>{label}</h3>
                  <p>{value}</p>
                </div>
                {job.includeQRCodes ? (
                  <QRCodeSVG value={value} size={88} level="M" />
                ) : null}
              </div>
            ))}
        </section>
      ))}
    </div>,
    target,
  );
}
