import { useCallback } from "react";

import BackupDropzone from "../components/restore/BackupDropzone";
import HeaderTitle from "../layouts/HeaderTitle";
import InnerAppLayout from "../layouts/InnerAppLayout";
import ModulePicker from "../components/restore/ModulePicker";
import RestoreIcon from "../assets/images/restore.svg";
import SessionProvider from "../contexts/SessionProvider";
import WalletList from "../components/wallet/WalletList";
import useSession from "../hooks/useSession";

function RestoreContent() {
  const hasRows = useSession((state) => state.rows.length > 0);
  const setRows = useSession((state) => state.setRows);
  const setModule = useSession((state) => state.setModule);

  const chooseAnotherFile = useCallback(() => {
    setRows([], false);
    setModule(null);
  }, [setRows, setModule]);

  if (!hasRows) {
    return <BackupDropzone />;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <ModulePicker />
        <button
          onClick={chooseAnotherFile}
          className="self-center text-yellow-400 px-2 py-1"
        >
          Choose another file
        </button>
      </div>
      <WalletList />
    </>
  );
}

export default function Restore() {
  return (
    <InnerAppLayout
      headerMiddleContent={
        <HeaderTitle icon={RestoreIcon}>Restore Wallets</HeaderTitle>
      }
      className="gap-4"
    >
      <SessionProvider module={null}>
        <RestoreContent />
      </SessionProvider>
    </InnerAppLayout>
  );
}
