# Setup Instructions for SW Team

## Quick Start

### 1. Extract the Files
Unzip the project archive to your desired location.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

The production build will be in the `dist/` folder.

## File Structure Overview

```
elderly-care-app/
├── index.html              # HTML entry point
├── main.tsx                # React app entry point
├── App.tsx                 # Main app component with routing
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── components/             # React components
│   ├── AlarmHandlingPage.tsx
│   ├── BottomNavIcons.tsx
│   ├── ClientsPage.tsx
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── PatientDetailsPage.tsx
│   ├── PhoneFrame.tsx
│   ├── VitalsPage.tsx
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/                 # Shadcn/UI components
└── styles/
    └── globals.css         # Global styles and Tailwind config
```

## Key Technologies

- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling (configured in globals.css)
- **Shadcn/UI** - Component library
- **Lucide React** - Icon library

## Testing the App

### Login
- Enter any username (e.g., "Max Well")
- Enter any password
- Click "Let's go"

### Navigation Flow
1. **Landing Page** - Click on any feature card
2. **Clients** - Click on a patient to view details
3. **Patient Details** - Click "View Details" for vitals
4. **Vitals** - See patient vital signs
5. **Emergency Response** - Click bell icon from any page

### Alarm System
- Click the bell icon (shows "3" initially)
- Mark alarms as "In Progress"
- Reset alarms to resolve them
- Notice the alarm count updates across all pages

## Development Notes

### State Management
All shared state lives in `App.tsx`:
- User authentication state
- Current page/navigation
- Alarm data and counts

### Adding New Pages
1. Create component in `/components`
2. Import in `App.tsx`
3. Add route condition in the return statement
4. Update navigation calls in other components

### Styling Guidelines
- **DO NOT** use Tailwind font utilities (text-xl, font-bold, etc.)
- Typography is controlled in `globals.css`
- Use the existing teal color scheme (#0f766e)
- Follow mobile-first responsive design

### Component Guidelines
- Use Shadcn components from `/components/ui`
- Import images with `ImageWithFallback` component
- Use Lucide React for icons
- Keep components focused and single-purpose

## Environment Variables (Future)

When integrating with backend:

```env
VITE_API_BASE_URL=https://api.yourbackend.com
VITE_WS_URL=wss://ws.yourbackend.com
VITE_API_KEY=your_api_key_here
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Package Management
npm install          # Install dependencies
npm update           # Update dependencies
npm outdated         # Check for outdated packages
```

## Browser DevTools

### Recommended Extensions
- React Developer Tools
- Redux DevTools (for future state management)
- Tailwind CSS IntelliSense

## Troubleshooting

### Port Already in Use
```bash
# Vite will automatically try the next available port
# Or specify a port:
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check TypeScript config
npx tsc --noEmit
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Next Steps for Production

### Essential
1. ✅ Replace mock data with API calls
2. ✅ Implement real authentication
3. ✅ Add error boundaries
4. ✅ Add loading states
5. ✅ Add form validation

### Recommended
6. ✅ Add unit tests (Vitest)
7. ✅ Add E2E tests (Playwright)
8. ✅ Set up CI/CD pipeline
9. ✅ Add error tracking (Sentry)
10. ✅ Add analytics

### Optional
11. Add offline support (PWA)
12. Add push notifications
13. Add accessibility improvements
14. Add internationalization (i18n)
15. Add performance monitoring

## API Integration Points

### Authentication
```typescript
POST /api/auth/login
{
  username: string;
  password: string;
}
```

### Patients
```typescript
GET /api/patients
GET /api/patients/:id
GET /api/patients/:id/vitals
```

### Alarms
```typescript
GET /api/alarms
PUT /api/alarms/:id
{
  status: 'active' | 'in-progress' | 'resolved';
  handledBy?: string;
}
```

### WebSocket Events
```typescript
// Subscribe to real-time updates
ws://your-backend/notifications

// Events:
- 'new_alarm'
- 'alarm_updated'
- 'vital_updated'
```

## Support

For questions about this prototype:
- Check the main README.md
- Review the inline code comments
- Contact the design/product team

## Version History

- **v1.0.0** (Nov 7, 2024) - Initial prototype release
  - Complete UI implementation
  - Working alarm system
  - All navigation flows
  - Ready for backend integration

---

Good luck with development! 🚀
