import { Ghost } from './Ghost';
import { GhostType, GAME_CONFIG } from '../constants/gameConstants';
import { MazeRenderer } from '../utils/mazeRenderer';

/**
 * Clyde (Orange Ghost) - Random Movement AI
 * Random direction selection with distance-based flee behavior
 */
export class Clyde extends Ghost {
  private fleeDistance: number = 8; // Flee when within 8 tiles

  constructor(x: number, y: number, level: number) {
    super(x, y, GhostType.CLYDE, level);
  }

  /**
   * Random movement with flee behavior
   */
  protected updateTarget(pacmanX: number, pacmanY: number, mazeRenderer: MazeRenderer): void {
    // Calculate distance to Pacman
    const dx = pacmanX - this.x;
    const dy = pacmanY - this.y;
    const distanceInPixels = Math.sqrt(dx * dx + dy * dy);
    const distanceInTiles = distanceInPixels / GAME_CONFIG.MAZE.CELL_SIZE;

    if (distanceInTiles < this.fleeDistance) {
      // Flee: move away from Pacman
      this.targetX = this.x - dx;
      this.targetY = this.y - dy;
    } else {
      // Random movement toward a random nearby point
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDistance = 5 * GAME_CONFIG.MAZE.CELL_SIZE;
      this.targetX = this.x + Math.cos(randomAngle) * randomDistance;
      this.targetY = this.y + Math.sin(randomAngle) * randomDistance;
    }

    // Clamp to maze boundaries
    const maxX = (GAME_CONFIG.MAZE.WIDTH - 1) * GAME_CONFIG.MAZE.CELL_SIZE;
    const maxY = (GAME_CONFIG.MAZE.HEIGHT - 1) * GAME_CONFIG.MAZE.CELL_SIZE;
    this.targetX = Math.max(GAME_CONFIG.MAZE.CELL_SIZE, Math.min(maxX, this.targetX));
    this.targetY = Math.max(GAME_CONFIG.MAZE.CELL_SIZE, Math.min(maxY, this.targetY));
  }
}