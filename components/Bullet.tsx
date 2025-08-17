// This file should be renamed to components/Bullet.js
import React from 'react';
import { BULLET_WIDTH, BULLET_HEIGHT } from '../constants.js';

export const Bullet = ({ bullet }) => {
  return (
    <div
      className="absolute bg-white rounded"
      style={{
        left: bullet.x,
        top: bullet.y,
        width: `${BULLET_WIDTH}px`,
        height: `${BULLET_HEIGHT}px`,
      }}
    />
  );
};
