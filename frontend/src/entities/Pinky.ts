import { Ghost } from './Ghost';
import { GhostType, Direction, GAME_CONFIG } from '../constants/gameConstants';
import { MazeRenderer } from '../utils/mazeRenderer';

/**
 * Pinky (Pink Ghost) - Ambush AI
 * Targets 4 tiles ahead of Pacman's direction
 */
export class Pinky extends Ghost {
  constructor(x: number, y: number, level: number) {
    super(x, y, GhostType.PINKY, level);
  }

  /**
   * Target 4 tiles ahead of Pacman
   */
  protected updateTarget(pacmanX: number, pacmanY: number, mazeRenderer: MazeRenderer): void {
    const pacmanGrid = mazeRenderer.pixelToGrid(pacmanX, pacmanY);

    // Calculate 4 tiles ahead (ambush position)
    const tilesAhead = 4;
    let targetGridX = pacmanGrid.gridX;
    let targetGridY = pacmanGrid.gridY;

    // Get Pacman's direction from position change
    // For now, use simple prediction based on target position
    const dx = pacmanX - this.x;
    const dy = pacmanY - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Pacman moving horizontally
      targetGridX += dx > 0 ? tilesAhead : -tilesAhead;
    } else {
      // Pacman moving vertically
      targetGridY += dy > 0 ? tilesAhead : -tilesAhead;
    }

    // Clamp to maze boundaries
    targetGridX = Math.max(0, Math.min(GAME_CONFIG.MAZE.WIDTH - 1, targetGridX));
    targetGridY = Math.max(0, Math.min(GAME_CONFIG.MAZE.HEIGHT - 1, targetGridY));

    // Check if target is a wall, if so revert to Pacman's position
    if (mazeRenderer.isWall(targetGridX, targetGridY)) {
      this.targetX = pacmanX;
      this.targetY = pacmanY;
    } else {
      const targetPixel = mazeRenderer.gridToPixel(targetGridX, targetGridY);
      this.targetX = targetPixel.x;
      this.targetY = targetPixel.y;
    }
  }
}