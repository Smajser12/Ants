// import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
// import { useAccount, useReadContract } from 'wagmi';
// import { formatUnits, formatEther } from 'viem';
// import { useMultiChain } from '../../../MultiChainProvider/MultiChainProvider';

// const MyBarnContext = createContext();

// export const useMyBarn = () => useContext(MyBarnContext);

// export const MyBarnProvider = ({ children }) => {
//   const { address, isConnected } = useAccount();
//   const { apeContract } = useMultiChain();

//   const { data: balanceData } = useReadContract({
//     ...apeContract,
//     functionName: 'balanceOf',
//     args: [address],
//     watch: true,
//     enabled: isConnected && !!apeContract.address,
    
//   });

//   const { data: rewardsData } = useReadContract({
//     ...apeContract,
//     functionName: 'calculateRewards',
//     args: [address],
//     watch: true,
//     enabled: isConnected && !!apeContract.address,
//   });

//   const { data: baseRewardRate } = useReadContract({
//     ...apeContract,
//     functionName: 'BaseRewardRate',
//     watch: true,
//   });

//   const { data: bonusRewardRate } = useReadContract({
//     ...apeContract,
//     functionName: 'BonusRewardRate',
//     args: [address],
//     watch: true,
//     enabled: isConnected && !!apeContract.address,
//   });

//   const { data: eggBalanceData } = useReadContract({
//     ...apeContract,
//     functionName: 'EggBalance',
//     args: [address],
//     watch: true,
//     enabled: isConnected && !!apeContract.address,
//   });

//   const { data: price1 } = useReadContract({
//     ...apeContract,
//     functionName: 'BonusPrice',
//     args: [1],
//   });

//   const { data: boost1 } = useReadContract({
//     ...apeContract,
//     functionName: 'BonusRewardBoost',
//     args: [1],
//   });

//   // Dolls (ID: 2)
//   const { data: price2 } = useReadContract({
//     ...apeContract,
//     functionName: 'BonusPrice',
//     args: [2],
//   });

//   const { data: boost2 } = useReadContract({
//     ...apeContract,
//     functionName: 'BonusRewardBoost',
//     args: [2],
//   });

//   // Powder (ID: 3)
//   const { data: price3 } = useReadContract({
//     ...apeContract,
//     functionName: 'BonusPrice',
//     args: [3],
//   });

//   const { data: boost3 } = useReadContract({
//     ...apeContract,
//     functionName: 'BonusRewardBoost',
//     args: [3],
//   });
//   const boostData = [
//     {
//       id: 1,
//       name: 'Chicken juice',
//       image: '../../../ChickenPotion.png',
//       price: Number(price1),
//       boost: Number(boost1),
//     },
//     {
//       id: 2,
//       name: 'Sex Dolls',
//       image: '../../../ChickenDoll.png',
//       price: Number(price2) ,
//       boost: Number(boost2),
//     },
//     {
//       id: 3,
//       name: 'Chicken Sniffer Goober',
//       image: '../../../ChickenSniffer.png',
//       price: Number(price3) ,
//       boost: Number(boost3),
//     },
//   ];


//   const balance = useMemo(() => balanceData ? formatUnits(balanceData, 18) : '0', [balanceData]);
//   const eggBalance = useMemo(() => eggBalanceData ? formatUnits(eggBalanceData, 18) : '0', [eggBalanceData]);

//   const pendingRewards = useMemo(() => rewardsData ? formatUnits(rewardsData, 18) : '0', [rewardsData]);
//   const totalRewardRate = useMemo(() => {
//     if (baseRewardRate && bonusRewardRate) {
//       return (Number(baseRewardRate) + Number(bonusRewardRate)); // Assuming the rates are in basis points
//     }
//     return 0;
//   }, [baseRewardRate, bonusRewardRate]);

//   const contextValue = {
//     balance,
//     eggBalance,
//     pendingRewards,
//     totalRewardRate,
//     baseRewardRate,
//     bonusRewardRate,
//     boostOptions: boostData,
//   };
//   console.log(contextValue)
//   // console.log(eggBalance)

//   return (
//     <MyBarnContext.Provider value={contextValue}>
//       {children}
//     </MyBarnContext.Provider>
//   );
// };