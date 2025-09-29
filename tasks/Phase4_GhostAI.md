# Phase 4: Ghost AI System (Tasks 31-38)

## 👻 Phase 4: Ghost AI System (Tasks 31-38)

### Task 31: Create base Ghost class with shared movement and state logic
**Deliverable**: Ghost base class
**Details**:
- Position and movement tracking
- State management (normal, frightened, eyes)
- Shared movement mechanics
- Base pathfinding functionality
**Acceptance Criteria**: Ghost base class supports all ghost types
**Tests & Validation**:
- [ ] Ghost base class instantiates without errors
- [ ] Position tracking works: test x,y coordinate updates
- [ ] State transitions work: NORMAL → FRIGHTENED → EYES → NORMAL
- [ ] Movement mechanics are consistent across ghost types
- [ ] Pathfinding base functionality works
- [ ] Inheritance works: all ghost subclasses extend base class
- [ ] State management prevents invalid transitions
- [ ] Unit tests cover all state transition logic
- [ ] Performance: base operations <0.1ms per frame

### Task 32: Implement Red Ghost (Blinky) direct chase AI algorithm
**Deliverable**: Aggressive chase AI
**Details**:
- Always target Pacman's current position
- Use A* pathfinding to navigate maze
- Increased speed in higher levels
- Proper state transitions
**Acceptance Criteria**: Red ghost actively chases Pacman
**Tests & Validation**:
- [ ] Red ghost targets Pacman's current position accurately
- [ ] A* pathfinding finds shortest route to target
- [ ] Ghost speed increases correctly per level
- [ ] Chase behavior is consistent and predictable
- [ ] State transitions don't interrupt pathfinding
- [ ] Ghost navigates around walls properly
- [ ] Performance: pathfinding calculation <5ms
- [ ] Visual verification: ghost moves toward Pacman
- [ ] Unit tests for targeting and pathfinding algorithms

### Task 33: Implement Pink Ghost (Pinky) ambush AI targeting ahead of Pacman
**Deliverable**: Ambush AI behavior
**Details**:
- Target 4 tiles ahead of Pacman's direction
- Predict Pacman's movement path
- Use pathfinding to intercept position
- Handle edge cases (walls, boundaries)
**Acceptance Criteria**: Pink ghost attempts to ambush Pacman
**Tests & Validation**:
- [ ] Ghost targets 4 tiles ahead of Pacman's direction
- [ ] Prediction algorithm handles all movement directions
- [ ] Edge case handling: target hits wall, reverts to Pacman position
- [ ] Ambush behavior creates flanking movements
- [ ] Pathfinding routes to intercept position correctly
- [ ] Ghost behavior different from direct chase (Blinky)
- [ ] Performance: prediction calculation <1ms
- [ ] Visual verification: ghost moves to intercept paths
- [ ] Unit tests for prediction and edge case handling

### Task 34: Implement Blue Ghost (Inky) patrol AI with chase/scatter modes
**Deliverable**: Patrol AI with mode switching
**Details**:
- Alternate between chase and scatter modes
- Timer-based mode switching
- Different target points in scatter mode
- Consistent behavior pattern
**Acceptance Criteria**: Blue ghost follows patrol pattern
**Tests & Validation**:
- [ ] Mode switching occurs at correct intervals (7s chase, 20s scatter)
- [ ] Chase mode targets Pacman appropriately
- [ ] Scatter mode targets designated corner position
- [ ] Timer resets correctly between mode switches
- [ ] Behavior pattern is consistent and predictable
- [ ] Mode transitions are smooth without jarring movements
- [ ] Ghost reaches scatter target before switching modes
- [ ] Visual verification: distinct chase vs scatter behavior
- [ ] Unit tests for timer logic and mode switching

### Task 35: Implement Orange Ghost (Clyde) random movement AI with distance checks
**Deliverable**: Random movement AI
**Details**:
- Random direction selection at intersections
- Distance-based behavior changes
- Flee when too close to Pacman
- Maintain unpredictable movement
**Acceptance Criteria**: Orange ghost moves unpredictably
**Tests & Validation**:
- [ ] Random direction selection works at intersections
- [ ] Distance calculation to Pacman is accurate
- [ ] Flee behavior triggers when distance <8 tiles
- [ ] Movement appears random and unpredictable
- [ ] Ghost doesn't get stuck in loops
- [ ] Distance-based behavior switches smoothly
- [ ] Random seed produces varied behavior across games
- [ ] Visual verification: erratic, non-pattern movement
- [ ] Unit tests for distance calculation and random selection

### Task 36: Add ghost state management (normal, frightened, eyes) with transitions
**Deliverable**: Ghost state system
**Details**:
- State enumeration (NORMAL, FRIGHTENED, EYES)
- State transition logic
- Visual changes for each state
- Timer-based state management
**Acceptance Criteria**: Ghosts change states correctly
**Tests & Validation**:
- [ ] State enumeration includes all required states
- [ ] State transitions follow correct rules: NORMAL ⇄ FRIGHTENED → EYES → NORMAL
- [ ] Visual changes occur immediately on state change
- [ ] FRIGHTENED state has blue coloring and slower movement
- [ ] EYES state shows only eyes, moves toward spawn
- [ ] Timer-based transitions work: frightened mode duration
- [ ] Invalid state transitions are prevented
- [ ] All ghosts synchronize state changes correctly
- [ ] Unit tests cover all state transition scenarios

### Task 37: Implement ghost-Pacman collision detection and response
**Deliverable**: Ghost collision system
**Details**:
- Collision detection between ghosts and Pacman
- Different responses based on ghost state
- Game over on normal ghost collision
- Score points on frightened ghost collision
**Acceptance Criteria**: Ghost collisions work correctly
**Tests & Validation**:
- [ ] Collision detection works: test ghost-Pacman overlap
- [ ] NORMAL state collision triggers game over
- [ ] FRIGHTENED state collision awards points (200/400/800/1600)
- [ ] EYES state collision does nothing
- [ ] Collision radius is appropriate: not too strict/loose
- [ ] Multiple ghost collisions handled correctly
- [ ] Score progression works: 200→400→800→1600 per ghost
- [ ] Game over state prevents further collisions
- [ ] Unit tests for all collision scenarios and states

### Task 38: Create ghost respawn system when eaten during frightened mode
**Deliverable**: Ghost respawn mechanics
**Details**:
- Return to spawn point as eyes
- Regenerate to normal state at spawn
- Proper timing and visual feedback
- Maintain game balance
**Acceptance Criteria**: Eaten ghosts respawn correctly
**Tests & Validation**:
- [ ] Eaten ghost immediately enters EYES state
- [ ] Ghost moves toward spawn point via pathfinding
- [ ] Ghost regenerates to NORMAL state at spawn
- [ ] Respawn timing is balanced: not too fast/slow
- [ ] Visual feedback shows eyes moving to spawn
- [ ] Multiple eaten ghosts respawn independently
- [ ] Respawn doesn't interfere with other ghost AI
- [ ] Ghost exits spawn area properly after respawn
- [ ] Unit tests for respawn logic and timing