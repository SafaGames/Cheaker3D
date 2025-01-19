import { nanoid } from 'nanoid'
import create from 'zustand'

import type { Color } from '@/logic/pieces'
import { isDev } from '@/utils/isDev'

export type Message = {
  author: string
  message: string
}

export const useMessageState = create<{
  messages: Message[]
  addMessage: (message: Message) => void
}>((set) => ({
  messages: [] as Message[],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}))

export const useOpponentState = create<{
  position: [number, number, number]
  mousePosition: [number, number, number]
  setPosition: (position: [number, number, number]) => void
  setMousePosition: (mousePosition: [number, number, number]) => void
  name: string
  setName: (name: string) => void
  uuid: string
  setUuid: (uuid: string) => void
}>((set) => ({
  position: [0, 100, 0],
  setPosition: (position) => set({ position }),
  name: ``,
  setName: (name) => set({ name }),
  mousePosition: [0, 0, 0],
  setMousePosition: (mousePosition) => set({ mousePosition }),
  uuid: ``,
  setUuid: (uuid) => set({ uuid }),
}))

export const usePlayerState = create<{
  username: string
  id: string
  setUsername: (username: string) => void
  room: string
  setRoom: (room: string) => void
  joinedRoom: boolean
  setJoinedRoom: (joinedRoom: boolean) => void
  playerColor: Color
  setPlayerColor: (color: Color) => void
  uuid: string
  setUuid: (uuid: string) => void
}>((set) => ({
  username: isDev ? `dev` : ``,
  setUsername: (username) => set({ username }),
  id: nanoid(),
  room: isDev ? `room` : ``,
  setRoom: (room) => set({ room }),
  joinedRoom: false,
  setJoinedRoom: (joinedRoom) => set({ joinedRoom }),
  playerColor: `white`,
  setPlayerColor: (color: Color) => set({ playerColor: color }),
  uuid: ``,
  setUuid: (uuid) => set({ uuid }),
}))
