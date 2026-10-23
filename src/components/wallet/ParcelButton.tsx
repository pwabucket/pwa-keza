import { Dialog } from "radix-ui";
import { useLocationToggle } from "@pwabucket/pwa-router";

import IconButton from "../ui/IconButton";
import ParcelIcon from "../../assets/images/parcel-icon.svg";
import useSession from "../../hooks/useSession";
import { ParcelDialog } from "../ParcelDialog";
import type { GetParcelConfig } from "../../types/wallet";

/** Parcel dialog fed with the session's wallets */
function SessionParcelDialog({
  getParcelConfig,
}: {
  getParcelConfig: GetParcelConfig;
}) {
  const rows = useSession((state) => state.rows);

  return <ParcelDialog wallets={rows} getParcelConfig={getParcelConfig} />;
}

/** Opens Parcel with the current wallets */
export default function ParcelButton({
  getParcelConfig,
}: {
  getParcelConfig: GetParcelConfig;
}) {
  const [showParcel, setShowParcel] = useLocationToggle(
    "parcel-dialog",
    "parcel",
  );

  return (
    <Dialog.Root open={showParcel} onOpenChange={setShowParcel}>
      <Dialog.Trigger asChild>
        <IconButton
          label="Launch Parcel"
          className="bg-neutral-600 py-2 px-3 rounded-xl"
        >
          <img src={ParcelIcon} alt="" className="size-5" />
        </IconButton>
      </Dialog.Trigger>

      {/* Mounted only while open, so the rows aren't followed otherwise */}
      {showParcel ? (
        <SessionParcelDialog getParcelConfig={getParcelConfig} />
      ) : null}
    </Dialog.Root>
  );
}
