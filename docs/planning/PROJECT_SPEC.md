# Pacman Game Project Specification

## Project Overview
A web-based Pacman game built with React frontend, Django REST API backend, SQLite database, and deployed using Docker Compose. Features AI-controlled ghosts, 10 progressive levels, and a player ranking system.

## Technical Architecture

### Frontend (React)
- **Framework**: React 18+ with TypeScript
- **State Management**: Context API or Redux Toolkit
- **Styling**: CSS Modules or Styled Components
- **Game Engine**: Canvas API or WebGL for game rendering
- **HTTP Client**: Axios for API communication

### Backend (Django REST Framework)
- **Framework**: Django 4+ with Django REST Framework
- **Database**: SQLite with Django ORM
- **Authentication**: Django's built-in auth with JWT tokens
- **API**: RESTful endpoints for game data and leaderboard

### Database Schema (SQLite)
```sql
-- Players table
CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game sessions table
CREATE TABLE game_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER REFERENCES players(id),
    score INTEGER NOT NULL,
    level_reached INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard view (top scores)
CREATE VIEW leaderboard AS
SELECT
    p.username,
    gs.score,
    gs.level_reached,
    gs.completed_at
FROM game_sessions gs
JOIN players p ON gs.player_id = p.id
ORDER BY gs.score DESC, gs.completed_at ASC;
```

## Game Features Specification

### Core Gameplay
1. **Pacman Character**
   - Directional movement (arrow keys/WASD)
   - Collision detection with walls and items
   - Animation states (idle, moving, eating)

2. **AI Ghost System**
   - **Red Ghost (Blinky)**: Direct chase AI - always moves toward Pacman
   - **Pink Ghost (Pinky)**: Ambush AI - targets 4 tiles ahead of Pacman
   - **Blue Ghost (Inky)**: Patrol AI - switches between chase and scatter modes
   - **Orange Ghost (Clyde)**: Random AI - random movement with occasional chase
   - Ghost states: Normal, Frightened (when power pellet eaten), Eyes (when eaten)

3. **10 Progressive Levels**
   - Level 1-3: Single ghost, simple mazes
   - Level 4-6: Two ghosts, medium complexity mazes
   - Level 7-8: Three ghosts, complex mazes
   - Level 9-10: Four ghosts, maximum difficulty
   - Increasing ghost speed and decreasing power pellet duration per level

4. **Game Items**
   - **Dots**: 10 points each, must collect all to complete level
   - **Power Pellets**: 50 points, makes ghosts frightened for 10-15 seconds
   - **Bonus Items**: 100-500 points, appear randomly (fruits, etc.)

### Ranking System
- **Score Calculation**: Dots (10pts) + Power Pellets (50pts) + Ghosts eaten (200/400/800/1600pts) + Bonus items (100-500pts) + Level completion bonus (1000pts)
- **Leaderboard**: Top 100 players by highest score
- **Player Stats**: Personal best score, highest level reached, total games played

## API Endpoints

### Authentication
```
POST /api/auth/register/     # Create new player account
POST /api/auth/login/        # Player login
POST /api/auth/logout/       # Player logout
GET  /api/auth/profile/      # Get player profile
```

### Game Management
```
POST /api/games/start/       # Start new game session
PUT  /api/games/{id}/        # Update game session (score, level)
POST /api/games/{id}/end/    # End game session
GET  /api/games/history/     # Get player's game history
```

### Leaderboard
```
GET  /api/leaderboard/       # Get top 100 players
GET  /api/leaderboard/me/    # Get current player's rank
```

## Frontend Component Structure

```
src/
├── components/
│   ├── Game/
│   │   ├── GameBoard.tsx        # Main game canvas
│   │   ├── Pacman.tsx          # Pacman character
│   │   ├── Ghost.tsx           # Ghost characters
│   │   ├── Maze.tsx            # Maze renderer
│   │   └── GameUI.tsx          # Score, lives, level display
│   ├── Menu/
│   │   ├── MainMenu.tsx        # Start screen
│   │   ├── GameOver.tsx        # Game over screen
│   │   └── PauseMenu.tsx       # Pause overlay
│   ├── Leaderboard/
│   │   ├── Leaderboard.tsx     # Rankings display
│   │   └── PlayerStats.tsx     # Player statistics
│   └── Auth/
│       ├── Login.tsx           # Login form
│       └── Register.tsx        # Registration form
├── hooks/
│   ├── useGame.ts              # Game state management
│   ├── useAuth.ts              # Authentication logic
│   └── useApi.ts               # API communication
├── services/
│   ├── api.ts                  # HTTP client setup
│   ├── gameEngine.ts           # Core game logic
│   └── aiEngine.ts             # Ghost AI algorithms
└── utils/
    ├── constants.ts            # Game constants
    └── helpers.ts              # Utility functions
```

## Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend/db.sqlite3:/app/db.sqlite3
    environment:
      - DEBUG=1
      - ALLOWED_HOSTS=localhost,127.0.0.1
      - CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build for development
EXPOSE 3000
CMD ["npm", "start"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy source code
COPY . .

# Run migrations and start server
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd pacman-game
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## Technical Considerations

### Performance
- Use requestAnimationFrame for smooth game loop
- Implement object pooling for game entities
- Optimize collision detection with spatial partitioning

### Security
- Validate all game scores server-side
- Rate limit API endpoints
- Sanitize all user inputs

### Scalability
- Design for horizontal scaling with Redis session storage
- Use database indexing for leaderboard queries
- Implement caching for frequently accessed data

## Success Metrics
- Smooth 60 FPS gameplay
- Sub-100ms API response times
- Support for 100+ concurrent players
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)