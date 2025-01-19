import { useEffect, useState } from 'react'

import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import type { Color } from '@/logic/pieces'
import type { GameOver } from '@/pages'
import { useOpponentState, usePlayerState } from '@/state/player'
import { useSocketState } from '@/utils/socket'

export type JoinRoomClient = {
  room: string
  username: string
  color: Color
}

interface RoomResponse {
  gameSessionUuid: string
  name: string
  players: {
    name: string
    uuid: string
    profileImage: string
    ready: string
    color: Color
  }[]
}

export const GameCreation: React.FC = () => {
  const {
    room,
    username,
    joinedRoom,
    setUsername,
    setRoom,
    id,
    setUuid,
    setPlayerColor,
    playerColor,
  } = usePlayerState((state) => state)
  const { socket } = useSocketState((state) => ({
    socket: state.socket,
  }))
  const { setUuid: setOpponentUuid } = useOpponentState((state) => state)
  const [readyToSendRoom, setReadyToSendRoom] = useState(false)
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const router = useRouter()

  const sendRoom = async () => {
    if (!socket) return
    const data: JoinRoomClient = {
      room,
      username: `${username}#${id}`,
      color: playerColor,
    }
    socket.emit(`joinRoom`, data)
    socket.emit(`fetchPlayers`, { room })
  }

  useEffect(() => {
    if (readyToSendRoom) {
      sendRoom()
      setReadyToSendRoom(false) // Reset the flag after sending room
    }
  }, [readyToSendRoom])

  useEffect(() => {
    const { gameSessionUuid, gameStateId, uuid } = router.query
    if (gameSessionUuid && gameStateId && uuid && !joinedRoom) {
      fetchRoomDetails(gameSessionUuid as string, uuid as string)
    } else {
      toast.error(`Invalid URL parameters`, {
        toastId: `invalidParams`,
      })
    }
  }, [router.query.gameSessionUuid, router.query.uuid])

  const fetchRoomDetails = (gameSessionUuid: string, uuid: string) => {
    if (
      gameSessionUuid &&
      uuid &&
      localStorage.getItem(`gameSessionUuid`) !== gameSessionUuid
    ) {
      localStorage.setItem(`gameSessionUuid`, gameSessionUuid)
      axios
        .get(`/api/getRoom?gameSessionUuid=${gameSessionUuid}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`Failed to fetch room details`)
          }
          return response.data as RoomResponse
        })
        .then((data) => {
          data.players.forEach((player) => {
            if (player.uuid === uuid) {
              setUsername(player.name.toString())
              setPlayerColor(player.color)
              setUuid(uuid.toString())
              setRoom(gameSessionUuid.toString())
              localStorage.setItem(`playerName`, player.name)
              localStorage.setItem(`playerColor`, player.color)
              localStorage.setItem(`playerUuid`, uuid)
              setReadyToSendRoom(true) // Set the flag to send room
            } else {
              console.log(`opponentUuid---`, player.uuid)
              setOpponentUuid(player.uuid)
            }
          })
        })
        .catch((error) => {
          console.error(`Error fetching room details:`, error)
          toast.error(`Error fetching room details`, {
            toastId: `fetchRoomError`,
          })
        })
    } else if (localStorage.getItem(`gameSessionUuid`) === gameSessionUuid) {
      const playerNameFromStorage = localStorage.getItem(`playerName`)
      const playerUuidFromStorage = localStorage.getItem(`playerUuid`)

      if (playerNameFromStorage !== null && playerUuidFromStorage !== null) {
        setUsername(playerNameFromStorage)
        setUuid(playerUuidFromStorage)
        setRoom(gameSessionUuid.toString())
        setReadyToSendRoom(true)
        setGameOver(null)
      } else {
        console.error(`Error fetching room details from local storage`)
        toast.error(`Error fetching user details`, {
          toastId: `fetchRoomError`,
        })
      }
    }
  }

  return (
    <>
      {!joinedRoom && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (username.length < 3 || room.length < 3) {
              toast.error(`Name or Room is too short.`, {
                toastId: `nameOrRoomTooShort`,
              })
              return
            }
            setReadyToSendRoom(true) // Trigger sending room when form submitted
          }}
        >
          {/* Your form content here */}
          <button type="submit" style={{ display: `none` }}>
            Join Room
          </button>
        </form>
      )}
    </>
  )
}
