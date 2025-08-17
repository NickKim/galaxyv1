// This file should be renamed to App.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from './components/Player.js';
import { Enemy } from './components/Enemy.js';
import { Bullet } from './components/Bullet.js';
import { StartScreen } from './components/StartScreen.js';
import { GameOverScreen } from './components/GameOverScreen.js';
import { GameState } from './types.js';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_WIDTH, 
  PLAYER_HEIGHT,
  PLAYER_SPEED, 
  ENEMY_WIDTH, 
  ENEMY_HEIGHT,
  ENEMY_SPEED,
  BULLET_SPEED,
  ENEMY_SPAWN_INTERVAL,
  BULLET_WIDTH,
  BULLET_HEIGHT
} from './constants.js';

const App = () => {
  const [gameState, setGameState] = useState(GameState.Start);
  const [player, setPlayer] = useState({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 });
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);

  const keysPressed = useRef(new Set());
  const gameLoopRef = useRef(null);
  const enemySpawnTimerRef = useRef(null);

  // Use a ref to store the latest state for the game loop to prevent stale closures.
  const latestState = useRef({ player, enemies, bullets, score, gameState });
  useEffect(() => {
    latestState.current = { player, enemies, bullets, score, gameState };
  });

  const startGame = () => {
    setPlayer({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 });
    setEnemies([]);
    setBullets([]);
    setScore(0);
    keysPressed.current.clear();
    setGameState(GameState.Playing);
  };

  const gameOver = useCallback(() => {
    setGameState(GameState.GameOver);
  }, []);

  const spawnEnemy = useCallback(() => {
    setEnemies(prev => {
      // Prevent spawning if game is not playing
      if (latestState.current.gameState !== GameState.Playing) return prev;
      const x = Math.random() * (GAME_WIDTH - ENEMY_WIDTH);
      return [...prev, { id: Date.now(), x, y: -ENEMY_HEIGHT }];
    });
  }, []);

  const shoot = useCallback(() => {
    setBullets(prev => [...prev, { id: Date.now(), x: latestState.current.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: latestState.current.player.y }]);
  }, []);

  const handleKeyDown = useCallback((e) => {
    keysPressed.current.add(e.key);
    // Use the ref to check the game state to prevent shooting on start/game over screens
    if (e.key === ' ' && latestState.current.gameState === GameState.Playing) {
      e.preventDefault();
       if (!e.repeat) { // Fire only once per key press
        shoot();
      }
    }
  }, [shoot]);

  const handleKeyUp = useCallback((e) => {
    keysPressed.current.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const gameLoop = useCallback(() => {
    // Read the latest state from the ref
    const { player, enemies, bullets } = latestState.current;

    // 1. Calculate new player position
    let newPlayerX = player.x;
    if (keysPressed.current.has('ArrowLeft')) newPlayerX -= PLAYER_SPEED;
    if (keysPressed.current.has('ArrowRight')) newPlayerX += PLAYER_SPEED;
    const newPlayer = { ...player, x: Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newPlayerX)) };
    
    // 2. Calculate new bullet positions
    const movedBullets = bullets.map(b => ({ ...b, y: b.y - BULLET_SPEED })).filter(b => b.y > -BULLET_HEIGHT);
    
    // 3. Calculate new enemy positions
    const movedEnemies = enemies.map(e => ({ ...e, y: e.y + ENEMY_SPEED }));
    
    // 4. Bullet vs Enemy collision
    let scoreToAdd = 0;
    const remainingEnemies = [];
    const hitBulletIds = new Set();

    for (const enemy of movedEnemies) {
        let enemyHit = false;
        for (const bullet of movedBullets) {
            if (hitBulletIds.has(bullet.id)) continue;

            if (
                bullet.x < enemy.x + ENEMY_WIDTH &&
                bullet.x + BULLET_WIDTH > enemy.x &&
                bullet.y < enemy.y + ENEMY_HEIGHT &&
                bullet.y + BULLET_HEIGHT > enemy.y
            ) {
                hitBulletIds.add(bullet.id);
                scoreToAdd += 10;
                enemyHit = true;
                break; // One bullet hits one enemy
            }
        }
        if (!enemyHit) {
            remainingEnemies.push(enemy);
        }
    }
    const remainingBullets = movedBullets.filter(b => !hitBulletIds.has(b.id));
    
    // 5. Player vs Enemy collision
    for (const enemy of remainingEnemies) {
        if (
            newPlayer.x < enemy.x + ENEMY_WIDTH &&
            newPlayer.x + PLAYER_WIDTH > enemy.x &&
            newPlayer.y < enemy.y + ENEMY_HEIGHT &&
            newPlayer.y + PLAYER_HEIGHT > enemy.y
        ) {
            gameOver();
            return;
        }
    }

    // 6. Filter out enemies that have gone off-screen
    const onScreenEnemies = remainingEnemies.filter(e => e.y < GAME_HEIGHT);

    // --- Set new states atomically at the end of the frame calculation ---
    setPlayer(newPlayer);
    setBullets(remainingBullets);
    setEnemies(onScreenEnemies);
    if (scoreToAdd > 0) {
        setScore(s => s + scoreToAdd);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver]); // gameOver is a stable dependency
  
  useEffect(() => {
    if (gameState === GameState.Playing) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      enemySpawnTimerRef.current = window.setInterval(spawnEnemy, ENEMY_SPAWN_INTERVAL);
    }
    return () => {
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if(enemySpawnTimerRef.current) clearInterval(enemySpawnTimerRef.current);
    };
  }, [gameState, gameLoop, spawnEnemy]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Start:
        return <StartScreen onStart={startGame} />;
      case GameState.GameOver:
        return <GameOverScreen score={score} onRestart={startGame} />;
      case GameState.Playing:
        return (
          <>
            <div className="absolute top-2 left-2 text-white font-mono text-xl z-10">SCORE: {score}</div>
            <Player player={player} />
            {enemies.map(e => <Enemy key={e.id} enemy={e} />)}
            {bullets.map(b => <Bullet key={b.id} bullet={b} />)}
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div
        className="relative bg-black border-2 border-white shadow-lg shadow-white/50"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, overflow: 'hidden' }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default App;