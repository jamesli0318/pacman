import { Ghost } from './Ghost';
import { GhostType, GAME_CONFIG } from '../constants/gameConstants';
import { MazeRenderer } from '../utils/mazeRenderer';

/**
 * Inky (Blue Ghost) - Patrol AI with Chase/Scatter modes
 * Alternates between chasing Pacman and patrolling a corner
 */
export class Inky extends Ghost {
  private chaseMode: boolean;
  private modeTimer: number;
  private chaseDuration: number = 7000; // 7 seconds
  private scatterDuration: number = 20000; // 20 seconds
  private scatterTargetX: number;
  private scatterTargetY: number;

  constructor(x: number, y: number, level: number) {
    super(x, y, GhostType.INKY, level);
    this.chaseMode = true;
    this.modeTimer = 0;

    // Scatter target: bottom-right corner
    const scatterGrid = { gridX: GAME_CONFIG.MAZE.WIDTH - 2, gridY: GAME_CONFIG.MAZE.HEIGHT - 2 };
    const scatterPixel = {
      x: scatterGrid.gridX * GAME_CONFIG.MAZE.CELL_SIZE + GAME_CONFIG.MAZE.CELL_SIZE / 2,
      y: scatterGrid.gridY * GAME_CONFIG.MAZE.CELL_SIZE + GAME_CONFIG.MAZE.CELL_SIZE / 2
    };
    this.scatterTargetX = scatterPixel.x;
    this.scatterTargetY = scatterPixel.y;
  }

  /**
   * Update with mode switching
   */
  update(deltaTime: number, mazeRenderer: MazeRenderer, pacmanX: number, pacmanY: number): void {
    // Update mode timer
    this.modeTimer += deltaTime;

    const modeDuration = this.chaseMode ? this.chaseDuration : this.scatterDuration;
    if (this.modeTimer >= modeDuration) {
      this.chaseMode = !this.chaseMode;
      this.modeTimer = 0;
    }

    super.update(deltaTime, mazeRenderer, pacmanX, pacmanY);
  }

  /**
   * Target based on current mode
   */
  protected updateTarget(pacmanX: number, pacmanY: number, mazeRenderer: MazeRenderer): void {
    if (this.chaseMode) {
      // Chase mode: target Pacman
      this.targetX = pacmanX;
      this.targetY = pacmanY;
    } else {
      // Scatter mode: go to corner
      this.targetX = this.scatterTargetX;
      this.targetY = this.scatterTargetY;
    }
  }
}