
export interface Position {
  x: number;
  y: number;
}

export interface GameObject extends Position {
  id: number;
}

export type PlayerState = Position;
export type EnemyState = GameObject;
export type BulletState = GameObject;

export enum GameState {
  Start,
  Playing,
  GameOver,
}
