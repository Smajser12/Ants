import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useMultiChain } from '../../MultiChainProvider/MultiChainProvider';
import { formatUnits, parseUnits } from 'viem';

interface Ant {
  x: number;
  y: number;
  dir: number;
  movesLeft: bigint;
  name: string;
  owner: string;
  isAlive: boolean;
  stakedTokens: bigint;
}

interface AntContextType {
  balance: string;
  activeAnts: number[];
  grid: number[][];
  userAnts: number[];
  ants: { [key: number]: Ant };
  createAnt: (name: string, tokensToStake: string) => Promise<void>;
  withdrawAnt: (antId: number) => Promise<void>;
}

const AntContext = createContext<AntContextType | undefined>(undefined);

export const useAnt = () => {
  const context = useContext(AntContext);
  if (!context) {
    throw new Error('useAnt must be used within an AntProvider');
  }
  return context;
};

export const AntProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const { spartanContract } = useMultiChain();
  const { writeContractAsync } = useWriteContract();

  const [balance, setBalance] = useState<string>('0');
  const [activeAnts, setActiveAnts] = useState<number[]>([]);
  const [grid, setGrid] = useState<number[][]>(Array(64).fill(Array(64).fill(0)));
//   const [userAnts, setUserAnts] = useState<number[]>([]);
  const [ants, setAnts] = useState<{ [key: number]: Ant }>({});

  // Read contract data
  const { data: balanceData } = useReadContract({
    ...spartanContract,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: {
      refetchInterval: 1000,
    },
  });

  const { data: activeAntsData } = useReadContract({
    ...spartanContract,
    functionName: 'getActiveAnts',
    query: {
      refetchInterval: 1000,
    },
  });

  const { data: gridData } = useReadContract({
    ...spartanContract,
    functionName: 'getGridState',
    query: {
      refetchInterval: 1000,
    },
  });
  console.log("data",gridData);

  // Update states when data changes
  useEffect(() => {
    if (balanceData) {
      setBalance(formatUnits(balanceData as bigint, 18));
    }
    if (activeAntsData) {
      setActiveAnts(activeAntsData as number[]);
      // Fetch info for each active ant
      (activeAntsData as number[]).forEach(async (antId) => {
        const antInfo = await fetchAntInfo(antId);
        if (antInfo) {
          setAnts(prev => ({ ...prev, [antId]: antInfo }));
        }
      });
    }
    if (gridData) {
      setGrid(gridData as number[][]);
    }
  }, [balanceData, activeAntsData, gridData]);


  const fetchAntInfo = async (antId: number) => {
    const { data: antInfo } = useReadContract({
      ...spartanContract,
      functionName: 'getAntInfo',
      args: [antId],
    });
    return antInfo as Ant;
  };

  // Contract interaction functions
  const createAnt = async (name: string, tokensToStake: string) => {
    if (!address) throw new Error('Wallet not connected');
    try {
      await writeContractAsync({
        ...spartanContract,
        functionName: 'createAnt',
        address: spartanContract.address as `0x${string}`,
        args: [name, parseUnits(tokensToStake, 18)],
      });
    } catch (error) {
      console.error('Error creating ant:', error);
      throw error;
    }
  };

  const withdrawAnt = async (antId: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContractAsync({
        ...spartanContract,
        address: spartanContract.address as `0x${string}`,
        functionName: 'withdrawAnt',
        args: [BigInt(antId)],
      });
    } catch (error) {
      console.error('Error withdrawing ant:', error);
      throw error;
    }
  };

  const userAnts = Object.keys(ants).map(Number);

  const contextValue = {
    balance,
    activeAnts,
    grid,
    userAnts,
    ants,
    createAnt,
    withdrawAnt,
  };
//   console.log(userAnts);

  return (
    <AntContext.Provider value={contextValue}>
      {children}
    </AntContext.Provider>
  );
};
