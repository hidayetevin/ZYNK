# Dodge Game

Fast-paced arcade game where you dodge obstacles coming from all directions!

## 🎮 Features

- **360° Movement**: Move in any direction using keyboard or touch
- **Dynamic Difficulty**: Game gets harder as you survive longer
- **Power-Ups**: Shield, Slow Motion, Double Score
- **Multiple Obstacle Types**: Meteor, Spike, Electric
- **Star System**: Earn stars by surviving longer
- **Theme System**: Unlock new visual themes with stars

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Controls

- **Keyboard**: Arrow keys to move
- **Touch/Mouse**: Click and drag to move player

## 📊 Game Stats

- Survive as long as possible
- Earn stars based on survival time:
  - ⭐ 1 Star: 10-20 seconds
  - ⭐⭐ 2 Stars: 20-40 seconds
  - ⭐⭐⭐ 3 Stars: 40+ seconds

## 🛠 Tech Stack

- **Phaser.js 3.80+**: Game engine
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Capacitor**: Mobile deployment

## 📱 Mobile Deployment

### iOS/Android Setup

```bash
# Install Capacitor plugins
npm install @capacitor/admob @capacitor/haptics @capacitor/status-bar @capacitor/splash-screen

# Initialize Capacitor (run once)
npx cap init "Dodge Game" "com.yourstudio.dodgegame"

# Build web assets
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Sync web assets to native projects
npx cap sync

# Open in native IDEs
npx cap open android
npx cap open ios
```

## 📂 Project Structure

```
dodge-game/
├── src/
│   ├── config/          # Game configuration
│   ├── scenes/          # Phaser scenes
│   ├── systems/         # Game systems (managers)
│   ├── entities/        # Game entities (Player, Obstacle)
│   ├── ui/              # UI components
│   ├── types/           # TypeScript types
│   └── assets/          # Game assets
├── public/              # Static files
└── dist/                # Build output
```

## 🎨 Development Status

### ✅ Completed (Phase 1-2)
- [x] Project setup (Vite + TypeScript + Phaser)
- [x] Core game configuration
- [x] Player entity with 360° movement
- [x] Obstacle spawning system
- [x] Collision detection
- [x] Basic UI
- [x] LocalStorage persistence
- [x] Menu scene
- [x] Game scene with full game loop

### 🚧 In Progress (Phase 3)
- [ ] ResultScene (game over screen)
- [ ] SettingsScene
- [ ] Power-up system implementation
- [ ] UI components (Button, StarDisplay, ThemeCard)

### 📋 TODO (Phase 4-7)
- [ ] Theme manager
- [ ] AdMob integration
- [ ] Sound manager
- [ ] Haptic feedback
- [ ] Mobile optimization
- [ ] PWA configuration
- [ ] Asset generation (AI)
- [ ] Testing
- [ ] Deployment

## 🎯 Next Steps

1. Test the game at http://localhost:3000
2. Generate AI assets (sprites, icons)
3. Implement power-up system
4. Add ResultScene
5. Mobile build and testing

## 📱 Mobile Features

### PWA Support
- ✅ Service Worker with offline caching
- ✅ Install prompt (Add to Home Screen)
- ✅ Standalone app mode
- ✅ Manifest with icons and shortcuts

### Mobile Optimizations
- ✅ Safe area support (notched devices)
- ✅ Touch action optimizations
- ✅ GPU acceleration
- ✅ Prevent pull-to-refresh
- ✅ No text selection/tap highlight
- ✅ 60 FPS target

### Performance
- Vite HMR: ~200ms reload
- Object pooling: Max 20 obstacles
- WebGL rendering with Canvas fallback
- Optimized asset loading

## 📝 License

ISC
