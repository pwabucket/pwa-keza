import { useState } from "react";

export default function useWallets(defaultExpanded = false) {
  const [isTestnet, setIsTestnet] = useState(false);
  const [count, setCount] = useState<string | number>(1);
  const [wallets, setWallets] = useState<Record<string, string>[]>([]);
  const [expanded, setExpanded] = useState(defaultExpanded);

  return {
    isTestnet,
    count,
    wallets,
    expanded,
    setIsTestnet,
    setCount,
    setWallets,
    setExpanded,
  };
}
