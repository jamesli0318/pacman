import { MazeData } from '../types/maze';
import { GAME_CONFIG, TileType } from '../constants/gameConstants';

export class MazeRenderer {
  private mazeData: MazeData;
  private cellSize: number;

  constructor(mazeData: MazeData) {
    this.mazeData = mazeData;
    this.cellSize = GAME_CONFIG.MAZE.CELL_SIZE;
  }

  /**
   * Render the complete maze including walls, dots, and power pellets
   */
  render(ctx: CanvasRenderingContext2D): void {
    const { layout } = this.mazeData;

    for (let row = 0; row < layout.length; row++) {
      for (let col = 0; col < layout[row].length; col++) {
        const tile = layout[row][col];
        const x = col * this.cellSize;
        const y = row * this.cellSize;

        switch (tile) {
          case TileType.WALL:
            this.renderWall(ctx, x, y);
            break;
          case TileType.DOT:
            this.renderDot(ctx, x, y);
            break;
          case TileType.POWER_PELLET:
            this.renderPowerPellet(ctx, x, y);
            break;
          case TileType.TUNNEL:
            // Tunnels are rendered as empty spaces
            break;
          case TileType.GHOST_SPAWN:
          case TileType.PLAYER_SPAWN:
            // Spawn points are rendered as empty spaces
            break;
          case TileType.EMPTY:
          default:
            // Empty space - no rendering needed
            break;
        }
      }
    }
  }

  /**
   * Render a wall tile with rounded corners
   */
  private renderWall(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.fillStyle = GAME_CONFIG.COLORS.WALL;
    ctx.fillRect(x, y, this.cellSize, this.cellSize);

    // Add inner border for visual depth
    ctx.strokeStyle = GAME_CONFIG.COLORS.WALL_BORDER;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, this.cellSize - 1, this.cellSize - 1);
  }

  /**
   * Render a collectible dot
   */
  private renderDot(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const radius = 2;

    ctx.fillStyle = GAME_CONFIG.COLORS.DOT;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render a power pellet with pulsing animation
   */
  private renderPowerPellet(ctx: CanvasRenderingContext2D, x: number, y: number, pulse: number = 1): void {
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const baseRadius = 6;
    const radius = baseRadius * pulse;

    ctx.fillStyle = GAME_CONFIG.COLORS.POWER_PELLET;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = GAME_CONFIG.COLORS.POWER_PELLET;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Check if a position collides with a wall
   */
  isWall(gridX: number, gridY: number): boolean {
    const { layout } = this.mazeData;

    // Check bounds
    if (gridY < 0 || gridY >= layout.length || gridX < 0 || gridX >= layout[0].length) {
      return true; // Out of bounds is treated as a wall
    }

    return layout[gridY][gridX] === TileType.WALL;
  }

  /**
   * Check if a pixel position collides with a wall
   * Uses bounding box collision detection
   */
  checkCollision(x: number, y: number, width: number, height: number): boolean {
    // Calculate the grid cells that this bounding box overlaps
    const left = Math.floor(x / this.cellSize);
    const right = Math.floor((x + width - 1) / this.cellSize);
    const top = Math.floor(y / this.cellSize);
    const bottom = Math.floor((y + height - 1) / this.cellSize);

    // Check all corners and edges
    if (this.isWall(left, top)) return true;
    if (this.isWall(right, top)) return true;
    if (this.isWall(left, bottom)) return true;
    if (this.isWall(right, bottom)) return true;

    return false;
  }

  /**
   * Get the tile type at a specific grid position
   */
  getTileAt(gridX: number, gridY: number): TileType {
    const { layout } = this.mazeData;

    if (gridY < 0 || gridY >= layout.length || gridX < 0 || gridX >= layout[0].length) {
      return TileType.EMPTY;
    }

    return layout[gridY][gridX];
  }

  /**
   * Set the tile type at a specific grid position (used for dot collection)
   */
  setTileAt(gridX: number, gridY: number, tileType: TileType): void {
    const { layout } = this.mazeData;

    if (gridY >= 0 && gridY < layout.length && gridX >= 0 && gridX < layout[0].length) {
      layout[gridY][gridX] = tileType;
    }
  }

  /**
   * Convert pixel coordinates to grid coordinates
   */
  pixelToGrid(x: number, y: number): { gridX: number; gridY: number } {
    return {
      gridX: Math.floor(x / this.cellSize),
      gridY: Math.floor(y / this.cellSize),
    };
  }

  /**
   * Convert grid coordinates to pixel coordinates (center of cell)
   */
  gridToPixel(gridX: number, gridY: number): { x: number; y: number } {
    return {
      x: gridX * this.cellSize + this.cellSize / 2,
      y: gridY * this.cellSize + this.cellSize / 2,
    };
  }

  /**
   * Check if a grid position is a tunnel
   */
  isTunnel(gridX: number, gridY: number): boolean {
    return this.getTileAt(gridX, gridY) === TileType.TUNNEL;
  }

  /**
   * Get the opposite tunnel position
   */
  getTunnelExit(gridX: number, gridY: number): { gridX: number; gridY: number } | null {
    const { tunnels } = this.mazeData;

    for (let i = 0; i < tunnels.length; i++) {
      if (tunnels[i].x === gridX && tunnels[i].y === gridY) {
        // Return the other tunnel
        const exitIndex = i === 0 ? 1 : 0;
        return {
          gridX: tunnels[exitIndex].x,
          gridY: tunnels[exitIndex].y,
        };
      }
    }

    return null;
  }

  /**
   * Count remaining dots in the maze
   */
  countRemainingDots(): number {
    const { layout } = this.mazeData;
    let count = 0;

    for (let row = 0; row < layout.length; row++) {
      for (let col = 0; col < layout[row].length; col++) {
        if (layout[row][col] === TileType.DOT || layout[row][col] === TileType.POWER_PELLET) {
          count++;
        }
      }
    }

    return count;
  }
}