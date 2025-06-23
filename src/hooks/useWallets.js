import { useState } from "react";

export default function useWallets() {
  const [count, setCount] = useState(1);
  const [wallets, setWallets] = useState([]);

  return {
    count,
    wallets,
    setCount,
    setWallets,
  };
}
