import { Ghost } from './Ghost';
import { GhostType } from '../constants/gameConstants';
import { MazeRenderer } from '../utils/mazeRenderer';

/**
 * Blinky (Red Ghost) - Direct Chase AI
 * Always targets Pacman's current position
 */
export class Blinky extends Ghost {
  constructor(x: number, y: number, level: number) {
    super(x, y, GhostType.BLINKY, level);
  }

  /**
   * Target Pacman's exact current position
   */
  protected updateTarget(pacmanX: number, pacmanY: number, mazeRenderer: MazeRenderer): void {
    // Direct chase: target Pacman's current position
    this.targetX = pacmanX;
    this.targetY = pacmanY;
  }
}