import { useState } from "react";

export default function useWallets() {
  const [count, setCount] = useState(1);
  const [wallets, setWallets] = useState([]);
  const [expanded, setExpanded] = useState(false);

  return {
    count,
    wallets,
    expanded,
    setCount,
    setWallets,
    setExpanded,
  };
}
