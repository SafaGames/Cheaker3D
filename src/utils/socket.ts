import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'
import type { Socket } from 'socket.io-client'
// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'
import create from 'zustand'

import { BoardComponent, type MovingTo } from '@/components/Board'
import type { GameOver } from '@/pages'
import type {
  LeftRoomClient,
  SocketClientToServer,
  SocketServerToClient,
  playerJoinedServer,
} from '@/pages/api/socket'
import type { CameraMove } from '@/server/cameraMove'
import { useGameSettingsState } from '@/state/game'
import type { Message } from '@/state/player'
import {
  useOpponentState,
  usePlayerState,
  useMessageState,
} from '@/state/player'

type ClientSocket = Socket<SocketServerToClient, SocketClientToServer>
let socket: ClientSocket

export const useSocketState = create<{
  socket: ClientSocket | null
  setSocket: (socket: ClientSocket) => void
}>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}))

export const useSockets = ({
  reset,
  playerDrop,
}: {
  reset: VoidFunction
  playerDrop: (data: GameOver) => void
}): void => {
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const [addMessage] = useMessageState((state) => [state.addMessage])
  const { setGameStarted, setMovingTo } = useGameSettingsState((state) => ({
    setGameStarted: state.setGameStarted,
    setMovingTo: state.setMovingTo,
  }))
  const { setPlayerColor, setJoinedRoom } = usePlayerState((state) => state)

  const { setPosition, setName: setOpponentName } = useOpponentState(
    (state) => state,
  )

  const { socket: socketState, setSocket } = useSocketState((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }))

  const [opponentDroppedMessageSent, setOpponentDroppedMessageSent] =
    useState(false)

  useEffect(() => {
    socketInitializer()

    return () => {
      if (socketState) {
        socketState.emit(`playerLeft`, { room: usePlayerState.getState().room })
        socketState.disconnect()
      }
    }
  }, [])

  const socketInitializer = async () => {
    await fetch(`/api/socket`)
    socket = io()
    setSocket(socket)

    socket.on(`newIncomingMessage`, (msg: Message) => {
      addMessage(msg)
    })

    socket.on(`playerJoined`, (data: playerJoinedServer) => {
      const split = data.username.split(`#`)
      addMessage({
        author: `System`,
        message: `${split[0]} has joined ${data.room}`,
      })
      const { id, username } = usePlayerState.getState()
      if (split[1] === id) {
        setPlayerColor(data.color)
        setJoinedRoom(true)
      } else {
        socket.emit(`existingPlayer`, {
          room: data.room,
          name: `${username}#${id}`,
        })
        setOpponentName(split[0])
      }
    })

    socket.on(`playerDisconnected`, (data: boolean) => {
      if (data && !opponentDroppedMessageSent) {
        setOpponentDroppedMessageSent(true)
        const { name: opponentName, uuid: opponentUuid } =
          useOpponentState.getState()
        const { room, playerColor, uuid: playerUuid } = usePlayerState.getState()
        console.log(`${opponentName}, has dropped`)

        playerDrop({
          type: `dropped`,
          winner: playerColor,
          winnerUuid: playerUuid,
          loserUuid: opponentUuid,
          gameSessionUuid: room,
        })

        addMessage({
          author: `System`,
          message: `${opponentName} has dropped from ${room}`,
        })
      }
    })

    socket.on(`clientExistingPlayer`, (data: string) => {
      const split = data.split(`#`)
      if (split[1] !== usePlayerState.getState().id) {
        setOpponentName(split[0])
      }
    })

    socket.on(`cameraMoved`, (data: CameraMove) => {
      const { playerColor } = usePlayerState.getState()
      if (playerColor === data.color) {
        return
      }
      setPosition(data.position)
    })

    socket.on(`moveMade`, (data: MovingTo) => {
      setMovingTo(data)
    })

    socket.on(`gameReset`, () => {
      reset()
    })

    socket.on(`playersInRoom`, (data: number) => {
      if (data === 2) {
        setGameStarted(true)
      }
    })

    socket.on(`newError`, (err: string) => {
      toast.error(err, {
        toastId: err,
      })
    })
  }
}
