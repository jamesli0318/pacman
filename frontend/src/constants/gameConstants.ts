// Game Constants - Centralized configuration for Pacman game

// Maze dimensions
export const MAZE_WIDTH = 28; // cells
export const MAZE_HEIGHT = 31; // cells
export const CELL_SIZE = 20; // pixels
export const CANVAS_WIDTH = MAZE_WIDTH * CELL_SIZE; // 560px
export const CANVAS_HEIGHT = MAZE_HEIGHT * CELL_SIZE; // 620px

// Character speeds (pixels per frame at 60 FPS)
export const PACMAN_SPEED = {
  LEVEL_1: 2,
  LEVEL_2: 2.2,
  LEVEL_3: 2.4,
  LEVEL_4: 2.6,
  LEVEL_5: 2.8,
  LEVEL_6: 3,
  LEVEL_7: 3.2,
  LEVEL_8: 3.4,
  LEVEL_9: 3.6,
  LEVEL_10: 4,
} as const;

export const GHOST_SPEED = {
  LEVEL_1: 1.8,
  LEVEL_2: 2,
  LEVEL_3: 2.2,
  LEVEL_4: 2.4,
  LEVEL_5: 2.6,
  LEVEL_6: 2.8,
  LEVEL_7: 3,
  LEVEL_8: 3.2,
  LEVEL_9: 3.4,
  LEVEL_10: 3.8,
} as const;

export const FRIGHTENED_SPEED = 1.2; // Ghost speed when frightened

// Scoring values
export const SCORE = {
  DOT: 10,
  POWER_PELLET: 50,
  GHOST_1: 200,
  GHOST_2: 400,
  GHOST_3: 800,
  GHOST_4: 1600,
  BONUS_CHERRY: 100,
  BONUS_STRAWBERRY: 300,
  BONUS_ORANGE: 500,
  BONUS_APPLE: 700,
  BONUS_MELON: 1000,
  LEVEL_COMPLETE: 1000,
} as const;

// Game timing (in milliseconds)
export const TIMING = {
  POWER_PELLET_DURATION: {
    LEVEL_1: 8000,
    LEVEL_2: 7000,
    LEVEL_3: 6000,
    LEVEL_4: 5000,
    LEVEL_5: 4000,
    LEVEL_6: 3000,
    LEVEL_7: 3000,
    LEVEL_8: 3000,
    LEVEL_9: 2000,
    LEVEL_10: 2000,
  },
  RESPAWN_DELAY: 2000,
  BONUS_APPEARANCE: 10000,
  BONUS_DURATION: 8000,
} as const;

// Game states
export enum GameState {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  VICTORY = 'VICTORY',
}

// Direction enum
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE',
}

// Ghost states
export enum GhostState {
  NORMAL = 'NORMAL',
  FRIGHTENED = 'FRIGHTENED',
  EYES = 'EYES',
}

// Ghost types
export enum GhostType {
  BLINKY = 'BLINKY', // Red - Direct chase
  PINKY = 'PINKY',   // Pink - Ambush
  INKY = 'INKY',     // Blue - Patrol
  CLYDE = 'CLYDE',   // Orange - Random
}

// Maze tile types
export enum TileType {
  EMPTY = 0,
  WALL = 1,
  DOT = 2,
  POWER_PELLET = 3,
  GHOST_SPAWN = 4,
  PLAYER_SPAWN = 5,
  TUNNEL = 6,
}

// Initial game configuration
export const INITIAL_LIVES = 3;
export const MAX_LEVEL = 10;

// Animation settings
export const ANIMATION_FPS = 8; // Animation frames per second
export const PACMAN_ANIMATION_FRAMES = 4;
export const GHOST_ANIMATION_FRAMES = 2;

// Collision detection
export const COLLISION_RADIUS = CELL_SIZE / 2;

// Colors
export const COLORS = {
  BACKGROUND: '#000000',
  WALL: '#2121FF',
  WALL_BORDER: '#4141FF',
  DOT: '#FFB897',
  POWER_PELLET: '#FFB897',
  PACMAN: '#FFFF00',
  GHOST_BLINKY: '#FF0000',
  GHOST_PINKY: '#FFB8FF',
  GHOST_INKY: '#00FFFF',
  GHOST_CLYDE: '#FFB851',
  GHOST_FRIGHTENED: '#2121DE',
  GHOST_EYES: '#FFFFFF',
  TEXT: '#FFFFFF',
  UI_BORDER: '#2121FF',
} as const;

// Helper function to get speed for current level
export const getPacmanSpeed = (level: number): number => {
  const key = `LEVEL_${Math.min(level, MAX_LEVEL)}` as keyof typeof PACMAN_SPEED;
  return PACMAN_SPEED[key];
};

export const getGhostSpeed = (level: number): number => {
  const key = `LEVEL_${Math.min(level, MAX_LEVEL)}` as keyof typeof GHOST_SPEED;
  return GHOST_SPEED[key];
};

export const getPowerPelletDuration = (level: number): number => {
  const key = `LEVEL_${Math.min(level, MAX_LEVEL)}` as keyof typeof TIMING['POWER_PELLET_DURATION'];
  return TIMING.POWER_PELLET_DURATION[key];
};

// Key codes for controls
export const KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  W: 'w',
  A: 'a',
  S: 's',
  D: 'd',
  SPACE: ' ',
  P: 'p',
  ESCAPE: 'Escape',
} as const;

// Export all constants as a single object for convenience
export const GAME_CONFIG = {
  MAZE: {
    WIDTH: MAZE_WIDTH,
    HEIGHT: MAZE_HEIGHT,
    CELL_SIZE: CELL_SIZE,
    CANVAS_WIDTH: CANVAS_WIDTH,
    CANVAS_HEIGHT: CANVAS_HEIGHT,
  },
  SPEED: {
    PACMAN: PACMAN_SPEED,
    GHOST: GHOST_SPEED,
    FRIGHTENED: FRIGHTENED_SPEED,
  },
  SCORE: SCORE,
  TIMING: TIMING,
  INITIAL_LIVES: INITIAL_LIVES,
  MAX_LEVEL: MAX_LEVEL,
  ANIMATION: {
    FPS: ANIMATION_FPS,
    PACMAN_FRAMES: PACMAN_ANIMATION_FRAMES,
    GHOST_FRAMES: GHOST_ANIMATION_FRAMES,
  },
  COLLISION_RADIUS: COLLISION_RADIUS,
  COLORS: COLORS,
  KEYS: KEYS,
} as const;

export default GAME_CONFIG;