import { Link } from "react-router";

import AppContainer from "../layouts/AppContainer";
import AppIcon from "../assets/images/icon.svg";
import EVMIcon from "../assets/images/evm.svg";
import Number12Icon from "../assets/images/number-12.svg";
import Number24Icon from "../assets/images/number-24.svg";
import RestoreIcon from "../assets/images/restore.svg";
import SolanaIcon from "../assets/images/solana.svg";
import TONIcon from "../assets/images/ton.svg";
import { cn } from "../lib/utils";

const generators = [
  {
    title: "EVM Wallets",
    icon: EVMIcon,
    path: "/generator/evm",
    tags: ["ETH", "BNB", "POL"],
  },
  {
    title: "TON Wallets",
    icon: TONIcon,
    path: "/generator/ton",
    tags: ["TON", "NOT", "DOGS"],
  },
  {
    title: "Solana Wallets",
    icon: SolanaIcon,
    path: "/generator/solana",
    tags: ["SOL", "WIF", "PENGU"],
  },
  {
    title: "12-Word Mnemonic Wallets",
    icon: Number12Icon,
    path: "/generator/12-word-mnemonic",
    tags: ["Metamask", "Bitget Wallet"],
  },
  {
    title: "24-Word Mnemonic Wallets",
    icon: Number24Icon,
    path: "/generator/24-word-mnemonic",
    tags: ["Tonkeeper", "Phantom"],
  },
];

const PageLink = ({ path, title, icon, tags }) => (
  <Link
    to={path}
    className={cn(
      "px-2 py-2 rounded-full bg-neutral-700",
      "flex gap-4",
      "border border-transparent",
      "hover:border-yellow-500"
    )}
  >
    <img src={icon} className="shrink-0 size-10 rounded-full" />
    <div className="flex flex-col min-w-0 gap-1">
      <h3 className="font-bold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs text-neutral-300 bg-neutral-600 px-2 py-px rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

export default function Home() {
  return (
    <AppContainer className="min-h-dvh justify-center gap-4 py-10">
      <img src={AppIcon} className="h-52 mx-auto" />
      <h1 className="text-center text-4xl font-monoton">
        {import.meta.env.VITE_APP_NAME}
      </h1>
      <div className="flex flex-col gap-2">
        {generators.map((item, index) => (
          <PageLink key={index} {...item} />
        ))}
      </div>
      <p
        className={cn(
          "text-center text-neutral-300",
          "flex gap-4 px-4 items-center",
          "before:h-px before:grow before:bg-neutral-600",
          "after:h-px after:grow after:bg-neutral-600"
        )}
      >
        OR
      </p>

      <PageLink
        path={"/restore"}
        title={"Restore Wallets"}
        icon={RestoreIcon}
        tags={["TXT", "JSON", "CSV"]}
      />
    </AppContainer>
  );
}
