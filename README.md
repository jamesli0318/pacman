# Pacman Game

A web-based Pacman game built with React frontend, Django REST API backend, and deployed using Docker Compose.

## Features

- 🎮 Classic Pacman gameplay with AI-controlled ghosts
- 👻 4 different ghost AI behaviors (Blinky, Pinky, Inky, Clyde)
- 🏆 10 progressive levels with increasing difficulty
- 🥇 Player ranking and leaderboard system
- 🔐 User authentication and game session tracking
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

## Development

### Project Structure
```
pacman-game/
├── frontend/          # React TypeScript application
├── backend/           # Django REST API
├── docs/             # Documentation
├── tasks/            # Development task breakdown
├── docker-compose.yml
└── README.md
```

### Development Workflow

See detailed development tasks in the `tasks/` directory:
- [Phase 1: Project Setup](./tasks/Phase1_ProjectSetup.md)
- [Phase 2: Authentication](./tasks/Phase2_Authentication.md)
- [Phase 3: Core Game Engine](./tasks/Phase3_CoreGameEngine.md)
- [All Phases](./tasks/README.md)

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

1. Check the task breakdown in `tasks/` directory
2. Follow the development rules in `development_rules.md`
3. Complete tasks phase by phase with validation
4. Submit pull requests with clear descriptions

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Phase 1: Project Setup and Docker configuration
- [ ] Phase 2: User authentication and protected routes
- [ ] Phase 3: Core game engine with canvas rendering
- [ ] Phase 4: Ghost AI implementation
- [ ] Phase 5: Game logic and scoring system
- [ ] Phase 6: UI components and menus
- [ ] Phase 7: Backend API integration
- [ ] Phase 8: Leaderboard and statistics
- [ ] Phase 9: Visual and audio polish
- [ ] Phase 10: Performance optimization
- [ ] Phase 11: Comprehensive testing
- [ ] Phase 12: Production deployment

## Support

For issues and questions, please refer to the task documentation in the `tasks/` directory or create an issue in the repository.