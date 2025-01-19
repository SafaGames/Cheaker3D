import type { Position, Tile } from '../board'
import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { getMove, getBasePiece } from './'
import { useHistoryState } from '@/state/history'

export function isPawn(value: Pawn | Piece | null): value is Pawn {
  return value?.type === `pawn`
}

const canEnPassant = (piece: Piece, colorMultiplier: number) => {
  const { history } = useHistoryState.getState()
  const lastMove = history[history.length - 1]
  if (
    lastMove &&
    lastMove.piece.type === `pawn` &&
    Math.abs(lastMove.steps.y) === 2
  ) {
    const isSameY = lastMove.to.y === piece.position.y
    const isOnRight = lastMove.to.x === piece.position.x + 1
    const isOnLeft = lastMove.to.x === piece.position.x - 1

    const canEnPassant = isSameY && (isOnRight || isOnLeft)
    if (canEnPassant) {
      return {
        steps: {
          x: isOnLeft ? -1 : 1,
          y: colorMultiplier,
        },
        piece: lastMove.piece,
      }
    }
  }
  return null
}

export const getPieceFromBoard = (
  board: Tile[][],
  position: Position,
): Piece | null => {
  const { x, y } = position;

  // Ensure indices are within bounds
  if (y < 0 || y >= board.length || x < 0 || x >= board[y]?.length) {
    return null; // Out of bounds, return null
  }

  const tile = board[y][x];
  return tile?.piece || null; // Safely access piece
};

export const pawnMoves: MoveFunction<Pawn> = ({
  piece,
  board,
  propagateDetectCheck,
}) => {
  const { color } = piece;
  const colorMultiplier = color === `white` ? -1 : 1; // Determine direction based on color

  const moves: Move[] = [];

  // 1. Diagonal forward movement (like a checker piece)
  const movesDiagonal: Position[] = [
    { x: 1, y: 1 * colorMultiplier },
    { x: -1, y: 1 * colorMultiplier },
  ];

  for (const steps of movesDiagonal) {
    const move = getMove({ piece, board, steps, propagateDetectCheck });

    // Allow simple diagonal moves if the target square is empty
    if (move) {
      moves.push(move);
    }
  }

  // 2. Capture movement (jumping over opponent pieces)
  const captureMoves: { steps: Position; capture: Position }[] = [
    {
      steps: { x: 2, y: 2 * colorMultiplier }, // Two diagonal steps forward
      capture: { x: 1, y: 1 * colorMultiplier }, // Opponent piece to capture
    },
    {
      steps: { x: -2, y: 2 * colorMultiplier }, // Two diagonal steps forward
      capture: { x: -1, y: 1 * colorMultiplier }, // Opponent piece to capture
    },
  ];

  for (const { steps, capture } of captureMoves) {
    // Check if the capture square contains an opponent piece
    const capturePiece = getPieceFromBoard(board, {
      x: piece.position.x + capture.x,
      y: piece.position.y + capture.y,
    });

    // Ensure the capture piece belongs to the opponent
    if (capturePiece && capturePiece.color !== piece.color) {
      // Check if the landing square is empty
      const landingMove = getMove({
        piece,
        board,
        steps,
        propagateDetectCheck,
      });

      if (landingMove ) {
        moves.push({
          ...landingMove,
          type: `capture`,
          capture: capturePiece,
        });
      }
    }
  }

  return moves;
};

export const createPawn = ({ color, id, position }: PieceFactory): Pawn => {
  const hasMoved = false
  return {
    hasMoved,
    ...getBasePiece({ color, id, type: `pawn`, position }),
  }
}

export type Pawn = Piece & {
  hasMoved: boolean
}
