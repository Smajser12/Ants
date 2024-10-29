import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useMultiChain } from '../../MultiChainProvider/MultiChainProvider';
import { formatUnits } from 'viem';

interface GameOfLifeContextType {
  transferCount: number;
  board: number[];
  balance: string;
  refreshData: () => void;
}

const GameOfLifeContext = createContext<GameOfLifeContextType | undefined>(undefined);

export const useGameOfLife = () => {
  const context = useContext(GameOfLifeContext);
  if (!context) {
    throw new Error('useGameOfLife must be used within a GameOfLifeProvider');
  }
  return context;
};

export const GameOfLifeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const { spartanContract } = useMultiChain(); // Use the MultiChainProvider to get the contract
  const [transferCount, setTransferCount] = useState<number>(0);
  const [board, setBoard] = useState<number[]>([]);
  const [balance, setBalance] = useState<string>('0');

  const { data: transferCountData } = useReadContract({
    ...spartanContract,
    functionName: 'getTransferCount',
    args: [],
  });

  const { data: boardData } = useReadContract({
    ...spartanContract,
    functionName: 'getBoard',
    // refetchInterval: 100,

    args: [],
    query: {
      refetchInterval: 500,
    },
  });

  const { data: balanceData } = useReadContract({
    ...spartanContract,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
  });

  useEffect(() => {
    if (transferCountData) {
      setTransferCount(Number(transferCountData));
    }
    if (boardData) {
      setBoard(boardData as number[]);
    }
    if (balanceData) {
      setBalance(formatUnits(balanceData as bigint, 18));
    }
  }, [transferCountData, boardData, balanceData]);

  const refreshData = () => {
    // Logic to refresh data if needed
  };

  const contextValue = {
    transferCount,
    board,
    balance,
    refreshData,
  };
  console.log(contextValue)

  return (
    <GameOfLifeContext.Provider value={contextValue}>
      {children}
    </GameOfLifeContext.Provider>
  );
};
