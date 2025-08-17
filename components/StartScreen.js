import React from 'react';

export const StartScreen = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-70">
      <h1 className="text-6xl font-bold font-mono text-white animate-pulse">GALAXY SHOOTER</h1>
      <p className="text-lg mt-4 text-white">Use Arrow Keys to Move, Space to Shoot</p>
      <button
        onClick={onStart}
        className="mt-8 px-8 py-4 bg-white text-black font-bold text-2xl rounded-lg shadow-lg shadow-white/50 hover:bg-gray-300 transition-transform transform hover:scale-105"
      >
        START GAME
      </button>
    </div>
  );
};