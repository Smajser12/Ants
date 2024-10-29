'use client'
import  {useEffect, useRef } from 'react'
// import { Terminal } from 'lucide-react'
import '../index.css'
// import { ConnectButton } from '@rainbow-me/rainbowkit'
// import { useMatrix } from './context/matrixContext'
// import { useAccount } from 'wagmi'
// import { useNavigate } from 'react-router-dom'

export const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const columns = canvas.width / 20
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const words = [
      "Supercycle (real)",
      "Not a Ponzi",
      "Token mintable",
      "Believe in something",
      "Gainzy is Fed",
      "Vitamin ButterChicken",
      "Rug",
      "Real",
      "One day I was rawdogging that bitch and I said to myself, I'm holding CMD, So I can nut inside cause the kid gonna be a genius",
      "Retar Dio",
      "MiLady",
      "Remilio",
      "Billions will dance",
      "The Matrix is real",
      "Wake up Neo",
      "The Matrix has you",
      "Follow the white rabbit",
      "Dev Cock Is Absolutely Gigantic",
      "Neo, you're a wizard",
      "Retardio",
      "TypeShit",
      "ETH/BTC reserval soon",
      "SOL = Broke",
      "Buy more",
      "Bet more",
      "Drink more"
    ]



    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0F0'
      ctx.font = '15px monospace'

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < 0.003) { // 0.1% chance to draw a word instead of a character
          const word = words[Math.floor(Math.random() * words.length)]
          ctx.fillText(word, i * 20, drops[i] * 20)
          drops[i] += word.length // Move the drop down by the word length
        } else {
          const text = String.fromCharCode(Math.random() * 128)
          ctx.fillText(text, i * 20, drops[i] * 20)
        }

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />
}
