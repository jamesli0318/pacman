# Phase 3: Core Game Engine (Tasks 22-30)

## 🎮 Phase 3: Core Game Engine (Tasks 22-30)

### Task 22: Create game constants file with maze dimensions, speeds, and scoring
**Deliverable**: Game configuration constants
**Details**:
- Maze dimensions (width, height, cell size)
- Character speeds for different levels
- Scoring values (dots, pellets, ghosts, bonuses)
- Game timing constants (power pellet duration)
**Acceptance Criteria**: Centralized configuration for game balance
**Tests & Validation**:
- [ ] Constants file imports without errors: `import { GAME_CONFIG } from './constants'`
- [ ] All required constants are defined and typed correctly
- [ ] Maze dimensions are reasonable: width/height between 15-30 cells
- [ ] Speed values increase progressively across levels
- [ ] Scoring values follow traditional Pacman rules (dots: 10, pellets: 50)
- [ ] Constants are used throughout codebase instead of magic numbers
- [ ] TypeScript compilation passes without constant-related errors

### Task 23: Design and implement 10 level maze layouts as JSON data structures
**Deliverable**: 10 unique maze layouts
**Details**:
- 2D array representation of maze walls
- Progressive difficulty (simple to complex)
- Consistent dot and power pellet placement
- Ghost spawn points and player start position
**Acceptance Criteria**: All 10 levels load and render correctly
**Tests & Validation**:
- [ ] All 10 maze files load without JSON parsing errors
- [ ] Each maze validates: `node -e "console.log(JSON.parse(fs.readFileSync('level1.json')))"`
- [ ] Maze dimensions match constants (width × height)
- [ ] All mazes have exactly 4 power pellets in corners
- [ ] Ghost spawn area is accessible and properly defined
- [ ] Player start position is in valid pathway
- [ ] No isolated areas (all paths are reachable)
- [ ] Progressive difficulty verified: count of turns, dead ends increases
- [ ] Tunnel positions consistent across levels

### Task 24: Create GameBoard component with HTML5 Canvas setup
**Deliverable**: Canvas-based game board
**Details**:
- HTML5 Canvas element with proper sizing
- Canvas context setup for 2D rendering
- Responsive canvas that scales with screen size
- Event listeners for keyboard input
**Acceptance Criteria**: Canvas renders and accepts input
**Tests & Validation**:
- [ ] Component renders without errors: test with React Testing Library
- [ ] Canvas element exists in DOM: `document.querySelector('canvas')`
- [ ] Canvas has proper dimensions: width/height attributes set correctly
- [ ] 2D context is available: `canvas.getContext('2d')` returns valid context
- [ ] Canvas scales responsively: test on different screen sizes
- [ ] Keyboard event listeners attached: test arrow key presses
- [ ] Canvas clears and redraws properly
- [ ] Component cleanup removes event listeners on unmount

### Task 25: Implement maze rendering system with wall collision detection
**Deliverable**: Maze rendering and collision system
**Details**:
- Draw maze walls from layout data
- Implement wall collision detection algorithm
- Efficient rendering using tilemap approach
- Visual styling for walls and pathways
**Acceptance Criteria**: Maze displays correctly with working collision
**Tests & Validation**:
- [ ] Maze renders visually: walls appear in correct positions
- [ ] Collision detection works: test character cannot move through walls
- [ ] Performance acceptable: rendering takes <16ms per frame
- [ ] All wall types render correctly (horizontal, vertical, corners)
- [ ] Pathways are clearly distinguishable from walls
- [ ] Collision detection is pixel-perfect at tile boundaries
- [ ] Memory usage stable: no leaks in rendering loop
- [ ] Unit tests for collision algorithm: test edge cases

### Task 26: Create Pacman character class with position, direction, and animation
**Deliverable**: Pacman character implementation
**Details**:
- Position tracking (x, y coordinates)
- Direction state (up, down, left, right)
- Animation frames for movement
- Sprite rendering with rotation
**Acceptance Criteria**: Pacman character displays and animates
**Tests & Validation**:
- [ ] Pacman class instantiates without errors
- [ ] Position updates correctly: test x,y coordinate changes
- [ ] Direction changes work: test all 4 directions
- [ ] Animation frames cycle properly: verify frame progression
- [ ] Sprite rotates correctly for each direction
- [ ] Pacman renders at correct position on canvas
- [ ] Animation timing is smooth (60 FPS)
- [ ] Unit tests cover position and direction logic
- [ ] No visual artifacts during direction changes

### Task 27: Implement Pacman movement controls with keyboard event handlers
**Deliverable**: Character movement system
**Details**:
- Arrow keys and WASD controls
- Smooth movement with proper timing
- Direction queuing for responsive controls
- Movement validation against maze walls
**Acceptance Criteria**: Pacman moves smoothly with keyboard input
**Tests & Validation**:
- [ ] Arrow keys control movement: test ↑↓←→ keys
- [ ] WASD controls work: test W,A,S,D keys
- [ ] Movement is smooth: 60 FPS with consistent timing
- [ ] Direction queuing works: rapid key presses queue properly
- [ ] Cannot move through walls: validate collision prevention
- [ ] Movement speed matches constants
- [ ] Input lag is minimal (<50ms)
- [ ] Automated tests for keyboard event handling
- [ ] Edge case testing: multiple simultaneous key presses

### Task 28: Add Pacman collision detection with walls and boundaries
**Deliverable**: Comprehensive collision system
**Details**:
- Wall collision prevention
- Boundary collision (screen edges)
- Tunnel teleportation (left-right screen wrap)
- Precise collision detection using bounding boxes
**Acceptance Criteria**: Pacman cannot move through walls
**Tests & Validation**:
- [ ] Wall collision prevents movement: test against all wall types
- [ ] Boundary collision works: test screen edges (top, bottom)
- [ ] Tunnel teleportation works: left edge → right edge and vice versa
- [ ] Bounding box collision is accurate: test edge cases
- [ ] No clipping through walls: stress test rapid movements
- [ ] Collision detection performance: <1ms per frame
- [ ] Corner collision handling works properly
- [ ] Unit tests for all collision scenarios
- [ ] Visual debugging shows collision boundaries correctly

### Task 29: Create dot collection system with maze grid management
**Deliverable**: Dot collection mechanics
**Details**:
- Place dots in maze pathways
- Collision detection between Pacman and dots
- Remove collected dots from maze
- Track total dots for level completion
**Acceptance Criteria**: Dots can be collected and tracked
**Tests & Validation**:
- [ ] Dots appear in all valid pathway positions
- [ ] Dot-Pacman collision detection works: test collection
- [ ] Collected dots disappear from maze
- [ ] Dot counter decrements correctly on collection
- [ ] Score increases by 10 points per dot
- [ ] Level completion triggers when all dots collected
- [ ] Dots don't appear in walls or invalid positions
- [ ] Performance: collection detection <0.5ms per dot
- [ ] Unit tests for dot placement and collection logic

### Task 30: Implement power pellet mechanics with timer-based effects
**Deliverable**: Power pellet system
**Details**:
- Larger pellets in maze corners
- Timer-based frightened mode activation
- Visual feedback for power pellet duration
- Progressive reduction in duration per level
**Acceptance Criteria**: Power pellets trigger ghost frightened mode
**Tests & Validation**:
- [ ] Power pellets appear in 4 corner positions
- [ ] Power pellet collection triggers frightened mode
- [ ] Timer countdown works: verify duration (8 seconds level 1)
- [ ] Visual feedback shows remaining time: UI indicator
- [ ] Duration decreases per level: verify progressive reduction
- [ ] Ghosts change to frightened state immediately
- [ ] Score increases by 50 points per power pellet
- [ ] Multiple power pellets extend timer correctly
- [ ] Unit tests for timer logic and state transitions