# Phase 2: Authentication System (Tasks 9-21)

## 🔐 Phase 2: Authentication System (Tasks 9-21)

### Task 9: Create Player model with username, email, password fields
**Deliverable**: Django Player model
**Details**:
- Extend Django's AbstractUser or create custom model
- Add unique constraints on username and email
- Include timestamps for created_at
- Add validation for username format
**Acceptance Criteria**: Model creates database table correctly
**Tests & Validation**:
- [ ] `python manage.py makemigrations` creates migration file
- [ ] `python manage.py migrate` applies migration successfully
- [ ] Model validation works: test unique constraints
- [ ] `python manage.py shell` can create/query Player objects
- [ ] Username validation rejects invalid formats
- [ ] Password hashing works correctly

### Task 10: Create GameSession model with score, level, duration, player foreign key
**Deliverable**: GameSession model for storing game data
**Details**:
- Foreign key relationship to Player model
- Integer fields for score, level_reached, duration_seconds
- Timestamp for completed_at
- Optional fields for additional game metrics
**Acceptance Criteria**: Model supports game session tracking
**Tests & Validation**:
- [ ] Migration creates GameSession table with correct fields
- [ ] Foreign key relationship to Player works
- [ ] Can create GameSession objects via Django shell
- [ ] Model __str__ method returns meaningful representation
- [ ] Field validation prevents negative scores/levels
- [ ] Cascade delete works when Player is deleted

### Task 11: Create database migrations and apply initial migration
**Deliverable**: Django database migrations
**Details**:
- Generate migrations for Player and GameSession models
- Apply migrations to create database tables
- Verify database schema matches models
**Acceptance Criteria**: Database tables created successfully
**Tests & Validation**:
- [ ] `python manage.py showmigrations` shows all migrations applied
- [ ] Database schema matches models: `python manage.py sqlmigrate`
- [ ] No pending migrations: `python manage.py makemigrations --check`
- [ ] Tables exist in database: `python manage.py dbshell` and `.tables`
- [ ] Table structures are correct: `.schema table_name`
- [ ] Can insert/query data in created tables

### Task 12: Create leaderboard database view for top scores query optimization
**Deliverable**: Optimized database view for leaderboard
**Details**:
- Create SQL view joining players and game_sessions
- Order by score DESC, completed_at ASC
- Include player username, score, level_reached
- Add database indexes for performance
**Acceptance Criteria**: View provides fast leaderboard queries
**Tests & Validation**:
- [ ] View creation SQL executes without errors
- [ ] `SELECT * FROM leaderboard LIMIT 10` returns correct data
- [ ] Query performance is under 50ms with 1000+ records
- [ ] View joins tables correctly and shows expected columns
- [ ] Indexes exist: check with `.indexes` in SQLite
- [ ] View updates automatically when GameSession data changes

### Task 13: Implement user registration API endpoint with validation
**Deliverable**: POST /api/auth/register/ endpoint
**Details**:
- Validate username uniqueness and format
- Validate email format and uniqueness
- Hash passwords securely
- Return appropriate error messages
- Create JWT token on successful registration
**Acceptance Criteria**: Users can register with proper validation
**Tests & Validation**:
- [ ] `curl -X POST /api/auth/register/` with valid data returns 201
- [ ] Duplicate username/email returns 400 with clear error
- [ ] Invalid email format returns 400
- [ ] Weak password returns 400 with requirements
- [ ] JWT token returned in response
- [ ] Password is hashed in database
- [ ] Unit tests cover all validation scenarios

### Task 14: Implement JWT authentication login/logout endpoints
**Deliverable**: Login/logout API endpoints
**Details**:
- POST /api/auth/login/ with username/password
- POST /api/auth/logout/ to invalidate tokens
- Return access and refresh tokens
- Handle invalid credentials gracefully
**Acceptance Criteria**: Authentication flow works end-to-end
**Tests & Validation**:
- [ ] Valid login returns access and refresh tokens
- [ ] Invalid credentials return 401 with error message
- [ ] Tokens can be used to access protected endpoints
- [ ] Logout invalidates tokens properly
- [ ] Token refresh works: `POST /api/auth/token/refresh/`
- [ ] Expired tokens return 401
- [ ] Rate limiting prevents brute force attacks

### Task 15: Create user profile API endpoint with authentication required
**Deliverable**: GET /api/auth/profile/ endpoint
**Details**:
- Require JWT authentication
- Return user profile information
- Include game statistics (total games, best score)
- Handle unauthenticated requests
**Acceptance Criteria**: Protected endpoint returns user data
**Tests & Validation**:
- [ ] Authenticated request returns user profile with 200
- [ ] Unauthenticated request returns 401
- [ ] Invalid token returns 401
- [ ] Profile includes username, email, join date
- [ ] Game statistics are accurate (total games, best score)
- [ ] Response format matches API documentation

### Task 16: Set up JWT token middleware and authentication classes
**Deliverable**: JWT authentication middleware
**Details**:
- Configure JWT token validation
- Set up authentication classes for DRF
- Handle token expiration and refresh
- Add proper error responses for invalid tokens
**Acceptance Criteria**: JWT authentication works across all protected endpoints
**Tests & Validation**:
- [ ] Valid JWT token allows access to protected endpoints
- [ ] Expired token returns 401 with clear message
- [ ] Malformed token returns 401
- [ ] Token refresh extends access properly
- [ ] Blacklisted tokens are rejected
- [ ] Authentication works across all apps

### Task 17: Create React AuthContext for managing authentication state
**Deliverable**: React authentication context
**Details**:
- Create AuthContext with login/logout/register methods
- Manage JWT tokens in localStorage
- Provide authentication state to components
- Handle token expiration and auto-logout
**Acceptance Criteria**: Authentication state managed globally
**Tests & Validation**:
- [ ] AuthContext provides authentication state to all components
- [ ] Login function sets user state and stores tokens
- [ ] Logout function clears state and removes tokens
- [ ] Token refresh works automatically
- [ ] Auto-logout on token expiration
- [ ] Component tests verify context behavior

### Task 18: Implement Login component with form validation and API integration
**Deliverable**: Login form component
**Details**:
- Form with username/email and password fields
- Client-side validation (required fields, email format)
- API integration with error handling
- Redirect to game on successful login
**Acceptance Criteria**: Users can log in through the UI
**Tests & Validation**:
- [ ] Form validates required fields before submission
- [ ] Email format validation works
- [ ] Successful login redirects to intended page
- [ ] Invalid credentials show error message
- [ ] Loading state shown during API call
- [ ] Component renders correctly in different states
- [ ] Keyboard navigation works (tab, enter)

### Task 19: Implement Register component with form validation and API integration
**Deliverable**: Registration form component
**Details**:
- Form with username, email, password, confirm password
- Real-time validation feedback
- API integration with error handling
- Auto-login after successful registration
**Acceptance Criteria**: Users can register through the UI
**Tests & Validation**:
- [ ] All form fields validate correctly
- [ ] Password confirmation matches
- [ ] Real-time validation feedback works
- [ ] Successful registration auto-logs in user
- [ ] Server errors display properly
- [ ] Form accessibility (labels, ARIA attributes)
- [ ] Password strength indicator works

### Task 20: Create protected route wrapper component for authenticated routes
**Deliverable**: ProtectedRoute component
**Details**:
- Check authentication status before rendering
- Redirect to login if not authenticated
- Handle loading states during auth checks
- Preserve intended route after login
**Acceptance Criteria**: Protected routes enforce authentication
**Tests & Validation**:
- [ ] Authenticated users can access protected routes
- [ ] Unauthenticated users redirect to login
- [ ] Intended route preserved in URL params
- [ ] Loading state shows during auth check
- [ ] Token validation works on route change
- [ ] Component tests cover all scenarios

### Task 21: Set up React Router with authentication-based route protection
**Deliverable**: Complete routing system
**Details**:
- Configure react-router-dom
- Define routes for login, register, game, leaderboard
- Apply ProtectedRoute to game and leaderboard
- Handle navigation and route guards
**Acceptance Criteria**: Routing works with authentication flow
**Tests & Validation**:
- [ ] All routes navigate correctly
- [ ] Protected routes require authentication
- [ ] 404 page shows for invalid routes
- [ ] Browser back/forward buttons work
- [ ] Deep linking works for all routes
- [ ] Route transitions are smooth
- [ ] URL reflects current application state