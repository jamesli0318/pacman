import { Direction, GAME_CONFIG, getPacmanSpeed } from '../constants/gameConstants';
import { MazeRenderer } from '../utils/mazeRenderer';

export class Pacman {
  // Position (in pixels)
  public x: number;
  public y: number;

  // Direction
  public currentDirection: Direction;
  public nextDirection: Direction;

  // Speed
  private speed: number;

  // Animation
  private animationFrame: number;
  private animationTimer: number;
  private animationSpeed: number;

  // Dimensions
  private radius: number;

  // Level
  private level: number;

  // Alive state
  public isAlive: boolean;

  constructor(startX: number, startY: number, level: number) {
    this.x = startX;
    this.y = startY;
    this.level = level;
    this.currentDirection = Direction.NONE;
    this.nextDirection = Direction.NONE;
    this.speed = getPacmanSpeed(level);
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 1000 / GAME_CONFIG.ANIMATION.FPS;
    this.radius = GAME_CONFIG.MAZE.CELL_SIZE / 2 - 2; // Slightly smaller than cell
    this.isAlive = true;
  }

  /**
   * Set the next direction for Pacman to move
   */
  setDirection(direction: Direction): void {
    this.nextDirection = direction;
  }

  /**
   * Update Pacman's position and animation
   */
  update(deltaTime: number, mazeRenderer: MazeRenderer): void {
    if (!this.isAlive) return;

    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationFrame = (this.animationFrame + 1) % GAME_CONFIG.ANIMATION.PACMAN_FRAMES;
      this.animationTimer = 0;
    }

    // Try to change direction if next direction is set
    if (this.nextDirection !== Direction.NONE && this.nextDirection !== this.currentDirection) {
      if (this.canMove(this.nextDirection, mazeRenderer)) {
        this.currentDirection = this.nextDirection;
      }
    }

    // Move in current direction
    if (this.currentDirection !== Direction.NONE) {
      this.move(deltaTime, mazeRenderer);
    }
  }

  /**
   * Check if Pacman can move in a given direction
   */
  private canMove(direction: Direction, mazeRenderer: MazeRenderer): boolean {
    const testX = this.x;
    const testY = this.y;
    const moveAmount = 4; // Test a small movement

    let newX = testX;
    let newY = testY;

    switch (direction) {
      case Direction.UP:
        newY = testY - moveAmount;
        break;
      case Direction.DOWN:
        newY = testY + moveAmount;
        break;
      case Direction.LEFT:
        newX = testX - moveAmount;
        break;
      case Direction.RIGHT:
        newX = testX + moveAmount;
        break;
    }

    // Check collision with walls
    const collisionSize = this.radius * 2;
    return !mazeRenderer.checkCollision(
      newX - this.radius,
      newY - this.radius,
      collisionSize,
      collisionSize
    );
  }

  /**
   * Move Pacman in the current direction
   */
  private move(deltaTime: number, mazeRenderer: MazeRenderer): void {
    const moveAmount = this.speed * (deltaTime / 16.67); // Normalize to 60 FPS
    let newX = this.x;
    let newY = this.y;

    switch (this.currentDirection) {
      case Direction.UP:
        newY = this.y - moveAmount;
        break;
      case Direction.DOWN:
        newY = this.y + moveAmount;
        break;
      case Direction.LEFT:
        newX = this.x - moveAmount;
        break;
      case Direction.RIGHT:
        newX = this.x + moveAmount;
        break;
    }

    // Check for wall collision
    const collisionSize = this.radius * 2;
    const wouldCollide = mazeRenderer.checkCollision(
      newX - this.radius,
      newY - this.radius,
      collisionSize,
      collisionSize
    );

    if (!wouldCollide) {
      this.x = newX;
      this.y = newY;

      // Handle tunnel wrapping
      this.handleTunnelWrapping(mazeRenderer);
    } else {
      // Stop if hit a wall
      this.currentDirection = Direction.NONE;
    }
  }

  /**
   * Handle tunnel teleportation
   */
  private handleTunnelWrapping(mazeRenderer: MazeRenderer): void {
    const { gridX, gridY } = mazeRenderer.pixelToGrid(this.x, this.y);

    if (mazeRenderer.isTunnel(gridX, gridY)) {
      const exit = mazeRenderer.getTunnelExit(gridX, gridY);
      if (exit) {
        const exitPixel = mazeRenderer.gridToPixel(exit.gridX, exit.gridY);
        this.x = exitPixel.x;
        this.y = exitPixel.y;
      }
    }
  }

  /**
   * Render Pacman with animation
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();

    // Translate to Pacman's position
    ctx.translate(this.x, this.y);

    // Rotate based on direction
    switch (this.currentDirection) {
      case Direction.RIGHT:
        // Default direction, no rotation
        break;
      case Direction.DOWN:
        ctx.rotate(Math.PI / 2);
        break;
      case Direction.LEFT:
        ctx.rotate(Math.PI);
        break;
      case Direction.UP:
        ctx.rotate(-Math.PI / 2);
        break;
    }

    // Calculate mouth opening based on animation frame
    const mouthOpenness = this.calculateMouthAngle();

    // Draw Pacman body
    ctx.fillStyle = GAME_CONFIG.COLORS.PACMAN;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, mouthOpenness, Math.PI * 2 - mouthOpenness);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Calculate mouth opening angle based on animation frame
   */
  private calculateMouthAngle(): number {
    // Animate mouth opening and closing
    // Frame 0: Closed (0 radians)
    // Frame 1: Quarter open (0.2 radians)
    // Frame 2: Half open (0.4 radians)
    // Frame 3: Fully open (0.5 radians)
    const maxAngle = Math.PI / 4; // 45 degrees

    switch (this.animationFrame) {
      case 0:
        return 0;
      case 1:
        return maxAngle * 0.4;
      case 2:
        return maxAngle * 0.7;
      case 3:
        return maxAngle;
      default:
        return 0;
    }
  }

  /**
   * Get Pacman's current grid position
   */
  getGridPosition(): { gridX: number; gridY: number } {
    return {
      gridX: Math.floor(this.x / GAME_CONFIG.MAZE.CELL_SIZE),
      gridY: Math.floor(this.y / GAME_CONFIG.MAZE.CELL_SIZE),
    };
  }

  /**
   * Reset Pacman to starting position
   */
  reset(startX: number, startY: number): void {
    this.x = startX;
    this.y = startY;
    this.currentDirection = Direction.NONE;
    this.nextDirection = Direction.NONE;
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.isAlive = true;
  }

  /**
   * Kill Pacman (for death animation)
   */
  kill(): void {
    this.isAlive = false;
    this.currentDirection = Direction.NONE;
  }

  /**
   * Get bounding box for collision detection
   */
  getBoundingBox(): { x: number; y: number; width: number; height: number } {
    const size = this.radius * 2;
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: size,
      height: size,
    };
  }
}