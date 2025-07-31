import { useState } from "react";

export default function useWallets(defaultExpanded = false) {
  const [count, setCount] = useState(1);
  const [wallets, setWallets] = useState([]);
  const [expanded, setExpanded] = useState(defaultExpanded);

  return {
    count,
    wallets,
    expanded,
    setCount,
    setWallets,
    setExpanded,
  };
}
