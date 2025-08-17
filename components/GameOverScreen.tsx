
import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-70">
      <h1 className="text-6xl font-bold font-mono text-white">GAME OVER</h1>
      <p className="text-3xl mt-4 text-white">Final Score: {score}</p>
      <button
        onClick={onRestart}
        className="mt-8 px-8 py-4 bg-white text-black font-bold text-2xl rounded-lg shadow-lg shadow-white/50 hover:bg-gray-300 transition-transform transform hover:scale-105"
      >
        RESTART
      </button>
    </div>
  );
};
