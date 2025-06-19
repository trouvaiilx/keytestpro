# KeyTest Pro - Professional Typing Speed & Keyboard Tester

## Overview

KeyTest Pro is a full-stack web application built for testing keyboard functionality and improving typing speed. The application features a keyboard tester with visual feedback and a comprehensive typing test with character-level typo detection, WPM calculations and accuracy tracking.

## System Architecture

The application follows a modern full-stack architecture:

**Frontend**: React with TypeScript, using Vite as the build tool
**Backend**: Express.js server with TypeScript
**Styling**: Tailwind CSS with shadcn/ui component library
**Database**: PostgreSQL with Drizzle ORM (configured but not actively used)
**State Management**: React Query for server state, React hooks for local state
**Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components with TypeScript
- **UI Framework**: shadcn/ui provides a comprehensive set of accessible components
- **Theme System**: Custom dark/light theme provider with CSS variables
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Build System**: Vite with React plugin and development tools

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **API Structure**: RESTful API with `/api` prefix (currently minimal implementation)
- **Development Tools**: Hot reloading with Vite integration
- **Error Handling**: Centralized error handling middleware

### Key Features
1. **Keyboard Tester**: Real-time key detection with virtual keyboard visualization
2. **Typing Test**: WPM calculation, accuracy tracking, and multiple text options
3. **Theme Toggle**: Light/dark mode with persistent preferences
4. **Responsive Design**: Works across desktop and mobile devices

## Data Flow

### Keyboard Testing Flow
1. User presses keys on physical keyboard
2. JavaScript keyboard event listeners capture keydown/keyup events
3. Virtual keyboard component updates to highlight pressed keys
4. Key press log maintains history of all keyboard interactions

### Typing Test Flow
1. User selects test duration and text type
2. Timer starts on first keystroke
3. Real-time WPM and accuracy calculations during typing
4. Final results displayed upon completion or timeout
5. Option to restart with new parameters

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18+ with hooks and context
- **UI Components**: Radix UI primitives via shadcn/ui
- **Database**: Drizzle ORM with PostgreSQL support
- **HTTP Client**: Native fetch API with React Query
- **Styling**: Tailwind CSS with PostCSS

### Development Tools
- **Build Tool**: Vite with TypeScript support
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint integration (via Vite plugins)
- **Development Server**: Express with Vite middleware integration

## Deployment Strategy

The application is configured for Replit deployment with:

**Build Process**: 
- Frontend: Vite build process compiling React/TypeScript to static assets
- Backend: esbuild bundling Express server to single JavaScript file

**Runtime Environment**:
- Node.js 20 with ES modules
- PostgreSQL 16 for database (provisioned but not actively used)
- Auto-scaling deployment target

**Development Workflow**:
- Hot reloading for both frontend and backend
- Integrated development server on port 5000
- Automatic builds and restarts

## Recent Changes

```
Recent Changes:
- June 19, 2025: Word-based typing system with permanent accuracy tracking
  - Implemented word-by-word progression with Space key advancement
  - Users cannot return to previous words for true accuracy measurement
  - Input field clears after each word completion
  - Fixed WPM calculation bug that showed 0 when test completed early
  - Changed error counting to count incorrect words (not characters)
  - Added real-time error highlighting while typing
  - Increased input field font size for better readability
  - Implemented real-time WPM updates during typing
  - Added smooth animations for word transitions
  - Created animated celebration screen with performance badges
  - Updated error label to show "Error" vs "Errors" based on count
  - Enhanced word library with more variety

- June 19, 2025: Major typing test improvements
  - Fixed character-level typo detection with real-time visual feedback
  - Timer now starts on first keystroke instead of button press
  - Removed unwanted cursor from input field
  - Fixed text wrapping issues in typing display area
  - Added proper strikethrough for incorrect characters
  - Improved footer spacing to be more dynamic
  - Updated branding to "KeyTest Pro" with 2025 copyright
  
- June 19, 2025: Initial setup with keyboard tester and basic typing test
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Technical Notes

### Database Configuration
- Drizzle ORM is configured with PostgreSQL support
- Schema defines basic user table structure
- Currently using in-memory storage for development
- Ready for PostgreSQL integration when needed

### Performance Considerations
- React Query handles caching and synchronization
- Optimized re-renders through proper hook usage
- Lazy loading and code splitting ready for implementation
- CSS-in-JS avoided in favor of utility classes for performance

### Security Considerations
- TypeScript provides compile-time type safety
- Input validation ready for implementation
- CORS and security headers can be added as needed
- Environment variables properly configured for database credentials