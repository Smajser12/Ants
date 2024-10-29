// import { useState, useEffect, useCallback } from 'react'
// import { Button } from "@/components/ui/button"
import { useGameOfLife } from './context/gameOfLifeContext'
// import { Input } from "@/components/ui/input"
// import { ethers } from 'ethers'
// import { useContract, useProvider, useWatchContractEvent } from 'wagmi'

// Assuming you have the ABI and contract address

const numCols = 64

function parseBoard(boardData: number[]) {
  const WIDTH = 64;
  const HEIGHT = 64;
  const matrix = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(0));
  
  boardData.forEach((uint256Value, arrayIndex) => {
    const binaryString = BigInt(uint256Value).toString(2).padStart(256, '0');
    
    for (let bitPosition = 0; bitPosition < 256; bitPosition++) {
      const position = arrayIndex * 256 + bitPosition;
      const y = Math.floor(position / WIDTH);
      const x = position % WIDTH;
      
      if (y < HEIGHT && x < WIDTH) {
        matrix[y][x] = binaryString[binaryString.length - 1 - bitPosition] === '1' ? 1 : 0;
      }
    }
  });
  
  return matrix;
}

export function GameOfLife() {
  const { board } = useGameOfLife();
  const parsedBoard = parseBoard(board);

  return (
    <div className="min-h-screen bg-[#FAF0DC] flex items-center justify-center p-4 font-['Chloe']">
      <div className="max-w-full overflow-auto">
        <h1 className="text-2xl mb-4 text-center text-black font-bold">Game of Life</h1>
        <div 
          className="grid gap-0 mb-4 mx-auto" 
          style={{ 
            gridTemplateColumns: `repeat(${numCols}, minmax(6px, 12px))`,
            width: 'fit-content'
          }}
        >
          {parsedBoard.map((row, rowIndex) =>
            row.map((cellState, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square ${
                  cellState ? 'bg-[#0040ff]' : 'bg-[#FAF0DC]'
                }`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
