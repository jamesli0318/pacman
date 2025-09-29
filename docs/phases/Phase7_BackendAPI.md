# Phase 7: Backend API Integration (Tasks 52-57)

## 🌐 Phase 7: Backend API Integration (Tasks 52-57)

### Task 52: Create game session start API endpoint
**Deliverable**: POST /api/games/start/ endpoint
**Details**:
- Create new GameSession record
- Return session ID for tracking
- Validate authenticated user
- Initialize session data
**Acceptance Criteria**: Game sessions can be started via API
**Tests & Validation**:
- [ ] `curl -X POST /api/games/start/ -H "Authorization: Bearer {token}"` returns 201
- [ ] Response includes session ID: `{"session_id": "uuid"}`
- [ ] Unauthenticated request returns 401
- [ ] Database record created with correct user association
- [ ] Session initializes with score=0, level=1, start_time
- [ ] Concurrent sessions allowed for same user
- [ ] API response time <200ms
- [ ] Unit tests for endpoint validation
- [ ] Integration tests for database operations

### Task 53: Implement game session update API for score and level progress
**Deliverable**: PUT /api/games/{id}/ endpoint
**Details**:
- Update score and level in real-time
- Validate session ownership
- Prevent score manipulation
- Handle network errors gracefully
**Acceptance Criteria**: Game progress syncs with backend
**Tests & Validation**:
- [ ] `curl -X PUT /api/games/{id}/ -d '{"score": 1000, "level": 2}'` updates correctly
- [ ] Session ownership validation: only creator can update
- [ ] Score validation: reject impossible score increases
- [ ] Level validation: reject invalid level numbers
- [ ] Rate limiting: max 1 update per second
- [ ] Network error handling: retry logic on frontend
- [ ] Invalid session ID returns 404
- [ ] Malformed data returns 400 with validation errors
- [ ] Unit tests for validation logic

### Task 54: Create game session end API endpoint with final score submission
**Deliverable**: POST /api/games/{id}/end/ endpoint
**Details**:
- Finalize game session
- Submit final score and statistics
- Update player's best scores
- Trigger leaderboard update
**Acceptance Criteria**: Final scores are submitted correctly
**Tests & Validation**:
- [ ] `curl -X POST /api/games/{id}/end/ -d '{"final_score": 5000}'` returns 200
- [ ] Session marked as completed with end timestamp
- [ ] Player's best score updated if exceeded
- [ ] Leaderboard cache invalidated/updated
- [ ] Final score validation: matches last update
- [ ] Cannot end session twice: idempotent operation
- [ ] Session ownership validation required
- [ ] Database transaction ensures data consistency
- [ ] Unit tests for score finalization logic

### Task 55: Implement server-side score validation to prevent cheating
**Deliverable**: Score validation system
**Details**:
- Validate score progression makes sense
- Check time-based score limits
- Detect impossible scores
- Rate limiting for score submissions
**Acceptance Criteria**: Cheating prevention works effectively
**Tests & Validation**:
- [ ] Score progression validation: reject sudden large increases
- [ ] Time-based limits: maximum points per minute calculated
- [ ] Impossible score detection: > theoretical maximum
- [ ] Rate limiting: max 10 updates per minute per user
- [ ] Session duration validation: minimum time for high scores
- [ ] Score rollback on validation failure
- [ ] Suspicious activity logging and monitoring
- [ ] False positive rate <1%: legitimate gameplay not blocked
- [ ] Unit tests for all validation rules

### Task 56: Create leaderboard API endpoint with pagination and filtering
**Deliverable**: GET /api/leaderboard/ endpoint
**Details**:
- Return top 100 players by score
- Support pagination for large datasets
- Filter by time period (daily, weekly, all-time)
- Include player ranking information
**Acceptance Criteria**: Leaderboard data loads efficiently
**Tests & Validation**:
- [ ] `curl /api/leaderboard/` returns top 100 players
- [ ] Pagination works: `?page=2&limit=50` returns correct subset
- [ ] Time filters work: `?period=daily` shows last 24 hours
- [ ] Response includes rank, username, score, level
- [ ] Query performance <100ms with 10K+ records
- [ ] Cache headers set for efficient browser caching
- [ ] Weekly filter shows last 7 days correctly
- [ ] All-time filter shows historical best scores
- [ ] Unit tests for filtering and pagination logic

### Task 57: Implement player ranking API endpoint with current player position
**Deliverable**: GET /api/leaderboard/me/ endpoint
**Details**:
- Return current player's rank
- Show nearby players (±5 positions)
- Handle unranked players
- Cache for performance
**Acceptance Criteria**: Player can see their ranking
**Tests & Validation**:
- [ ] `curl /api/leaderboard/me/ -H "Authorization: Bearer {token}"` returns player rank
- [ ] Response includes ±5 positions around player
- [ ] Unranked players get appropriate message
- [ ] Player's best score and rank are accurate
- [ ] Caching reduces database queries by 90%
- [ ] Cache invalidation works on new high scores
- [ ] Query performance <50ms
- [ ] Authentication required: 401 for invalid tokens
- [ ] Integration tests for ranking calculation