import type { FC } from 'react'

import { css } from '@emotion/react'

import { useGameSettingsState } from '@/state/game'
import { usePlayerState } from '@/state/player'
import { uppercaseFirstLetter } from '@/utils/upperCaseFirstLetter'

export const StatusBar: FC = () => {
  const { room, joinedRoom, playerColor } = usePlayerState((state) => ({
    room: state.room,
    joinedRoom: state.joinedRoom,
    playerColor: state.playerColor,
  }))
  const { gameStarted, turn } = useGameSettingsState((state) => ({
    gameStarted: state.gameStarted,
    turn: state.turn,
  }))

  return (
    <div
      css={css`
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(50, 50, 50, 0.6));
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
        border-radius: 16px;
        padding: 20px 28px;
        color: #ffffff;
        font-size: 16px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;

        p {
          margin: 0;
          font-weight: 600;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: fadeIn 0.6s ease-in-out;
        }

        .player-color {
          color: ${playerColor === 'black' ? '#ffffff' : '#000000'};
          background: ${playerColor === 'black' ? '#333333' : '#f5f5f5'};
          border: 2px solid ${playerColor === 'black' ? '#555555' : '#cccccc'};
          padding: 6px 10px;
          border-radius: 8px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

        .turn-indicator {
          background: linear-gradient(
            90deg,
            ${turn === playerColor ? '#34d399' : '#f87171'} 0%,
            ${turn === playerColor ? '#6ee7b7' : '#fca5a5'} 100%
          );
          color: #ffffff;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 15px;
          font-weight: bold;
          text-transform: uppercase;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
          animation: pulse 1.5s infinite;
        }

        .waiting {
          font-size: 16px;
          color: #ffc107;
          font-weight: 700;
          background: rgba(0, 0, 0, 0.6);
          padding: 10px 20px;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          animation: bounce 1s infinite alternate;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-10px);
          }
        }
      `}
    >
      {joinedRoom && (
        <p>
          Turn{' '}
          <span className="turn-indicator">{uppercaseFirstLetter(turn)}</span>
        </p>
      )}
      {!gameStarted && joinedRoom && (
        <p className="waiting">Waiting for Opponent...</p>
      )}
    </div>
  )
}

