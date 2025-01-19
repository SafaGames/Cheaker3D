import type { Piece, PieceArgs } from './pieces'
import { createPiece } from './pieces'
import type { Pawn } from './pieces/pawn'
import type { Rook } from './pieces/rook'

export type Position = { x: number; y: number }

export type Board = Tile[][]

export type Tile = {
  position: Position
  piece: Pawn | Piece | Rook | null
}
export const createTile = (position: Position, piece?: PieceArgs): Tile => {
  return {
    position,
    piece: piece ? createPiece({ ...piece, position }) : null,
  }
}

export const checkIfPositionsMatch = (
  pos1?: Position | null,
  pos2?: Position | null,  
): boolean => {
  if (!pos1 || !pos2) return false
  return pos1.x === pos2.x && pos1.y === pos2.y
}

export const copyBoard = (board: Board): Board => {
  return [
    ...board.map((row) => {
      return [
        ...row.map((tile) => {
          return { ...tile, piece: tile.piece ? { ...tile.piece } : null }
        }),
      ]
    }),
  ]
}

export const createBoard = (): Board => {
  const DEFAULT_BOARD: Board = [
    // row 1
    [
      createTile(
        { x: 0, y: 0 }
      ),
      createTile(
        { x: 1, y: 0 },
        {
          color: `black`,
          id: 1,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 2, y: 0 }
      ),
      createTile(
        { x: 3, y: 0 },
        {
          color: `black`,
          id: 2,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 4, y: 0 }
      ),
      createTile(
        { x: 5, y: 0 },
        {
          color: `black`,
          id: 3,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 6, y: 0 }
      ),
      createTile(
        { x: 7, y: 0 },
        {
          color: `black`,
          id: 4,
          type: `pawn`,
        },
      ),
    ],
    // row 2
    [
      createTile(
        { x: 0, y: 1 },
        {
          color: `black`,
          id: 5,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 1, y: 1 }
      ),
      createTile(
        { x: 2, y: 1 },
        {
          color: `black`,
          id: 6,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 3, y: 1 }
      ),
      createTile(
        { x: 4, y: 1 },
        {
          color: `black`,
          id: 7,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 5, y: 1 }
      ),
      createTile(
        { x: 6, y: 1 },
        {
          color: `black`,
          id: 8,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 7, y: 1 }
      ),
    ],
    // row 3
    [
      createTile(
        { x: 0, y: 2 }
      ),
      createTile(
        { x: 1, y: 2 },
        {
          color: `black`,
          id: 9,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 2, y: 2 }
      ),
      createTile(
        { x: 3, y: 2 },
        {
          color: `black`,
          id: 10,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 4, y: 2 }
      ),
      createTile(
        { x: 5, y: 2 },
        {
          color: `black`,
          id: 11,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 6, y: 2 }
      ),
      createTile(
        { x: 7, y: 2 },
        {
          color: `black`,
          id: 12,
          type: `pawn`,
        },
      ),
    ],
    // row 4
    [
      ...Array(8)
        .fill(null)
        .map((_, i) => createTile({ x: i, y: 3 })),
    ],
    // row 5
    [
      ...Array(8)
        .fill(null)
        .map((_, i) => createTile({ x: i, y: 4 })),
    ],
    // row 6
    [
      createTile(
        { x: 0, y: 5 },
        {
          color: `white`,
          id: 1,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 1, y: 5 }
      ),
      createTile(
        { x: 2, y: 5 },
        {
          color: `white`,
          id: 2,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 3, y: 5 }
      ),
      createTile(
        { x: 4, y: 5 },
        {
          color: `white`,
          id: 3,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 5, y: 5 }
      ),
      createTile(
        { x: 6, y: 5 },
        {
          color: `white`,
          id: 4,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 7, y: 5 }
      ),
    ],
    // row 7
    [
      createTile(
        { x: 0, y: 6 }
      ),
      createTile(
        { x: 1, y: 6 },
        {
          color: `white`,
          id: 5,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 2, y: 6 }
      ),
      createTile(
        { x: 3, y: 6 },
        {
          color: `white`,
          id: 6,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 4, y: 6 }
      ),
      createTile(
        { x: 5, y: 6 },
        {
          color: `white`,
          id: 7,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 6, y: 6 }
      ),
      createTile(
        { x: 7, y: 6 },
        {
          color: `white`,
          id: 8,
          type: `pawn`,
        },
      ),
    ],
    // row 8
    [
      createTile(
        { x: 0, y: 7 },
        {
          color: `white`,
          id: 9,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 1, y: 7 }
        
      ),
      createTile(
        { x: 2, y: 7 },
        {
          color: `white`,
          id: 10,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 3, y: 7 }
        
      ),
      createTile(
        { x: 4, y: 7 },
        {
          color: `white`,
          id: 11,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 5, y: 7 }
        
      ),
      createTile(
        { x: 6, y: 7 },
        {
          color: `white`,
          id: 12,
          type: `pawn`,
        },
      ),
      createTile(
        { x: 7, y: 7 }
        
      ),
    ],
  ]
  return DEFAULT_BOARD
}

