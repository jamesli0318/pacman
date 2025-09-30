# Guest Mode Feature

## Overview
Guest Mode allows users to play Pacman without creating an account or logging in. This feature provides immediate access to gameplay while encouraging registration for score persistence and additional features.

## User Experience

### Entry Points
Users can access Guest Mode from multiple locations:

1. **Home Page**: "🎮 Play as Guest" button alongside Login/Register buttons
2. **Login Page**: "continue as guest" link at the bottom of the form

### Guest Session
- Unique guest identifier generated: `guest_{timestamp}`
- Display name: "Guest Player"
- Session persists across page refreshes via localStorage
- No backend API calls required for authentication

### Guest UI Features

#### Warning Banner
- Yellow banner displayed at top of game page
- Message: "🎮 Playing as Guest - Your scores won't be saved."
- Includes prominent "Sign up to save your progress!" link

#### Navigation
- **Leaderboard Button**: Access to view-only leaderboard
- **Back to Home Button**: Replaces logout button for guests
- **No Profile Access**: Profile routes remain protected

## Feature Matrix

| Feature | Authenticated User | Guest User |
|---------|-------------------|------------|
| Play Game | ✅ Full access | ✅ Full access |
| View Leaderboard | ✅ Full access | ✅ View-only |
| Save Scores | ✅ Saved to database | ❌ Not persisted |
| Game History | ✅ All-time stats | ❌ Session only |
| All Levels | ✅ Available | ✅ Available |
| Power-ups | ✅ Available | ✅ Available |
| Profile | ✅ Full access | ❌ No access |

## Technical Implementation

### Frontend Architecture

#### 1. Authentication Context
**File**: `/frontend/src/contexts/AuthContext.tsx`

New state variables:
```typescript
const [isGuest, setIsGuest] = useState<boolean>(false);
const [guestData, setGuestData] = useState<GuestUser | null>(null);
```

New methods:
```typescript
playAsGuest(): void  // Sets guest mode
logout(): void       // Now clears guest state too
```

#### 2. Type Definitions
**File**: `/frontend/src/types/auth.ts`

```typescript
export interface GuestUser {
  isGuest: true;
  username: string;      // "guest_{timestamp}"
  displayName: string;   // "Guest Player"
}

export interface AuthContextType {
  // ... existing fields
  isGuest: boolean;
  guestData: GuestUser | null;
  playAsGuest: () => void;
}
```

#### 3. Route Protection
**File**: `/frontend/src/components/common/ProtectedRoute.tsx`

```typescript
interface ProtectedRouteProps {
  children: React.ReactElement;
  allowGuests?: boolean;  // NEW
}

// Access logic
const hasAccess = isAuthenticated || (allowGuests && isGuest);
```

**Routes allowing guests**:
- `/game` - Full gameplay access
- `/leaderboard` - View-only access

#### 4. Component Updates

**Home Component** (`/frontend/src/components/common/Home.tsx`):
- Added "Play as Guest" button for unauthenticated users
- Button triggers `playAsGuest()` and navigates to `/game`

**Login Component** (`/frontend/src/components/auth/Login.tsx`):
- Added "continue as guest" link in footer
- Styled as text button with underline

**Game Component** (`/frontend/src/components/common/Game.tsx`):
- Yellow warning banner for guests
- "Back to Home" button instead of "Logout" for guests
- Banner includes registration CTA link

**App Routing** (`/frontend/src/App.tsx`):
- Game route: `<ProtectedRoute allowGuests={true}>`
- Leaderboard route: `<ProtectedRoute allowGuests={true}>`

### Local Storage

Guest mode uses browser localStorage for session persistence:

```typescript
// Storage keys
localStorage.setItem('isGuest', 'true');
localStorage.setItem('guestData', JSON.stringify(guestUser));

// Cleared on logout
localStorage.removeItem('isGuest');
localStorage.removeItem('guestData');
```

### Score Handling

#### Current Implementation
- **Guest scores**: Not persisted (localStorage possible in future)
- **Authenticated scores**: Saved to database via API

#### Future Enhancement
Could implement:
```typescript
// Save guest scores locally
localStorage.setItem('guestScores', JSON.stringify([
  { score: 1000, level: 3, timestamp: Date.now() }
]));

// Display in guest session only
// Prompt to register to persist scores
```

## User Flow Diagrams

### Guest Registration Incentives

```
User visits home
    ↓
Clicks "Play as Guest"
    ↓
Plays game (sees banner: "Sign up to save progress")
    ↓
Achieves high score
    ↓
Banner prompts: "Sign up to save your progress!"
    ↓
User clicks link → Registration page
    ↓
User creates account
    ↓
Scores now saved to database
```

### Guest vs Authenticated Path

```
GUEST PATH:
Home → Play as Guest → Game (with banner) → Leaderboard (view)
                                           ↓
                                    Back to Home

AUTHENTICATED PATH:
Home → Login → Game (no banner) → Leaderboard (full) → Profile
                    ↓
                 Logout
```

## Security Considerations

### What Guests CANNOT Do
- Submit scores to global leaderboard
- Access profile data
- View game history beyond current session
- Compete in rankings
- Persist any data to database

### What Guests CAN Do
- Play all levels
- Use all power-ups
- View global leaderboard (read-only)
- Access all gameplay features
- See current session stats

### Protection Mechanisms
1. **Route Guards**: ProtectedRoute with `allowGuests` flag
2. **Backend Protection**: API endpoints still require authentication
3. **No Anonymous Submissions**: Database integrity maintained
4. **Session Only**: Guest data cleared on browser close/logout

## Conversion Strategy

### Encouraging Registration

**1. Visible Prompts**:
- Yellow banner on game page (always visible)
- "Sign up to save progress" link
- Post-game achievement messages

**2. Strategic Timing**:
- After completing first level
- After achieving personal best
- Before accessing restricted features

**3. Value Proposition**:
- "Save your scores permanently"
- "Compete on the leaderboard"
- "Track your progress over time"
- "Unlock profile features"

## Testing Checklist

### Guest Mode Activation
- [ ] Home page "Play as Guest" button works
- [ ] Login page "continue as guest" link works
- [ ] Guest session persists across page refresh
- [ ] Guest data stored in localStorage correctly

### Guest Gameplay
- [ ] Game accessible without authentication
- [ ] All levels playable
- [ ] Warning banner displays correctly
- [ ] "Back to Home" button works
- [ ] Leaderboard accessible (view-only)

### Guest Restrictions
- [ ] Cannot access profile routes
- [ ] Cannot submit scores to database
- [ ] Redirected appropriately from auth-only pages

### State Management
- [ ] Logout clears guest state
- [ ] Guest state cleared from localStorage
- [ ] Registration converts guest to authenticated user
- [ ] No conflicts between guest/auth states

### UI/UX
- [ ] Banner prominent but not intrusive
- [ ] Registration CTAs visible and clickable
- [ ] Navigation intuitive for guests
- [ ] No confusing error messages

## Future Enhancements

### Potential Additions
1. **Local Score Persistence**: Save guest scores to localStorage
2. **Score Migration**: Transfer guest scores to new account on registration
3. **Session Statistics**: Show guest session stats (games played, best score)
4. **Time-Limited Sessions**: Auto-prompt registration after X minutes/games
5. **Anonymous Leaderboard**: Separate leaderboard for guest high scores (local)
6. **Guest Achievements**: Track achievements locally, unlock on registration

### Metrics to Track
- Guest mode adoption rate
- Guest → Registered conversion rate
- Average session length before registration
- Drop-off points in guest experience
- Most common conversion trigger points

## Changelog

### Version 1.0 - Initial Implementation (2025-09-30)
- ✅ Guest authentication system
- ✅ Guest session persistence (localStorage)
- ✅ Guest UI (warning banner, navigation)
- ✅ Route protection with `allowGuests` flag
- ✅ Home page and Login page entry points
- ✅ Registration prompts and CTAs

### Planned for Version 1.1
- ⏳ Local score persistence
- ⏳ Score migration on registration
- ⏳ Guest session statistics
- ⏳ Enhanced conversion tracking