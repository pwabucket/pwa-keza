import toast from "react-hot-toast";
import { useCallback } from "react";

import InnerAppLayout from "../layouts/InnerAppLayout";
import WalletGeneratorInput from "../components/WalletGeneratorInput";
import WalletList from "./WalletList";
import useWallets from "../hooks/useWallets";

export default function WalletsGenerator({ id, icon, title, generate }) {
  const { count, wallets, expanded, setExpanded, setCount, setWallets } =
    useWallets();

  const generateWallets = useCallback(async () => {
    setWallets(await Promise.all(Array.from({ length: count }).map(generate)));
    toast.dismiss();
    toast.success("Generated!");
  }, [count, setWallets, generate]);

  return (
    <InnerAppLayout
      headerMiddleContent={
        <div className="flex justify-center items-center gap-2">
          <img src={icon} className="size-8" />{" "}
          <h1 className="font-bold">{title}</h1>
        </div>
      }
      className="gap-4"
    >
      <WalletGeneratorInput
        count={count}
        setCount={setCount}
        generate={generateWallets}
      />

      {wallets.length > 0 ? (
        <WalletList
          id={id}
          wallets={wallets}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ) : (
        <p className="italic text-center">Click generate to start...</p>
      )}
    </InnerAppLayout>
  );
}
