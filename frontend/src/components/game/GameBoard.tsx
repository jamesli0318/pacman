import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GAME_CONFIG, GameState, Direction, KEYS, GhostState } from '../../constants/gameConstants';
import { getMaze } from '../../data/mazes';
import { MazeRenderer } from '../../utils/mazeRenderer';
import { Pacman } from '../../entities/Pacman';
import { Blinky } from '../../entities/Blinky';
import { Pinky } from '../../entities/Pinky';
import { Inky } from '../../entities/Inky';
import { Clyde } from '../../entities/Clyde';
import { Ghost } from '../../entities/Ghost';
import './GameBoard.css';

interface GameBoardProps {
  level: number;
  onGameOver?: () => void;
  onLevelComplete?: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ level, onGameOver, onLevelComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mazeRendererRef = useRef<MazeRenderer | null>(null);
  const pacmanRef = useRef<Pacman | null>(null);
  const ghostsRef = useRef<Ghost[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.READY);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(GAME_CONFIG.INITIAL_LIVES);
  const [powerPelletActive, setPowerPelletActive] = useState(false);
  const powerPelletTimerRef = useRef<number | null>(null);
  const ghostScoreMultiplierRef = useRef<number>(0);

  // Keyboard input handling
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;

    // Prevent default behavior for game keys
    const gameKeys = [KEYS.ARROW_UP, KEYS.ARROW_DOWN, KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.SPACE] as string[];
    if (gameKeys.includes(key)) {
      event.preventDefault();
    }

    // Handle pause
    if (key === KEYS.P || key === KEYS.SPACE) {
      setGameState(prevState =>
        prevState === GameState.PLAYING ? GameState.PAUSED :
        prevState === GameState.PAUSED ? GameState.PLAYING : prevState
      );
      return;
    }

    // Handle movement keys
    if (gameState === GameState.PLAYING && pacmanRef.current) {
      switch (key) {
        case KEYS.ARROW_UP:
        case KEYS.W:
          pacmanRef.current.setDirection(Direction.UP);
          break;
        case KEYS.ARROW_DOWN:
        case KEYS.S:
          pacmanRef.current.setDirection(Direction.DOWN);
          break;
        case KEYS.ARROW_LEFT:
        case KEYS.A:
          pacmanRef.current.setDirection(Direction.LEFT);
          break;
        case KEYS.ARROW_RIGHT:
        case KEYS.D:
          pacmanRef.current.setDirection(Direction.RIGHT);
          break;
      }
    }
  }, [gameState]);

  // Initialize maze renderer, Pacman, and Ghosts when level changes
  useEffect(() => {
    const mazeData = getMaze(level);
    mazeRendererRef.current = new MazeRenderer(mazeData);

    // Initialize Pacman at starting position
    const startPixel = mazeRendererRef.current.gridToPixel(
      mazeData.playerStart.x,
      mazeData.playerStart.y
    );
    pacmanRef.current = new Pacman(startPixel.x, startPixel.y, level);

    // Initialize Ghosts at spawn position
    const ghostSpawnPixel = mazeRendererRef.current.gridToPixel(
      mazeData.ghostSpawn.x,
      mazeData.ghostSpawn.y
    );

    ghostsRef.current = [
      new Blinky(ghostSpawnPixel.x, ghostSpawnPixel.y, level),
      new Pinky(ghostSpawnPixel.x + 20, ghostSpawnPixel.y, level),
      new Inky(ghostSpawnPixel.x - 20, ghostSpawnPixel.y, level),
      new Clyde(ghostSpawnPixel.x, ghostSpawnPixel.y + 20, level),
    ];
  }, [level]);

  // Set up canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = GAME_CONFIG.MAZE.CANVAS_WIDTH;
    canvas.height = GAME_CONFIG.MAZE.CANVAS_HEIGHT;

    // Get 2D context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);

    // Initial render
    renderGame(ctx);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Game rendering
  const renderGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = GAME_CONFIG.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, GAME_CONFIG.MAZE.CANVAS_WIDTH, GAME_CONFIG.MAZE.CANVAS_HEIGHT);

    // Render maze with walls, dots, and power pellets
    if (mazeRendererRef.current) {
      mazeRendererRef.current.render(ctx);
    }

    // Render ghosts
    ghostsRef.current.forEach(ghost => {
      ghost.render(ctx);
    });

    // Render Pacman (on top of ghosts)
    if (pacmanRef.current) {
      pacmanRef.current.render(ctx);
    }
  };

  // Game loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update Pacman
      if (pacmanRef.current && mazeRendererRef.current) {
        pacmanRef.current.update(deltaTime, mazeRendererRef.current);

        // Check for dot/pellet collection
        const { gridX, gridY } = pacmanRef.current.getGridPosition();
        const tile = mazeRendererRef.current.getTileAt(gridX, gridY);

        if (tile === 2) { // DOT
          mazeRendererRef.current.setTileAt(gridX, gridY, 0); // Remove dot
          setScore(prev => prev + GAME_CONFIG.SCORE.DOT);
        } else if (tile === 3) { // POWER_PELLET
          mazeRendererRef.current.setTileAt(gridX, gridY, 0); // Remove power pellet
          setScore(prev => prev + GAME_CONFIG.SCORE.POWER_PELLET);

          // Activate power pellet mode
          setPowerPelletActive(true);
          ghostScoreMultiplierRef.current = 0; // Reset ghost score multiplier

          // Set all ghosts to frightened state
          ghostsRef.current.forEach(ghost => {
            if (ghost.state !== GhostState.EYES) {
              ghost.setState(GhostState.FRIGHTENED);
            }
          });

          // Clear existing timer if any
          if (powerPelletTimerRef.current) {
            clearTimeout(powerPelletTimerRef.current);
          }

          // Set timer to deactivate after duration
          const duration = GAME_CONFIG.TIMING.POWER_PELLET_DURATION[
            `LEVEL_${Math.min(level, 10)}` as keyof typeof GAME_CONFIG.TIMING.POWER_PELLET_DURATION
          ];
          powerPelletTimerRef.current = window.setTimeout(() => {
            setPowerPelletActive(false);
            // Return ghosts to normal state
            ghostsRef.current.forEach(ghost => {
              if (ghost.state === GhostState.FRIGHTENED) {
                ghost.setState(GhostState.NORMAL);
              }
            });
          }, duration);
        }

        // Check if level complete (all dots collected)
        const remainingDots = mazeRendererRef.current.countRemainingDots();
        if (remainingDots === 0) {
          setGameState(GameState.LEVEL_COMPLETE);
        }
      }

      // Update ghosts
      if (mazeRendererRef.current && pacmanRef.current) {
        ghostsRef.current.forEach(ghost => {
          ghost.update(deltaTime, mazeRendererRef.current!, pacmanRef.current!.x, pacmanRef.current!.y);

          // Check for ghost-Pacman collision
          if (pacmanRef.current) {
            const dx = ghost.x - pacmanRef.current.x;
            const dy = ghost.y - pacmanRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const collisionDistance = ghost.radius + pacmanRef.current.radius;

            if (distance < collisionDistance) {
              if (ghost.state === GhostState.FRIGHTENED) {
                // Eat ghost - award points
                ghost.setState(GhostState.EYES);
                const ghostScores = [200, 400, 800, 1600];
                const points = ghostScores[ghostScoreMultiplierRef.current % 4];
                setScore(prev => prev + points);
                ghostScoreMultiplierRef.current++;
              } else if (ghost.state === GhostState.NORMAL) {
                // Ghost caught Pacman - lose a life
                const currentLives = lives - 1;
                setLives(currentLives);

                if (currentLives <= 0) {
                  setGameState(GameState.GAME_OVER);
                  if (onGameOver) onGameOver();
                } else {
                  // Reset positions
                  if (pacmanRef.current && mazeRendererRef.current) {
                    const mazeData = getMaze(level);
                    const startPixel = mazeRendererRef.current.gridToPixel(
                      mazeData.playerStart.x,
                      mazeData.playerStart.y
                    );
                    pacmanRef.current.reset(startPixel.x, startPixel.y);
                  }

                  // Reset ghosts
                  ghostsRef.current.forEach(g => g.reset());
                }
              }
            }
          }

          // Respawn ghost if at spawn as EYES
          if (ghost.state === GhostState.EYES && ghost.isAtSpawn()) {
            ghost.setState(GhostState.NORMAL);
          }
        });
      }

      // Render
      renderGame(ctx);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (powerPelletTimerRef.current) {
        clearTimeout(powerPelletTimerRef.current);
      }
    };
  }, [gameState, level]);

  // Start game
  const startGame = () => {
    setGameState(GameState.PLAYING);
    setScore(0);
    setLives(GAME_CONFIG.INITIAL_LIVES);

    // Reset Pacman to starting position
    if (pacmanRef.current && mazeRendererRef.current) {
      const mazeData = getMaze(level);
      const startPixel = mazeRendererRef.current.gridToPixel(
        mazeData.playerStart.x,
        mazeData.playerStart.y
      );
      pacmanRef.current.reset(startPixel.x, startPixel.y);
    }
  };

  return (
    <div className="game-board-container">
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="level">Level: {level}</div>
        <div className="lives">Lives: {lives}</div>
        {powerPelletActive && (
          <div className="power-mode" style={{ color: '#FFB851', fontWeight: 'bold' }}>
            ⚡ POWER MODE!
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="game-canvas"
      />

      {gameState === GameState.READY && (
        <div className="game-overlay">
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
          <p>Use Arrow Keys or WASD to move</p>
          <p>Press P or SPACE to pause</p>
        </div>
      )}

      {gameState === GameState.PAUSED && (
        <div className="game-overlay">
          <h2>PAUSED</h2>
          <p>Press P or SPACE to resume</p>
        </div>
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="game-overlay">
          <h2>GAME OVER</h2>
          <p>Final Score: {score}</p>
          <button onClick={startGame} className="start-button">
            Try Again
          </button>
        </div>
      )}

      {gameState === GameState.LEVEL_COMPLETE && (
        <div className="game-overlay">
          <h2>LEVEL COMPLETE!</h2>
          <p>Score: {score}</p>
          <button onClick={() => onLevelComplete?.()} className="start-button">
            Next Level
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;