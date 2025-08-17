// This file should be renamed to components/Player.js
import React from 'react';

export const Player = ({ player }) => {
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
