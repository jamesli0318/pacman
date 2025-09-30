import { Direction, GhostState, GhostType, GAME_CONFIG } from '../constants/gameConstants';
import { MazeRenderer } from '../utils/mazeRenderer';

export abstract class Ghost {
  // Position (in pixels)
  public x: number;
  public y: number;

  // Ghost type and state
  public type: GhostType;
  public state: GhostState;

  // Direction
  protected currentDirection: Direction;
  protected nextDirection: Direction;

  // Speed
  protected speed: number;
  protected frightenedSpeed: number;

  // Dimensions
  public radius: number;

  // Level
  protected level: number;

  // Target position for AI
  protected targetX: number;
  protected targetY: number;

  // Animation
  protected animationFrame: number;
  protected animationTimer: number;
  protected animationSpeed: number;

  // Spawn position
  protected spawnX: number;
  protected spawnY: number;

  constructor(x: number, y: number, type: GhostType, level: number) {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.type = type;
    this.state = GhostState.NORMAL;
    this.level = level;
    this.currentDirection = Direction.NONE;
    this.nextDirection = Direction.NONE;

    // Set speed based on level
    const speedKey = `LEVEL_${Math.min(level, 10)}` as keyof typeof GAME_CONFIG.SPEED.GHOST;
    this.speed = GAME_CONFIG.SPEED.GHOST[speedKey];
    this.frightenedSpeed = GAME_CONFIG.SPEED.FRIGHTENED;

    this.radius = GAME_CONFIG.MAZE.CELL_SIZE / 2 - 2;
    this.targetX = x;
    this.targetY = y;

    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 1000 / GAME_CONFIG.ANIMATION.FPS;
  }

  /**
   * Update ghost AI and movement
   */
  update(deltaTime: number, mazeRenderer: MazeRenderer, pacmanX: number, pacmanY: number): void {
    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationFrame = (this.animationFrame + 1) % GAME_CONFIG.ANIMATION.GHOST_FRAMES;
      this.animationTimer = 0;
    }

    // Update target based on ghost AI (implemented in subclasses)
    this.updateTarget(pacmanX, pacmanY, mazeRenderer);

    // Move toward target
    this.move(deltaTime, mazeRenderer);
  }

  /**
   * Abstract method for AI targeting (implemented by each ghost)
   */
  protected abstract updateTarget(pacmanX: number, pacmanY: number, mazeRenderer: MazeRenderer): void;

  /**
   * Move ghost toward target
   */
  protected move(deltaTime: number, mazeRenderer: MazeRenderer): void {
    const moveSpeed = this.state === GhostState.FRIGHTENED ? this.frightenedSpeed : this.speed;
    const moveAmount = moveSpeed * (deltaTime / 16.67); // Normalize to 60 FPS

    // Calculate direction to target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    // Choose direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Move horizontally
      this.nextDirection = dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else if (Math.abs(dy) > 0.1) {
      // Move vertically
      this.nextDirection = dy > 0 ? Direction.DOWN : Direction.UP;
    }

    // Apply movement
    let newX = this.x;
    let newY = this.y;

    switch (this.nextDirection) {
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

    // Check collision
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
      this.currentDirection = this.nextDirection;

      // Handle tunnel wrapping
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
  }

  /**
   * Render ghost
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Draw based on state
    if (this.state === GhostState.FRIGHTENED) {
      // Blue frightened ghost
      ctx.fillStyle = GAME_CONFIG.COLORS.GHOST_FRIGHTENED;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.state === GhostState.EYES) {
      // Just eyes
      ctx.fillStyle = GAME_CONFIG.COLORS.GHOST_EYES;
      ctx.beginPath();
      ctx.arc(this.x - 5, this.y, 3, 0, Math.PI * 2);
      ctx.arc(this.x + 5, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal ghost with color
      const color = this.getColor();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Add eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.x - 5, this.y - 3, 3, 0, Math.PI * 2);
      ctx.arc(this.x + 5, this.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(this.x - 5, this.y - 3, 1.5, 0, Math.PI * 2);
      ctx.arc(this.x + 5, this.y - 3, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Get ghost color based on type
   */
  protected getColor(): string {
    switch (this.type) {
      case GhostType.BLINKY:
        return GAME_CONFIG.COLORS.GHOST_BLINKY;
      case GhostType.PINKY:
        return GAME_CONFIG.COLORS.GHOST_PINKY;
      case GhostType.INKY:
        return GAME_CONFIG.COLORS.GHOST_INKY;
      case GhostType.CLYDE:
        return GAME_CONFIG.COLORS.GHOST_CLYDE;
      default:
        return GAME_CONFIG.COLORS.GHOST_BLINKY;
    }
  }

  /**
   * Set ghost state
   */
  setState(newState: GhostState): void {
    // Validate state transitions
    if (this.state === GhostState.NORMAL && newState === GhostState.FRIGHTENED) {
      this.state = newState;
    } else if (this.state === GhostState.FRIGHTENED && newState === GhostState.EYES) {
      this.state = newState;
    } else if (this.state === GhostState.EYES && newState === GhostState.NORMAL) {
      this.state = newState;
    } else if (this.state === GhostState.FRIGHTENED && newState === GhostState.NORMAL) {
      this.state = newState;
    }
  }

  /**
   * Get grid position
   */
  getGridPosition(): { gridX: number; gridY: number } {
    return {
      gridX: Math.floor(this.x / GAME_CONFIG.MAZE.CELL_SIZE),
      gridY: Math.floor(this.y / GAME_CONFIG.MAZE.CELL_SIZE),
    };
  }

  /**
   * Get bounding box for collision
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

  /**
   * Reset ghost to spawn
   */
  reset(): void {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.state = GhostState.NORMAL;
    this.currentDirection = Direction.NONE;
    this.nextDirection = Direction.NONE;
  }

  /**
   * Check if ghost is at spawn
   */
  isAtSpawn(): boolean {
    const dx = Math.abs(this.x - this.spawnX);
    const dy = Math.abs(this.y - this.spawnY);
    return dx < 5 && dy < 5;
  }
}