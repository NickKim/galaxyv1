import React from 'react';

const PIXEL_SIZE = 5; // Size of each "pixel" in the UFO
const UFO_MAP = [
  "  ##  ",
  " #### ",
  "######",
  "# ## #",
];

// Pre-calculate shadow to avoid re-calculating on every render
const boxShadows = [];
let firstPixel = null;

// Find the first pixel to use as the base element, so we can offset shadows correctly
for (let y = 0; y < UFO_MAP.length; y++) {
    for (let x = 0; x < UFO_MAP[y].length; x++) {
        if (UFO_MAP[y][x] === '#') {
            firstPixel = { x, y };
            break;
        }
    }
    if (firstPixel) break;
}

if (firstPixel) {
  UFO_MAP.forEach((row, y) => {
      row.split('').forEach((char, x) => {
          // Skip the first pixel since it will be the element itself
          if (char === '#' && !(x === firstPixel.x && y === firstPixel.y)) {
              const relX = (x - firstPixel.x) * PIXEL_SIZE;
              const relY = (y - firstPixel.y) * PIXEL_SIZE;
              boxShadows.push(`${relX}px ${relY}px 0 0 white`);
          }
      });
  });
}
const finalBoxShadow = boxShadows.join(', ');

export const Enemy = ({ enemy }) => {
  if (!firstPixel) return null; // Should not happen with the current map

  return (
    <div
      className="absolute bg-white"
      style={{
        left: enemy.x + firstPixel.x * PIXEL_SIZE,
        top: enemy.y + firstPixel.y * PIXEL_SIZE,
        width: `${PIXEL_SIZE}px`,
        height: `${PIXEL_SIZE}px`,
        boxShadow: finalBoxShadow,
      }}
    />
  );
};