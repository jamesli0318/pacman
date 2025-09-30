import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GAME_CONFIG, GameState, Direction, KEYS } from '../../constants/gameConstants';
import { getMaze } from '../../data/mazes';
import { MazeRenderer } from '../../utils/mazeRenderer';
import { Pacman } from '../../entities/Pacman';
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
  const [gameState, setGameState] = useState<GameState>(GameState.READY);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_CONFIG.INITIAL_LIVES);

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

  // Initialize maze renderer and Pacman when level changes
  useEffect(() => {
    const mazeData = getMaze(level);
    mazeRendererRef.current = new MazeRenderer(mazeData);

    // Initialize Pacman at starting position
    const startPixel = mazeRendererRef.current.gridToPixel(
      mazeData.playerStart.x,
      mazeData.playerStart.y
    );
    pacmanRef.current = new Pacman(startPixel.x, startPixel.y, level);
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

    // Render Pacman
    if (pacmanRef.current) {
      pacmanRef.current.render(ctx);
    }

    // TODO: Render ghosts
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
      }

      // TODO: Update ghost positions
      // TODO: Check collisions
      // TODO: Update score

      // Render
      renderGame(ctx);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState]);

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