import { Link } from "react-router";

import AppContainer from "../layouts/AppContainer";
import AppIcon from "../assets/images/icon.svg";
import EVMIcon from "../assets/images/evm.svg";
import SolanaIcon from "../assets/images/solana.svg";
import TONIcon from "../assets/images/ton.svg";
import { cn } from "../lib/utils";

const generators = [
  {
    title: "EVM Wallet",
    icon: EVMIcon,
    path: "/generator/evm",
    tags: ["ETH", "BNB", "POL"],
  },
  {
    title: "TON Wallet",
    icon: TONIcon,
    path: "/generator/ton",
    tags: ["TON", "NOT", "DOGS"],
  },
  {
    title: "Solana Wallet",
    icon: SolanaIcon,
    path: "/generator/solana",
    tags: ["SOL", "WIF", "PENGU"],
  },
];

export default function Home() {
  return (
    <AppContainer className="h-dvh justify-center gap-4">
      <img src={AppIcon} className="h-52 mx-auto" />
      <h1 className="text-center text-4xl font-monoton">
        {import.meta.env.VITE_APP_NAME}
      </h1>
      <div className="flex flex-col gap-2">
        {generators.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "px-2 py-2 rounded-full bg-neutral-700",
              "flex gap-4",
              "border border-transparent",
              "hover:border-yellow-500"
            )}
          >
            <img src={item.icon} className="shrink-0 size-10 rounded-full" />
            <div className="flex flex-col min-w-0 gap-1">
              <h3 className="font-bold">{item.title}</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
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
        ))}
      </div>
    </AppContainer>
  );
}
