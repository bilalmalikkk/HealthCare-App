# Elderly Care App - React Prototype

A functional prototype for an Android elderly care application with medical at-home support and sensor monitoring. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Login System** - User authentication with personalized welcome
- **Landing Page** - Quick access to key features with alarm notifications
- **Client Management** - Browse and search patient list
- **Patient Details** - View comprehensive patient information
- **Vital Signs Monitoring** - Track patient vitals with historical data
- **Emergency Response** - Real-time alarm handling with status tracking
- **Bottom Navigation** - Consistent navigation across all screens
- **Phone Frame** - Realistic Samsung-style Android UI with status bar

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS v4.0** for styling
- **Shadcn/UI** components
- **Lucide React** for icons
- **Vite** for build tooling

## Project Structure

```
├── App.tsx                      # Main app with routing and shared state
├── components/
│   ├── AlarmHandlingPage.tsx    # Emergency response alarm management
│   ├── BottomNavIcons.tsx       # Custom navigation icons
│   ├── ClientsPage.tsx          # Patient list view
│   ├── LandingPage.tsx          # Home screen with features
│   ├── LoginPage.tsx            # Authentication screen
│   ├── PatientDetailsPage.tsx   # Patient information view
│   ├── PhoneFrame.tsx           # Android phone wrapper
│   ├── VitalsPage.tsx           # Patient vital signs
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/                      # Shadcn/UI components
├── styles/
│   └── globals.css              # Global styles and Tailwind config
└── imports/                     # Imported assets (if any)
```

## Key Features Detail

### Alarm Management System
- **Real-time Updates**: Alarm count updates across all pages
- **Status Tracking**: Active → In Progress → Resolved workflow
- **Timestamps**: Automatic tracking of start and resolution times
- **User Attribution**: Shows who handled each alarm

### Navigation Flow
```
Login → Landing Page → Clients List → Patient Details → Vitals
                    ↓
              Emergency Response (accessible from any page)
```

### Design System
- **Color Scheme**: Teal/green primary colors (#0f766e)
- **Typography**: Custom font system in globals.css
- **Icons**: Clean outline style with Lucide React
- **Layout**: Mobile-first, optimized for Android

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Default Login Credentials
- Username: Any name (e.g., "Max Well")
- Password: Any password

The app will use the entered username throughout the interface.

### Testing Alarm System

1. Click the notification bell (shows "3 active alarms" initially)
2. Mark alarms as "In Progress" to track handling
3. Reset alarms to resolve them
4. Watch the alarm count update across all pages

## State Management

The app uses React's built-in state management with state lifted to `App.tsx`:

- **User State**: `currentUser`, `isLoggedIn`
- **Navigation State**: `currentPage`, `selectedPatientId`
- **Alarm State**: Shared `alarms` array with handlers

## Customization

### Adding New Patients
Edit the `clients` array in `ClientsPage.tsx`

### Modifying Vital Signs
Update the `vitals` array in `VitalsPage.tsx`

### Changing Theme Colors
Modify CSS variables in `styles/globals.css`

### Adding New Features
1. Create component in `/components`
2. Add navigation route in `App.tsx`
3. Update navigation in relevant pages

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes for Development Team

### Important Considerations

1. **Image Handling**: Uses `ImageWithFallback` component for robustness
2. **No Font Utilities**: Avoid Tailwind font classes (text-2xl, font-bold, etc.) - typography is controlled via globals.css
3. **Tailwind v4.0**: Configuration is in CSS, no tailwind.config.js needed
4. **Shadcn Components**: Pre-installed in `/components/ui` - don't recreate them

### Next Steps for Production

- [ ] Integrate with real backend API
- [ ] Add proper authentication system
- [ ] Connect to sensor data feeds
- [ ] Implement real-time notifications
- [ ] Add data persistence (database)
- [ ] Implement offline support
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Add error boundaries
- [ ] Implement logging and analytics

### API Integration Points

The following areas need backend integration:

- **Login**: POST `/api/auth/login`
- **Patients**: GET `/api/patients`
- **Vitals**: GET `/api/patients/:id/vitals`
- **Alarms**: GET/PUT `/api/alarms`
- **Notifications**: WebSocket connection for real-time updates

## License

Proprietary - Internal use only

## Contact

For questions about this prototype, contact the design/product team.

---

**Version**: 1.0.0  
**Last Updated**: November 7, 2024  
**Created with**: Figma Make
