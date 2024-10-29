import React, { ReactElement, useContext, useMemo } from "react";
// import { useAccount, useConfig } from "wagmi";
// import { custom_chains } from "../config-networks";
// import { require } from "react";
import SpartanABI from "./Chains/Mainnet/Base/ABI/Spartan.json"

type onChainProvider = {
  spartanContract : {address: `0x${string}` | undefined, abi: any},
};

export type MultiChainContextData = {
  onChainProvider: onChainProvider;
} | null;

const MultiChainContext = React.createContext<MultiChainContextData>(null);

export const useMultiChain = () => {
  const _MultiChainContext = useContext(MultiChainContext);

  if (!_MultiChainContext) {
    throw new Error(
      "useMultiChain() can only be used inside of <MultiChainProvider />, " + "please declare it at a higher level.",
    );
  }

  const { onChainProvider } = _MultiChainContext;

  return useMemo(() => {
    return { ...onChainProvider };
  }, [_MultiChainContext]);

};

export const MultiChainProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const address = "0x4aF5ee29551527BB3f4714561ae06F400a0139Ca" as `0x${string}`;

  const onChainProvider = useMemo(
    () => {
      const spartanContract = {
        address: address,
        abi: SpartanABI,
      };
      return { spartanContract };
    },
    [ address, SpartanABI ],
  );

  return <MultiChainContext.Provider value={{ onChainProvider }}>{children}</MultiChainContext.Provider>;
};
