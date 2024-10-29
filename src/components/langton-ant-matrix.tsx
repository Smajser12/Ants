import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle } from 'lucide-react'
import { useAnt } from './context/antContext'

const GRID_SIZE = 64 // Changed to match contract's grid size
const NEON_COLORS = [
  '#FF00FF', // Neon Pink
  '#00FFFF', // Cyan
  '#FF6600', // Neon Orange
  '#39FF14', // Neon Green
  '#FF10F0', // Hot Pink
  '#FF3131', // Neon Red
  '#4D4DFF', // Neon Blue
  '#FFD700', // Neon Gold
  '#7FFF00', // Neon Lime
  '#FF1493', // Deep Pink
] as const

// Helper function to get color by ant ID
const getAntColor = (antId: number) => {
  return NEON_COLORS[Number(antId) % Number(NEON_COLORS.length)]
}

export function LangtonAntMatrix() {
  const { grid, ants, activeAnts, balance, createAnt, withdrawAnt } = useAnt()
  const [antName, setAntName] = useState('')
  const [stakingAmount, setStakingAmount] = useState('100')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateAnt = async () => {
    if (!antName || !stakingAmount) return
    if (activeAnts.length >= 10) {
      alert('Maximum number of ants (10) reached!')
      return
    }
    
    setIsCreating(true)
    try {
      await createAnt(antName, stakingAmount)
      setAntName('')
    } catch (error) {
      console.error('Failed to create ant:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleWithdrawAnt = async (antId: number) => {
    try {
      await withdrawAnt(antId)
    } catch (error) {
      console.error('Failed to withdraw ant:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black to-green-900 text-green-500 font-mono">
      <div className="flex-grow p-4 flex items-center justify-center">
        <div className="relative border border-green-500 inline-block">
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className="w-[10px] h-[10px] border border-green-900 flex items-center justify-center"
                  style={{ backgroundColor: cell > 0 ? getAntColor(cell) : 'black' }}
                >
                  {activeAnts.map(antId => {
                    const ant = ants[antId]
                    if (ant && ant.x === x && ant.y === y) {
                      return (
                        <div
                          key={antId}
                          className="ant-highlight text-[8px] font-bold leading-none"
                          style={{
                            color: getAntColor(antId),
                            transform: `rotate(${ant.dir * 90}deg)`
                          }}
                        >
                          A
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="w-64 p-4 flex flex-col space-y-4">
        <div>
          <Label>Balance: {balance} LANT</Label>
        </div>
        
        <div className="space-y-2">
          <Label>Active Ants: {activeAnts.length}/10</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ant-name">Ant Name</Label>
          <Input
            id="ant-name"
            value={antName}
            onChange={(e) => setAntName(e.target.value)}
            placeholder="Enter ant name"
            className="bg-transparent border-green-500"
            disabled={activeAnts.length >= 10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="staking-amount">Staking Amount</Label>
          <Input
            id="staking-amount"
            type="number"
            value={stakingAmount}
            onChange={(e) => setStakingAmount(e.target.value)}
            placeholder="Amount to stake"
            className="bg-transparent border-green-500"
            disabled={activeAnts.length >= 10}
          />
        </div>

        <Button 
          onClick={handleCreateAnt} 
          variant="outline" 
          className="w-full"
          disabled={isCreating || activeAnts.length >= 10}
        >
          <PlusCircle className="mr-2" />
          {isCreating ? 'Creating...' : 'Create Ant'}
        </Button>

        <div className="space-y-4">
          {activeAnts.map(antId => {
            const ant = ants[antId]
            if (!ant) return null
            
            return (
              <div 
                key={antId} 
                className="p-4 border border-green-500 rounded"
                style={{ borderColor: getAntColor(antId) }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span style={{ color: getAntColor(antId) }}>Ant #{antId}</span>
                  {ant.owner.toLowerCase() === address?.toLowerCase() && (
                    <Button 
                      onClick={() => handleWithdrawAnt(antId)} 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500"
                    >
                      <MinusCircle />
                      <span className="sr-only">Withdraw Ant #{antId}</span>
                    </Button>
                  )}
                </div>
                <div>Name: {ant.name}</div>
                <div>Moves Left: {ant.movesLeft.toString()}</div>
                <div>Staked: {formatUnits(ant.stakedTokens, 18)} LANT</div>
              </div>
            )
          })}
        </div>
      </div>
      <style jsx>{`
        .ant-highlight {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { text-shadow: 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.7); }
          100% { text-shadow: 0 0 0 rgba(255, 255, 255, 0.7); }
        }
      `}</style>
    </div>
  )
}