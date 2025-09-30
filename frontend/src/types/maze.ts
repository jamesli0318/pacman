import { TileType } from '../constants/gameConstants';

export interface Position {
  x: number;
  y: number;
}

export interface MazeData {
  level: number;
  layout: number[][]; // 2D array of TileType values
  playerStart: Position;
  ghostSpawn: Position;
  powerPellets: Position[];
  tunnels: Position[];
}

export type MazeLayout = number[][];