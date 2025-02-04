import type { MoveFunction, Piece, PieceFactory } from './'
import { getFarMoves, getBasePiece } from './'

export function isQueen(value: Piece | Queen | null): value is Queen {
  return value?.type === `queen`
}

export const queenMoves: MoveFunction = ({
   piece,
  board,
  propagateDetectCheck,
}) => {
  const props = { piece, board, propagateDetectCheck }
  const moveRightDown = getFarMoves({ dir: { x: 1, y: 1 }, ...props })
  const moveLeftUp = getFarMoves({ dir: { x: -1, y: -1 }, ...props })
  const moveLeftDown = getFarMoves({ dir: { x: -1, y: 1 }, ...props })
  const moveRightUp = getFarMoves({ dir: { x: 1, y: -1 }, ...props })
  return [...moveRightDown, ...moveLeftUp, ...moveLeftDown, ...moveRightUp]
}

export const createQueen = ({ color, id, position }: PieceFactory): Queen => {
  return {
    ...getBasePiece({ color, id, type: `queen`, position }),
  }
}

export type Queen = Piece
