# Phase 5: Game Logic & Scoring (Tasks 39-48)

## 🎯 Phase 5: Game Logic & Scoring (Tasks 39-48)

### Task 39: Implement pathfinding algorithm for ghost navigation
**Deliverable**: A* pathfinding for ghosts
**Details**:
- A* algorithm implementation
- Maze-aware pathfinding
- Efficient path calculation
- Handle dynamic obstacles
**Acceptance Criteria**: Ghosts navigate maze intelligently
**Tests & Validation**:
- [ ] A* algorithm finds shortest path correctly
- [ ] Pathfinding respects maze walls
- [ ] Path calculation completes in <5ms per ghost
- [ ] Algorithm handles unreachable targets gracefully
- [ ] Dynamic obstacle avoidance works
- [ ] Path smoothing prevents jerky movement
- [ ] Memory usage is reasonable: no path caching leaks
- [ ] Unit tests for pathfinding edge cases
- [ ] Visual debugging shows calculated paths correctly

### Task 40: Create game state management (playing, paused, game over, level complete)
**Deliverable**: Game state system
**Details**:
- State enumeration and transitions
- Pause/resume functionality
- Game over detection
- Level completion logic
**Acceptance Criteria**: Game states transition correctly
**Tests & Validation**:
- [ ] State enumeration includes: PLAYING, PAUSED, GAME_OVER, LEVEL_COMPLETE
- [ ] Pause/resume transitions work: PLAYING ⇄ PAUSED
- [ ] Game over triggers correctly: on life loss with 0 lives
- [ ] Level complete triggers: when all dots collected
- [ ] Invalid state transitions are prevented
- [ ] Game loop respects current state
- [ ] UI updates reflect current game state
- [ ] State persistence works through page refresh
- [ ] Unit tests cover all state transition scenarios

### Task 41: Implement scoring system with different point values for items
**Deliverable**: Comprehensive scoring system
**Details**:
- Dots: 10 points each
- Power pellets: 50 points each
- Ghosts: 200/400/800/1600 progressive points
- Bonus items: 100-500 points
- Level completion bonus: 1000 points
**Acceptance Criteria**: All scoring events work correctly
**Tests & Validation**:
- [ ] Dot collection awards 10 points: test score increment
- [ ] Power pellet collection awards 50 points
- [ ] Ghost eating progression: 200→400→800→1600 points
- [ ] Bonus items award correct points: verify by item type
- [ ] Level completion bonus: +1000 points
- [ ] Score display updates in real-time
- [ ] Maximum score handling: test large numbers
- [ ] Score persists through game sessions
- [ ] Unit tests for all scoring calculations

### Task 42: Add level progression logic with increasing difficulty
**Deliverable**: Level progression system
**Details**:
- Load next maze on level completion
- Increase ghost speed per level
- Decrease power pellet duration
- Progressive ghost introduction (1→2→3→4)
**Acceptance Criteria**: Difficulty increases across 10 levels
**Tests & Validation**:
- [ ] Next level loads automatically on completion
- [ ] Maze layout changes: verify different level designs
- [ ] Ghost speed increases: test movement timing per level
- [ ] Power pellet duration decreases: 8s→5s→3s progression
- [ ] Ghost count progression: Level 1(1 ghost)→Level 4(4 ghosts)
- [ ] Player position resets to start on new level
- [ ] Level counter displays correctly
- [ ] Difficulty curve feels balanced: not too easy/hard
- [ ] Integration tests for level transitions

### Task 43: Create lives system with respawn mechanics
**Deliverable**: Player lives management
**Details**:
- Start with 3 lives
- Lose life on ghost collision
- Respawn at start position
- Game over when lives reach 0
**Acceptance Criteria**: Lives system works correctly
**Tests & Validation**:
- [ ] Game starts with 3 lives displayed
- [ ] Life decreases on ghost collision in NORMAL state
- [ ] Pacman respawns at start position after death
- [ ] Lives display updates immediately
- [ ] Game over triggers when lives = 0
- [ ] Ghosts reset to normal state on respawn
- [ ] Score persists through respawns
- [ ] Invincibility period after respawn (2 seconds)
- [ ] Unit tests for life management logic

### Task 44: Implement game over conditions and level completion detection
**Deliverable**: Win/lose condition logic
**Details**:
- Level complete when all dots collected
- Game over when lives reach 0
- Victory when all 10 levels completed
- Proper state transitions
**Acceptance Criteria**: Game ends correctly under all conditions
**Tests & Validation**:
- [ ] Level complete triggers when dot count = 0
- [ ] Game over triggers when lives = 0
- [ ] Victory triggers after completing level 10
- [ ] Proper state transitions to appropriate screens
- [ ] Final score calculation includes all bonuses
- [ ] High score detection and saving works
- [ ] Game over screen displays correct statistics
- [ ] Victory screen shows completion message
- [ ] Unit tests for all end-game conditions

### Task 45: Add bonus item system with random appearance and scoring
**Deliverable**: Bonus item mechanics
**Details**:
- Random fruit/bonus items appear
- Timer-based appearance/disappearance
- Different point values per item type
- Visual feedback for collection
**Acceptance Criteria**: Bonus items appear and can be collected
**Tests & Validation**:
- [ ] Bonus items appear randomly during gameplay
- [ ] Items disappear after timeout (10 seconds)
- [ ] Different item types have different point values
- [ ] Collection awards correct points and shows feedback
- [ ] Items appear in center of maze only
- [ ] Appearance probability is balanced: not too frequent/rare
- [ ] Visual collection effect shows points earned
- [ ] Sound effect plays on collection
- [ ] Unit tests for bonus item timing and scoring

### Task 46: Create game loop with requestAnimationFrame for smooth 60 FPS
**Deliverable**: Optimized game loop
**Details**:
- requestAnimationFrame-based loop
- Consistent 60 FPS performance
- Delta time for frame-independent movement
- Efficient render cycle
**Acceptance Criteria**: Game runs smoothly at 60 FPS
**Tests & Validation**:
- [ ] Game loop uses requestAnimationFrame
- [ ] Frame rate stays at 60 FPS: monitor with performance tools
- [ ] Delta time calculation works correctly
- [ ] Movement is frame-independent: same speed on different devices
- [ ] Render cycle is efficient: <16ms per frame
- [ ] Game loop handles window focus/blur correctly
- [ ] No memory leaks: stable memory usage over time
- [ ] Performance testing on low-end devices
- [ ] Game loop stops properly when paused

### Task 47: Implement game pause/resume functionality
**Deliverable**: Pause system
**Details**:
- Pause with spacebar or P key
- Freeze all game objects
- Display pause overlay
- Resume functionality
**Acceptance Criteria**: Game can be paused and resumed
**Tests & Validation**:
- [ ] Spacebar and P key trigger pause
- [ ] All game objects freeze: Pacman, ghosts, timers
- [ ] Pause overlay displays with resume instructions
- [ ] Game resumes exactly where it paused
- [ ] Pause state persists if window loses focus
- [ ] Cannot pause during game over or level complete
- [ ] Keyboard input ignored while paused (except resume)
- [ ] Pause/resume transitions are smooth
- [ ] Unit tests for pause state management

### Task 48: Create GameUI component for score, lives, and level display
**Deliverable**: Game HUD interface
**Details**:
- Current score display
- Lives remaining indicator
- Current level number
- High score display
**Acceptance Criteria**: UI displays all game information
**Tests & Validation**:
- [ ] Score updates in real-time during gameplay
- [ ] Lives display shows correct count (visual icons)
- [ ] Level number displays and updates correctly
- [ ] High score displays and updates when beaten
- [ ] UI layout is clean and non-intrusive
- [ ] UI is responsive: works on different screen sizes
- [ ] Text is readable: appropriate font size and contrast
- [ ] Component renders without errors
- [ ] UI updates don't cause performance issues