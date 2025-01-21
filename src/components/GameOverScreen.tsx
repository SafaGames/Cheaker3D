import type { FC } from 'react'
import { useEffect } from 'react'

import { css } from '@emotion/react'
import axios from 'axios'
import { VscDebugRestart } from 'react-icons/vsc'

import type { GameOver } from '@/pages/index'
import { usePlayerState } from '@/state/player'
import { useSocketState } from '@/utils/socket'

export const GameOverScreen: FC<{
  gameOver: GameOver | null
}> = ({ gameOver }) => {
  const { room } = usePlayerState((state) => state)

  useEffect(() => {
    if (gameOver) {
      const winnerData = {
        gameSessionUuid: gameOver.gameSessionUuid,
        gameStatus: `FINISHED`,
        players: [
          {
            uuid: gameOver.winnerUuid,
            points: 100,
            userGameSessionStatus: `WON`,
          },
          {
            uuid: gameOver.loserUuid,
            points: 0,
            userGameSessionStatus: `DEFEATED`,
          },
        ],
      }

      if (gameOver.type === `stalemate`) {
        winnerData.gameStatus = `DRAWN`
        winnerData.players = [
          {
            uuid: gameOver.winnerUuid,
            points: 0,
            userGameSessionStatus: `DRAWN`,
          },
          {
            uuid: gameOver.loserUuid,
            points: 0,
            userGameSessionStatus: `DRAWN`,
          },
        ]
      } else if (gameOver.type === `dropped`) {
        winnerData.gameStatus = `DROPPED`
        winnerData.players = [
          {
            uuid: gameOver.winnerUuid,
            points: 100,
            userGameSessionStatus: `WON`,
          },
          {
            uuid: gameOver.loserUuid,
            points: 0,
            userGameSessionStatus: `DROPPED`,
          },
        ]
      }
      axios
        .post(`/api/sendWinner`, winnerData)
        .then((response) => {
          console.log(`Winner data sent successfully:`, response.data)
        })
        .catch((error) => {
          console.error(`Error sending winner data:`, error)
        })
    }
  }, [gameOver, room])

  return (
    <>
      {gameOver && (
        <div
          css={css`
            position: absolute;
            width: 50vw;
            min-width: 340px;
            height: auto;
            padding: 32px;
            background: #121212;
            border: 1px solid #333333;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            top: 50%;
            left: 50%;
            z-index: 100;
            transform: translate(-50%, -50%);
            animation: slideIn 0.5s ease-out;

            h1 {
              color: #f5f5f5;
              font-size: 2rem;
              font-weight: bold;
              margin-bottom: 16px;
              text-align: center;
            }

            p {
              color: #cccccc;
              font-size: 1rem;
              margin: 0;
              text-align: center;
              line-height: 1.5;
            }

            .winner {
              color: #4caf50;
              font-weight: bold;
              font-size: 1.2rem;
            }

            .status {
              color: #ff5722;
              font-weight: bold;
              font-size: 1.2rem;
            }

            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translate(-50%, -60%);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%);
              }
            }
          `}
        >
          <h1>
            {gameOver.type === `checkmate`
              ? `Checkmate!`
              : gameOver.type === `stalemate`
              ? `Stalemate!`
              : gameOver.type === `dropped`
              ? `Game Dropped!`
              : ``}
          </h1>
          {gameOver.type === `checkmate` && (
            <p>
              Winner: <span className="winner">{gameOver.winner}</span>
            </p>
          )}
          {gameOver.type === `stalemate` && (
            <p className="status">The game ends in a draw!</p>
          )}
          {gameOver.type === `dropped` && (
            <p>
              Game was dropped. <span className="status">No winner declared.</span>
            </p>
          )}
        </div>
      )}
    </>
  )
}
