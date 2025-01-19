import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { css } from '@emotion/react'
import type { Board } from '@logic/board'
import { createBoard } from '@logic/board'
import type { Color, GameOverType, Move, Piece } from '@logic/pieces'
import { Environment, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { BoardComponent } from '@/components/Board'
import { Chat } from '@/components/Chat'
import { GameCreation } from '@/components/GameCreation'
import { GameOverScreen } from '@/components/GameOverScreen'
import { Loader } from '@/components/Loader'
// import { Opponent } from '@/components/Opponent'
import { Sidebar } from '@/components/Sidebar'
import { StatusBar } from '@/components/StatusBar'
import { Toast } from '@/components/Toast'
import { Border } from '@/models/Border'
import { useGameSettingsState } from '@/state/game'
import { useHistoryState } from '@/state/history'
import { usePlayerState } from '@/state/player'
import { useSockets } from '@/utils/socket'

export type GameOver = {
  type: GameOverType
  winner: Color
  winnerUuid: string | null
  loserUuid: string | null
  gameSessionUuid: string | null
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selected, setSelected] = useState<Piece | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const resetHistory = useHistoryState((state) => state.reset)
  const { resetTurn } = useGameSettingsState((state) => ({
    resetTurn: state.resetTurn,
    gameStarted: state.gameStarted,
  }))
  const [userColor, setUserColor] = useState<string | null>(null)
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>(
    [19.378722300414594, 1.1132083409597933, 0.22254556157482883],
  )
  const { joined } = usePlayerState((state) => ({
    joined: state.joinedRoom,
  }))

  const reset = () => {
    setBoard(createBoard())
    setSelected(null)
    setMoves([])
    resetHistory()
    resetTurn()
    setGameOver(null)
  }

  const playerDrop = (data: GameOver) => {
    setGameOver(data)
  }

  useSockets({ reset, playerDrop })

  const [total, setTotal] = useState(0)
  const { progress } = useProgress()
  useEffect(() => {
    setTotal(progress)
  }, [progress])

  // const { playerColor } = usePlayerState((state) => ({
  //   playerColor: state.playerColor,
  // }))

  useEffect(() => {
    if (typeof window !== `undefined`) {
      setTimeout(() => {
        const color = localStorage.getItem(`playerColor`)
        if (color === `black`) {
          setPlayerPosition([
            -0.06636210967162483, 13.535983799864464, -11.68363251265795,
          ])
        } else if (color === `white`) {
          setPlayerPosition([0, 14, 11])
        }
        setUserColor(color)
      }, 10000)
    }
  }, [])

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        background-color: #000;
        background: linear-gradient(180deg, #000000, #242424);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      {total === 100 ? <GameCreation /> : <Loader />}
      <Sidebar board={board} moves={moves} selected={selected} />
      {joined && <Chat />}
      <StatusBar />
      <GameOverScreen gameOver={gameOver} />
      <Toast />
      {!userColor ? (
        <Loader />
      ) : (
        !gameOver && (
          <Canvas shadows camera={{ position: playerPosition, fov: 55 }}>
            <Environment files={`dawn.hdr`} />
            {/* <Opponent /> */}
            <Border />
            <BoardComponent
              selected={selected}
              setSelected={setSelected}
              board={board}
              setBoard={setBoard}
              moves={moves}
              setMoves={setMoves}
              setGameOver={setGameOver}
            />
          </Canvas>
        )
      )}
    </div>
  )
}

export default Home
