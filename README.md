# Pacman Game

A web-based Pacman game built with React frontend, Django REST API backend, and deployed using Docker Compose.

## Features

- 🎮 Classic Pacman gameplay with AI-controlled ghosts
- 👻 4 different ghost AI behaviors (Blinky, Pinky, Inky, Clyde)
- 🏆 10 progressive levels with increasing difficulty
- 🥇 Player ranking and leaderboard system
- 🔐 User authentication and game session tracking
- 🎯 **Guest Mode** - Play instantly without registration
- 📱 Responsive design for desktop and mobile

## Tech Stack

### Frontend
- React 18+ with TypeScript
- HTML5 Canvas for game rendering
- React Router for navigation
- Axios for API communication

### Backend
- Django 4+ with Django REST Framework
- SQLite database
- JWT authentication
- RESTful API endpoints

### Deployment
- Docker Compose for containerization
- Node.js 18 Alpine for frontend
- Python 3.11 slim for backend

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pacman-game
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

4. Play the game:
- **Guest Mode**: Click "🎮 Play as Guest" on the home page for instant play
- **Registered User**: Create an account to save your scores and compete on the leaderboard

## Development

### Project Structure
```
pacman-game/
├── frontend/          # React TypeScript application
├── backend/           # Django REST API
├── docs/             # Documentation and task breakdown
│   ├── planning/     # Project specs and task overview
│   ├── phases/       # Detailed phase documentation
│   └── development/  # Development workflow guides
├── docker-compose.yml
└── README.md
```

### Development Workflow

See detailed development tasks and documentation:
- [📖 Documentation Hub](./docs/README.md) - Complete docs index
- [📊 Development Guide](./docs/development/README.md) - Current progress and phase status
- [✅ Phase 1-2: Complete](./docs/phases/) - Project setup & authentication done
- [⏳ Phase 3: Next](./docs/phases/Phase3_CoreGameEngine.md) - Core game engine

### Game Architecture

#### Frontend Components
- GameBoard: HTML5 Canvas game rendering
- AuthContext: User authentication management
- MainMenu: Game navigation and options
- Leaderboard: Player rankings display

#### Backend API Endpoints
- `/api/auth/` - User authentication
- `/api/games/` - Game session management
- `/api/leaderboard/` - Player rankings

#### Game Logic
- Pacman character with keyboard controls
- 4 AI ghost types with unique behaviors
- Collision detection and scoring system
- Progressive level difficulty

## Game Features

### Scoring System
- Dots: 10 points each
- Power Pellets: 50 points each
- Ghosts: 200/400/800/1600 progressive points
- Bonus Items: 100-500 points
- Level Completion: 1000 points

### AI Ghost Behaviors
- **Red Ghost (Blinky)**: Direct chase - always targets Pacman
- **Pink Ghost (Pinky)**: Ambush - targets 4 tiles ahead of Pacman
- **Blue Ghost (Inky)**: Patrol - alternates between chase and scatter
- **Orange Ghost (Clyde)**: Random movement with distance-based behavior

### Level Progression
- 10 unique maze layouts
- Progressive difficulty: ghost speed increases, power pellet duration decreases
- Ghost count progression: 1→2→3→4 ghosts across levels

## Contributing

1. Check the task breakdown in `docs/` directory
2. Follow the development workflow in `docs/development/README.md`
3. Complete tasks phase by phase with validation
4. Submit pull requests with clear descriptions

## License

MIT License - see LICENSE file for details

## Roadmap

**Progress: 21/77 tasks (27%)**

- [x] Phase 1: Project Setup and Docker configuration ✅
- [x] Phase 2: User authentication and protected routes ✅
- [ ] Phase 3: Core game engine with canvas rendering ⏳
- [ ] Phase 4: Ghost AI implementation
- [ ] Phase 5: Game logic and scoring system
- [ ] Phase 6: UI components and menus
- [ ] Phase 7: Backend API integration
- [ ] Phase 8: Leaderboard and statistics
- [ ] Phase 9: Visual and audio polish
- [ ] Phase 10: Audio effects and music
- [ ] Phase 11: Performance optimization
- [ ] Phase 12: Testing and documentation

## Support

For issues and questions, please refer to the task documentation in the `docs/` directory or create an issue in the repository.