
import React from 'react';
import type { PlayerState } from '../types';

interface PlayerProps {
  player: PlayerState;
}

export const Player: React.FC<PlayerProps> = ({ player }) => {
  return (
    <div
      className="absolute bg-white"
      style={{
        left: player.x,
        top: player.y,
        width: '50px',
        height: '30px',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
      }}
    />
  );
};
