
import React from 'react';
import type { BulletState } from '../types';
import { BULLET_WIDTH, BULLET_HEIGHT } from '../constants';

interface BulletProps {
  bullet: BulletState;
}

export const Bullet: React.FC<BulletProps> = ({ bullet }) => {
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
