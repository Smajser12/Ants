import React, { createContext, useContext, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatUnits, parseEther } from 'viem';
import { useMultiChain } from '../../MultiChainProvider/MultiChainProvider';

const MatrixContext = createContext<any>(null);

export const useMatrix = () => useContext(MatrixContext);

export const MatrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const { spartanContract } = useMultiChain();
  const { writeContract } = useWriteContract();

  const { data: balanceData } = useReadContract({
    ...spartanContract,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
  } as const);

  const { data: rewardsData } = useReadContract({
    ...spartanContract,
    functionName: 'calculateRewards',
    args: [address],
  } as const);

  const { data: baseRewardRate } = useReadContract({
    ...spartanContract,
    functionName: 'BaseRewardRate',
  } as const);

  const { data: bonusRewardRate } = useReadContract({
    ...spartanContract,
    functionName: 'BonusRewardRate',
    args: [address],
  } as const);

  const { data: lastSessionTimestamp } = useReadContract({
    ...spartanContract,
    functionName: 'LastSessionTimestamp',
    args: [address],
  } as const);

  const bonusData = useMemo(() => {
    const bonuses = [
      { id: 1, name: 'Upgrade GPU', price: parseEther('0.02'), boost: BigInt(1157407400000 / 2) },
      { id: 2, name: 'TRAIN AI', price: parseEther('0.05'), boost: BigInt(1157407400000 * 2) },
      { id: 3, name: 'Computer Cocaine', price: parseEther('0.1'), boost: BigInt(1157407400000 * 5) },
    ];

    return bonuses.map(bonus => ({
      ...bonus,
      priceFormatted: formatUnits(bonus.price, 18),
      boostFormatted: formatUnits(bonus.boost, 18),
    }));
  }, []);

  const balance = useMemo(() => balanceData ? formatUnits(balanceData as bigint, 18) : '0', [balanceData]);
  const pendingRewards = useMemo(() => rewardsData ? formatUnits(rewardsData as bigint, 18) : '0', [rewardsData]);
  const currentRewardRate = useMemo(() => {
    if (baseRewardRate && bonusRewardRate) {
      return BigInt(baseRewardRate as bigint) + BigInt(bonusRewardRate as bigint);
    }
    return BigInt(0);
  }, [baseRewardRate, bonusRewardRate]);
  
  const lastSession = useMemo(() => lastSessionTimestamp ? Number(lastSessionTimestamp) : 0, [lastSessionTimestamp]);

  const claimRewards = async () => {
    if (!spartanContract.address) return;
    try {
      await writeContract({
        ...spartanContract,
        functionName: 'ClaimRewards',
        args: [],
        address: spartanContract.address, // Ensure this is always defined
      } as const);
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  };

  const buyBonus = async (bonusId: number) => {
    if (!spartanContract.address) {
      throw new Error("Contract address is undefined");
    }

    const bonus = bonusData.find((b) => b.id === bonusId);
    if (!bonus) {
      throw new Error("Invalid bonus ID");
    }

    try {
      await writeContract({
        ...spartanContract,
        functionName: "buyBonus",
        args: [BigInt(bonusId)],
        value: bonus.price,
        address: spartanContract.address, // Ensure this is always defined
      } as const);
    } catch (error) {
      console.error("Error buying bonus:", error);
      throw error;
    }
  };

  console.log((lastSession))

  const contextValue = {
    balance,
    pendingRewards,
    currentRewardRate,
    bonuses: bonusData,
    claimRewards,
    buyBonus,
    lastSessionTimestamp: lastSession,
    BaseRewardRate: baseRewardRate,
    BonusRewardRate: bonusRewardRate,
  };
  console.log(contextValue)

  return (
    <MatrixContext.Provider value={contextValue}>
      {children}
    </MatrixContext.Provider>
  );
};
