# DODGE GAME - Uçtan Uca AI ile Geliştirme Kılavuzu

## 📋 İçindekiler
1. [Proje Özeti](#proje-özeti)
2. [Teknik Stack](#teknik-stack)
3. [Proje Yapısı](#proje-yapısı)
4. [Geliştirme Adımları](#geliştirme-adımları)
5. [AI Promptları](#ai-promptları)
6. [Deployment](#deployment)

---

## 🎮 Proje Özeti

### Oyun Konsepti
- **Tür**: Casual Arcade Dodge Game  
- **Platform**: iOS, Android, Web, PWA
- **Oyun Süresi**: 30-60 saniye/oyun
- **Kontrol**: Her yöne hareket (360° swipe/touch control)
- **Grafik**: AI-generated assets (Gemini ile üretilecek)
- **Monetization**: AdMob reklamları (banner sürekli, interstitial her oyun, rewarded için devam)
- **Hedef**: Play Store + App Store + Web yayını

### Oyun Döngüsü
```
Uygulama Açılış → Menü → Oyun → Game Over → Yıldız Hesaplama → Reklam → Menü
```

### Yıldız Sistemi
- **1 Yıldız**: 10-20 saniye hayatta kalma
- **2 Yıldız**: 20-40 saniye hayatta kalma
- **3 Yıldız**: 40+ saniye hayatta kalma
- Yıldızlar yeni temaların kilidini açar

### Zorluk Algoritması
```typescript
spawnDelay = Math.max(300, 1500 - time * 10)
obstacleSpeed = baseSpeed + time * 2
obstacleDirection = random(0, 360) // Farklı yönlerden gelebilir
```

### Power-Up Sistemi (Phase 1)
- **Shield**: Bir darbe koruma
- **Slow Motion**: Zamanı %50 yavaşlatma (5 saniye)
- **Double Score**: Çift puan kazanma (10 saniye)
- Power-up spawn oranı: Her 15 saniyede bir

---

## 🛠 Teknik Stack

### Framework & Runtime
- **Phaser.js v3.80+**: 2D oyun motoru
  - Canvas + WebGL rendering
  - Scene management
  - Tween animation system
  - Asset loader
  
- **Capacitor v5+**: Native wrapper (TAVSİYE EDİLEN)
  - iOS + Android bridge
  - Web compatibility
  - Plugin ecosystem
  - Live reload support
  - **Neden Cordova değil?**: Modern, daha hızlı, Vite uyumlu

### Programlama & Build
- **TypeScript v5.0+**: Strict mode
  - Type safety
  - Modern ES features
  - Path aliases
  
- **Vite v5.0+**: Build tool
  - Fast HMR
  - Optimized builds
  - ES modules
  - PWA plugin support

### Kod Kalitesi
- **ESLint**: TypeScript linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing (AI ile test case üretimi)

### Storage & State
- **LocalStorage**: 
  - Yıldız verileri
  - Tema kilit durumları
  - Ayarlar (ses, titreşim)
  - High score

### Plugins (Capacitor)
- **@capacitor/admob**: Reklam entegrasyonu
- **@capacitor/haptics**: Titreşim feedback
- **@capacitor/status-bar**: Status bar kontrolü
- **@capacitor/splash-screen**: Açılış ekranı

### PWA Features
- **Service Worker**: Offline support
- **Web Manifest**: Install prompt
- **Cache API**: Asset caching

---

## 📁 Proje Yapısı

```
dodge-game/
├── src/
│   ├── main.ts                    # Entry point
│   ├── config/
│   │   ├── GameConfig.ts          # Phaser config
│   │   ├── AdConfig.ts            # AdMob IDs (test/prod)
│   │   └── Constants.ts           # Game constants
│   │
│   ├── scenes/
│   │   ├── BootScene.ts           # Asset loading
│   │   ├── MenuScene.ts           # Ana menü
│   │   ├── GameScene.ts           # Oyun sahnesi
│   │   ├── ResultScene.ts         # Sonuç ekranı
│   │   └── SettingsScene.ts       # Ayarlar
│   │
│   ├── systems/
│   │   ├── PlayerController.ts    # Oyuncu kontrolü
│   │   ├── ObstacleSpawner.ts     # Engel üretimi
│   │   ├── DifficultyManager.ts   # Zorluk yönetimi
│   │   ├── StarManager.ts         # Yıldız hesaplama
│   │   ├── ThemeManager.ts        # Tema sistemi
│   │   ├── AdManager.ts           # Reklam yönetimi
│   │   ├── SoundManager.ts        # Ses yönetimi
│   │   ├── HapticManager.ts       # Titreşim
│   │   └── StorageManager.ts      # LocalStorage wrapper
│   │
│   ├── entities/
│   │   ├── Player.ts              # Oyuncu entity
│   │   └── Obstacle.ts            # Engel entity
│   │
│   ├── ui/
│   │   ├── Button.ts              # Custom button component
│   │   ├── StarDisplay.ts         # Yıldız gösterimi
│   │   └── ThemeCard.ts           # Tema seçim kartı
│   │
│   ├── types/
│   │   ├── GameTypes.ts           # Type definitions
│   │   └── SceneData.ts           # Scene data interfaces
│   │
│   └── assets/
│       ├── images/                # Sprite'lar
│       ├── sounds/                # Ses efektleri
│       └── fonts/                 # Custom fontlar
│
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── icon-192.png               # PWA icon
│   ├── icon-512.png               # PWA icon
│   └── robots.txt
│
├── android/                       # Capacitor Android
├── ios/                           # Capacitor iOS
│
├── tests/
│   └── unit/                      # Vitest testleri
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions
│
├── capacitor.config.ts            # Capacitor config
├── vite.config.ts                 # Vite config
├── tsconfig.json                  # TypeScript config
├── package.json
└── README.md
```

---

## 🚀 Geliştirme Adımları

### PHASE 1: Proje Setup (1-2 saat)
### PHASE 2: Core Game Loop (3-4 saat)
### PHASE 3: UI/UX Implementation (2-3 saat)
### PHASE 4: Systems Integration (2-3 saat)
### PHASE 5: Mobile Optimization (2-3 saat)
### PHASE 6: Testing & Polish (2-3 saat)
### PHASE 7: Deployment (2-3 saat)

**Toplam Tahmini Süre**: 14-21 saat

---

## 🤖 AI Promptları

Aşağıdaki promptlar sırayla kullanılarak oyun geliştirilecektir.

---

## PHASE 1: Proje Setup

### PROMPT 1.1: Proje İnit
```
Create a new Vite + TypeScript + Phaser.js project with the following requirements:

1. Initialize a Vite project with TypeScript template
2. Install dependencies:
   - phaser@^3.80.0
   - typescript@^5.0.0
   - vite@^5.0.0
   - @capacitor/core@^5.0.0
   - @capacitor/cli@^5.0.0

3. Configure vite.config.ts:
   - Base path: './'
   - Build target: ES2020
   - Output dir: 'dist'
   - Asset handling for Phaser

4. Configure tsconfig.json:
   - Strict mode: true
   - Target: ES2020
   - Path aliases:
     - @/* -> ./src/*
     - @scenes/* -> ./src/scenes/*
     - @systems/* -> ./src/systems/*
     - @entities/* -> ./src/entities/*
     - @ui/* -> ./src/ui/*
     - @config/* -> ./src/config/*

5. Create the folder structure as shown in the project structure above

6. Add scripts to package.json:
   - dev: vite
   - build: tsc && vite build
   - preview: vite preview
   - test: vitest

Provide all configuration files and package.json.
```

### PROMPT 1.2: Capacitor Setup
```
Set up Capacitor for iOS and Android with the following:

1. Initialize Capacitor:
   - App name: "Dodge Game"
   - App ID: "com.yourstudio.dodgegame"
   - Web dir: "dist"

2. Install Capacitor plugins:
   - @capacitor/admob@^5.0.0
   - @capacitor/haptics@^5.0.0
   - @capacitor/status-bar@^5.0.0
   - @capacitor/splash-screen@^5.0.0

3. Configure capacitor.config.ts:
   - Set server URL for dev mode
   - Configure iOS settings (minimum iOS 13)
   - Configure Android settings (minimum SDK 22)
   - Enable live reload

4. Add platform-specific configurations

Provide the complete capacitor.config.ts file.
```

### PROMPT 1.3: ESLint + Prettier Setup
```
Configure ESLint and Prettier for TypeScript with strict rules:

1. Install dependencies:
   - eslint
   - @typescript-eslint/parser
   - @typescript-eslint/eslint-plugin
   - eslint-config-prettier
   - prettier

2. Create .eslintrc.json with:
   - TypeScript parser
   - Recommended rules
   - Complexity limit: 10
   - Max line length: 100
   - No console.log in production

3. Create .prettierrc with:
   - Single quotes
   - 2 spaces indent
   - Trailing comma: es5
   - Print width: 100

4. Add lint scripts to package.json

Provide both config files.
```

---

## PHASE 2: Core Game Loop

### PROMPT 2.1: Game Config & Constants
```
Create the game configuration and constants files:

FILE: src/config/GameConfig.ts
- Export Phaser.Types.Core.GameConfig
- Type: Phaser.AUTO
- Canvas size: 375x667 (mobile portrait)
- Parent: 'game-container'
- Scale mode: FIT
- Background color: #1a1a2e (dark mode default)
- Physics: Arcade physics with debug: false
- Scenes: [BootScene, MenuScene, GameScene, ResultScene, SettingsScene]

FILE: src/config/Constants.ts
- GAME_WIDTH = 375
- GAME_HEIGHT = 667
- PLAYER_SPEED = 300
- BASE_OBSTACLE_SPEED = 200
- MIN_SPAWN_DELAY = 300
- MAX_SPAWN_DELAY = 1500
- STAR_THRESHOLDS = { ONE_STAR: 10, TWO_STAR: 20, THREE_STAR: 40 }
- THEME_UNLOCK_COSTS = [0, 5, 10, 15, 20] // stars needed
- Colors for light/dark mode

FILE: src/config/AdConfig.ts
- Export AdConfig with test/production AdMob IDs
- Banner ID (test: ca-app-pub-3940256099942544/6300978111)
- Interstitial ID (test: ca-app-pub-3940256099942544/1033173712)
- USE_TEST_ADS = true (to be changed manually for production)

Provide all three files with proper TypeScript types.
```

### PROMPT 2.2: TypeScript Types
```
Create comprehensive TypeScript types:

FILE: src/types/GameTypes.ts
- Interface: GameData { highScore, totalStars, unlockedThemes, currentTheme, settings }
- Interface: Settings { soundEnabled, hapticEnabled, darkMode }
- Interface: Theme { id, name, colors, unlocked }
- Type: SceneKey = 'Boot' | 'Menu' | 'Game' | 'Result' | 'Settings'
- Enum: GameState { MENU, PLAYING, PAUSED, GAME_OVER }

FILE: src/types/SceneData.ts
- Interface: GameSceneData { theme: Theme }
- Interface: ResultSceneData { score, stars, isNewHighScore }

Provide both files with complete type definitions.
```

### PROMPT 2.3: Storage Manager
```
Create a LocalStorage wrapper with type safety:

FILE: src/systems/StorageManager.ts

Requirements:
1. Singleton pattern
2. Methods:
   - saveGameData(data: GameData): void
   - loadGameData(): GameData
   - resetGameData(): void
   - getHighScore(): number
   - getTotalStars(): number
3. Default data structure
4. Error handling
5. JSON serialization/deserialization
6. TypeScript strict mode compliance

Include comprehensive JSDoc comments.
```

### PROMPT 2.4: Player Entity
```
Create the player character controller:

FILE: src/entities/Player.ts

Requirements:
1. Extend Phaser.GameObjects.Sprite
2. Constructor: (scene, x, y, texture)
3. Methods:
   - move(directionX: number, directionY: number): void  // 360° movement
   - setVelocity(vx: number, vy: number): void
   - stop(): void
   - reset(): void
   - activateShield(): void  // Power-up: Shield
4. Physics body setup (Arcade)
5. Collision bounds (circular hitbox for better feel)
6. Movement smoothing with velocity
7. Screen boundary clamping (all 4 edges)
8. Animation ready (for future sprites)
9. Shield visual indicator when active

Player can move in ANY direction (not just left/right).
Use TypeScript class with proper typing.
```

### PROMPT 2.5: Obstacle Entity
```
Create the obstacle object:

FILE: src/entities/Obstacle.ts

Requirements:
1. Extend Phaser.GameObjects.Sprite (AI-generated sprites will be used)
2. Constructor: (scene, x, y, speed, direction, obstacleType)
3. Properties:
   - speed: number
   - direction: number (angle in degrees, 0-360)
   - active: boolean
   - obstacleType: 'meteor' | 'spike' | 'electric' (different visuals)
4. Methods:
   - update(delta: number): void  // Move in specified direction
   - reset(x, y, speed, direction, type): void
   - destroy(): void
5. Arcade physics body
6. Auto-destroy when off-screen (any edge)
7. Object pooling ready
8. Support for multi-directional movement (not just falling)

Obstacles can come from ANY direction (top, bottom, left, right, diagonals).
TypeScript class with proper types.
```

### PROMPT 2.6: BootScene
```
Create the asset loading scene:

FILE: src/scenes/BootScene.ts

Requirements:
1. Extend Phaser.Scene
2. Key: 'Boot'
3. Preload:
   - Load placeholder graphics (colored rectangles for now)
   - Load web fonts if needed
   - Show loading bar
4. Create:
   - Initialize StorageManager
   - Start MenuScene
5. Simple loading UI:
   - Progress bar
   - Percentage text
   - "Loading..." text

Keep it minimal and functional.
```

### PROMPT 2.7: GameScene - Part 1 (Setup)
```
Create the main game scene - Part 1 (Setup and Initialization):

FILE: src/scenes/GameScene.ts

Requirements for this part:
1. Extend Phaser.Scene
2. Key: 'Game'
3. Private properties:
   - player: Player
   - obstacles: Phaser.GameObjects.Group
   - cursors: Phaser.Types.Input.Keyboard.CursorKeys
   - gameTime: number
   - isGameOver: boolean
   - score: number
   - theme: Theme
4. Constructor and init method:
   - Receive theme data from MenuScene
5. Create method:
   - Set background color based on theme
   - Create player at bottom center
   - Create obstacles group with object pooling
   - Setup keyboard input
   - Setup touch input (handle both touch and mouse)
   - Create UI (score text, time text)
   - Start game timer

Do NOT include game loop logic yet. Focus on setup.
Provide the class structure and create method.
```

### PROMPT 2.8: GameScene - Part 2 (Game Loop)
```
Continue GameScene - Part 2 (Game Loop and Collision):

Add to: src/scenes/GameScene.ts

Requirements:
1. Update method:
   - Update game time
   - Handle player input (keyboard + touch)
   - Update all obstacles
   - Check player boundaries
   - Update UI texts
   - Check collision
2. Handle player movement:
   - Left/right keyboard arrows
   - Touch/click drag on screen
   - Smooth acceleration
3. Collision detection:
   - Player vs obstacles
   - Call gameOver() on collision
4. GameOver method:
   - Stop player
   - Calculate stars based on time survived
   - Check if new high score
   - Show interstitial ad
   - Transition to ResultScene with data

Provide the update method and helper methods.
```

---

## PHASE 3: UI/UX Implementation

### PROMPT 3.1: MenuScene
```
Create the main menu scene:

FILE: src/scenes/MenuScene.ts

Requirements:
1. Extend Phaser.Scene
2. Key: 'Menu'
3. UI Elements:
   - Game title (large text)
   - "PLAY" button (center)
   - High score display (top right)
   - Total stars display (top left)
   - Settings button (top right corner)
   - Theme selector (bottom, horizontal scroll)
4. Methods:
   - create(): Setup UI
   - startGame(): Launch GameScene with selected theme
   - openSettings(): Launch SettingsScene
5. Theme preview:
   - Show 3-5 theme cards
   - Locked themes show star cost
   - Current theme highlighted
6. Responsive layout for mobile
7. Add banner ad at bottom (AdManager integration)

Use modern, clean UI design. Include touch-friendly button sizes (min 44x44px).
```

### PROMPT 3.2: ResultScene
```
Create the game over / result screen:

FILE: src/scenes/ResultScene.ts

Requirements:
1. Extend Phaser.Scene
2. Key: 'Result'
3. Receive data: { score, stars, isNewHighScore }
4. UI Elements:
   - "GAME OVER" title
   - Time survived display (large)
   - Stars earned (animated stars, 1-3)
   - High score indicator (if new record)
   - "PLAY AGAIN" button
   - "MENU" button
   - Total stars collected display
5. Star animation:
   - Fade in stars one by one
   - Scale tween effect
   - Haptic feedback on each star
6. Methods:
   - playAgain(): Restart GameScene
   - backToMenu(): Return to MenuScene
7. Show interstitial ad before scene (via AdManager)

Celebratory feel for new high scores. Clean, centered layout.
```

### PROMPT 3.3: SettingsScene
```
Create the settings screen:

FILE: src/scenes/SettingsScene.ts

Requirements:
1. Extend Phaser.Scene
2. Key: 'Settings'
3. UI Elements:
   - "SETTINGS" title
   - Sound toggle (ON/OFF)
   - Haptic toggle (ON/OFF)
   - Dark mode toggle (ON/OFF)
   - "RESET PROGRESS" button (with confirmation)
   - "BACK" button
4. Methods:
   - toggleSound(): Update StorageManager
   - toggleHaptic(): Update StorageManager
   - toggleDarkMode(): Update theme and StorageManager
   - resetProgress(): Clear all data (with native confirm dialog)
   - back(): Return to MenuScene
5. Visual feedback:
   - Highlight active toggles
   - Haptic feedback on toggle
   - Color change on dark mode toggle
6. Use custom toggle switches (not native inputs)

Clean, accessibility-friendly design.
```

### PROMPT 3.4: Custom UI Components
```
Create reusable UI components:

FILE: src/ui/Button.ts
- Extend Phaser.GameObjects.Container
- Constructor: (scene, x, y, text, onClick, color?)
- Properties: background (RoundedRectangle), text (Text)
- Methods: setInteractive(), onPointerDown(), onPointerUp(), onPointerOver()
- Touch-friendly size (min 44x44px)
- Haptic feedback on click
- Scale animation on press

FILE: src/ui/StarDisplay.ts
- Show 1-3 stars with fill/empty states
- Animated reveal
- Constructor: (scene, x, y, stars: number)
- Method: animateStars(onComplete?)

FILE: src/ui/ThemeCard.ts
- Show theme preview
- Lock icon if not unlocked
- Star cost display
- Selected state highlight
- Constructor: (scene, x, y, theme: Theme, isSelected: boolean, onSelect)

Provide all three components with TypeScript types and Phaser best practices.
```

---

## PHASE 4: Systems Integration

### PROMPT 4.1: Obstacle Spawner
```
Create the obstacle spawning system:

FILE: src/systems/ObstacleSpawner.ts

Requirements:
1. Class with singleton pattern
2. Properties:
   - scene: Phaser.Scene
   - obstacles: Phaser.GameObjects.Group
   - spawnTimer: number
   - nextSpawnDelay: number
3. Methods:
   - init(scene, obstaclesGroup): void
   - update(delta, gameTime): void
   - spawn(): void
   - calculateSpawnDelay(gameTime): number
   - reset(): void
4. Spawn logic:
   - Random X position (within screen bounds)
   - Y position just above screen
   - Speed increases with game time
   - Delay decreases with game time (formula from design doc)
5. Object pooling:
   - Reuse inactive obstacles
   - Maximum 20 active obstacles
6. Difficulty curve implementation

Use the formula: spawnDelay = max(300, 1500 - time * 10)
```

### PROMPT 4.2: Difficulty Manager
```
Create dynamic difficulty system:

FILE: src/systems/DifficultyManager.ts

Requirements:
1. Singleton class
2. Methods:
   - getObstacleSpeed(baseSpeed, gameTime): number
   - getSpawnDelay(gameTime): number
   - getDifficultyMultiplier(gameTime): number
3. Difficulty curve:
   - First 10 seconds: Easy (slow, infrequent)
   - 10-30 seconds: Medium (gradual increase)
   - 30+ seconds: Hard (fast, frequent)
4. Formulas:
   - speed = BASE_SPEED + gameTime * 2
   - spawnDelay = max(MIN_DELAY, MAX_DELAY - gameTime * 10)
5. Cap maximum difficulty at 60 seconds
6. Export constants for tuning

Keep it simple and tweakable.
```

### PROMPT 4.3: Star Manager
```
Create star calculation and management:

FILE: src/systems/StarManager.ts

Requirements:
1. Static utility class
2. Methods:
   - calculateStars(timeSeconds: number): number
   - addStars(amount: number): void
   - getTotalStars(): number
   - canUnlockTheme(themeCost: number): boolean
   - unlockTheme(themeId: string): boolean
3. Star thresholds:
   - 10-20s = 1 star
   - 20-40s = 2 stars
   - 40+s = 3 stars
4. Integration with StorageManager
5. Validation and error handling

Include detailed comments explaining the star economy.
```

### PROMPT 4.4: Theme Manager
```
Create theme system and data:

FILE: src/systems/ThemeManager.ts

Requirements:
1. Singleton class
2. Default themes (5 themes):
   - Theme 1: "Classic" (unlocked by default)
     - Colors: { bg: '#1a1a2e', player: '#00ff88', obstacle: '#ff0055' }
   - Theme 2: "Ocean" (costs 5 stars)
     - Colors: { bg: '#0a1929', player: '#4fc3f7', obstacle: '#f06292' }
   - Theme 3: "Sunset" (costs 10 stars)
     - Colors: { bg: '#1a0a29', player: '#ffb74d', obstacle: '#ba68c8' }
   - Theme 4: "Forest" (costs 15 stars)
     - Colors: { bg: '#0d1f0d', player: '#66bb6a', obstacle: '#ef5350' }
   - Theme 5: "Neon" (costs 20 stars)
     - Colors: { bg: '#0a0a0a', player: '#00ffff', obstacle: '#ff00ff' }
3. Methods:
   - getAllThemes(): Theme[]
   - getTheme(id): Theme
   - getCurrentTheme(): Theme
   - setCurrentTheme(id): void
   - isThemeUnlocked(id): boolean
   - unlockTheme(id): boolean
4. Light/dark mode variants for each theme
5. Integration with StorageManager

Each theme should have distinct visual identity.
```

### PROMPT 4.5: AdManager
```
Create AdMob integration wrapper:

FILE: src/systems/AdManager.ts

Requirements:
1. Singleton class
2. Capacitor AdMob integration
3. Properties:
   - isInitialized: boolean
   - bannerVisible: boolean
4. Methods:
   - init(): Promise<void>
   - showBanner(): Promise<void>
   - hideBanner(): Promise<void>
   - showInterstitial(): Promise<void>
   - preloadInterstitial(): Promise<void>
5. Platform detection:
   - Web: Show placeholder div (for testing)
   - iOS/Android: Use AdMob plugin
6. Error handling:
   - Graceful fallback if ads fail
   - Console warnings in dev mode
7. Ad configuration:
   - Use AdConfig.ts for IDs
   - Respect USE_TEST_ADS flag
8. Ad placement logic:
   - Banner: SÜREKLI visible (menu, settings, result - everywhere except gameplay)
   - Interstitial: HER OYUN sonrası (game over'da)
   - Rewarded: Canlar bittiğinde "Continue" seçeneği için
9. Rewarded ad logic:
   - showRewardedAd(onRewarded: () => void): Promise<void>
   - User watches ad → Game continues from where they died
   - Track rewarded ad impressions in analytics

Include detailed comments on test vs production setup.
```

### PROMPT 4.6: Sound Manager
```
Create audio system:

FILE: src/systems/SoundManager.ts

Requirements:
1. Singleton class
2. Sound effects:
   - 'click': UI button clicks
   - 'hit': Collision with obstacle
   - 'star': Star earned
   - 'theme_unlock': Theme unlocked
3. Methods:
   - init(scene: Phaser.Scene): void
   - play(soundKey: string, volume?: number): void
   - stop(soundKey: string): void
   - stopAll(): void
   - setMuted(muted: boolean): void
   - isMuted(): boolean
4. Volume control (0-1)
5. Integration with Settings
6. Web Audio API compatibility
7. Placeholder sounds for now (use simple tones):
   - Generate programmatically or use Phaser's built-in sound generators

No external sound files needed yet - use Phaser.Sound.HTML5AudioSound or beep tones.
```

### PROMPT 4.7: Haptic Manager
```
Create haptic feedback system:

FILE: src/systems/HapticManager.ts

Requirements:
1. Singleton class
2. Capacitor Haptics integration
3. Methods:
   - init(): Promise<void>
   - light(): void (for UI interactions)
   - medium(): void (for stars, achievements)
   - heavy(): void (for collisions, game over)
   - setEnabled(enabled: boolean): void
   - isEnabled(): boolean
4. Platform detection:
   - iOS/Android: Use Haptics plugin
   - Web: Fallback to Vibration API (if available)
5. Integration with Settings
6. Error handling for unsupported devices

Include fallback for browsers that don't support vibration.
```

---

## PHASE 5: Mobile Optimization

### PROMPT 5.1: Touch Controls Enhancement
```
Enhance touch controls in GameScene:

Update: src/scenes/GameScene.ts

Requirements:
1. Add swipe gesture detection:
   - Swipe left: Move player left
   - Swipe right: Move player right
   - Quick tap: Stop player
2. Visual touch feedback:
   - Show finger position indicator (optional)
   - Haptic feedback on swipe
3. Touch zones:
   - Left half of screen: Move left
   - Right half of screen: Move right
4. Prevent accidental touches:
   - Minimum swipe distance
   - Swipe velocity threshold
5. Multi-touch prevention
6. Smooth interpolation for touch movement

Ensure 60 FPS on mid-range devices. Use requestAnimationFrame best practices.
```

### PROMPT 5.2: Performance Optimization
```
Optimize game performance for mobile:

Update multiple files as needed.

Requirements:
1. Object pooling for obstacles:
   - Pre-create 20 obstacle objects
   - Reuse instead of create/destroy
2. Reduce draw calls:
   - Use texture atlas (future)
   - Batch rendering where possible
3. Memory management:
   - Clean up on scene shutdown
   - Remove event listeners
   - Destroy unused objects
4. Physics optimization:
   - Use simple collision (rectangle overlap)
   - Disable debug mode in production
5. FPS monitoring:
   - Add FPS counter (dev mode only)
   - Target 60 FPS on iPhone 8 / Galaxy S8 equivalent
6. Asset optimization:
   - Compress images (future)
   - Use WebP where supported

Add comments explaining each optimization.
```

### PROMPT 5.3: PWA Configuration
```
Set up Progressive Web App:

Create/update files:

FILE: public/manifest.json
- name: "Dodge Game"
- short_name: "Dodge"
- description: "Fast-paced arcade dodge game"
- start_url: "/"
- display: "standalone"
- orientation: "portrait"
- theme_color: "#1a1a2e"
- background_color: "#1a1a2e"
- icons: 192x192 and 512x512

FILE: src/registerServiceWorker.ts
- Service worker registration
- Cache strategy: Cache-first for assets
- Network-first for API calls (if any)
- Offline fallback page

Update: vite.config.ts
- Install vite-plugin-pwa
- Configure PWA plugin
- Generate service worker

Update: index.html
- Add manifest link
- Add theme-color meta tag
- Add apple-touch-icon

Provide all files and configuration.
```

### PROMPT 5.4: Safe Area Handling
```
Add safe area support for notched devices:

Create: src/utils/SafeArea.ts

Requirements:
1. Detect safe area insets (iOS notch, Android gesture bar)
2. Apply padding to UI elements:
   - Top: Status bar / notch
   - Bottom: Home indicator / gesture bar
3. Methods:
   - getSafeAreaInsets(): { top, right, bottom, left }
   - applySafeAreaPadding(element, side): void
4. CSS custom properties:
   - --safe-area-inset-top
   - --safe-area-inset-bottom
5. Capacitor StatusBar integration:
   - Transparent status bar
   - Light/dark content based on theme
6. Update scenes to use safe area:
   - MenuScene: Top/bottom padding
   - GameScene: Top padding for score
   - ResultScene: Bottom padding for buttons

iOS and Android compatibility.
```

---

## PHASE 6: Testing & Polish

### PROMPT 6.1: Unit Tests - Storage
```
Create unit tests for StorageManager:

FILE: tests/unit/StorageManager.test.ts

Requirements:
1. Use Vitest framework
2. Test cases:
   - Should save and load game data