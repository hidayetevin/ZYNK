# Onboarding & Tutorial Sistemi

## 🎯 Amaç

İlk kez oyunu açan kullanıcılar için **kolay, hızlı ve eğlenceli** bir giriş deneyimi sağlamak. Kullanıcıyı 30 saniye içinde oyuna adapte etmek ve retention oranını artırmak.

---

## 📱 Onboarding Akışı

### İlk Açılış (First Time User Experience - FTUE)

```
App Launch
  ↓
Splash Screen (1.5s)
  ↓
Welcome Screen (5s)
  ↓
Tutorial Overlay (30s)
  ↓
First Game (Easy Mode)
  ↓
Result + Encouragement
  ↓
Main Menu
```

---

## 🎨 Welcome Screen

İlk açılışta gösterilecek basit karşılama ekranı.

### UI Tasarım

```
┌─────────────────────────────────────┐
│                                     │
│        🎮 DODGE GAME 🎮            │
│                                     │
│     [Animated Game Icon]            │
│                                     │
│   Swipe to survive!                 │
│   How long can you last?            │
│                                     │
│                                     │
│       [START TUTORIAL] ────┐        │
│                            │        │
│       [SKIP]               │        │
│                            │        │
└────────────────────────────┼────────┘
                             │
                    Bold, inviting button
```

### Animasyonlar
- Icon: Pulse effect (scale 1.0 → 1.05 → 1.0)
- Text: Fade in from top
- Buttons: Slide up from bottom

### Uygulama

```typescript
// src/scenes/WelcomeScene.ts
export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Welcome' });
  }

  create(): void {
    const { width, height } = this.scale;
    
    // Background gradient
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    gradient.fillRect(0, 0, width, height);
    
    // Game icon (animated)
    const icon = this.add.text(width / 2, height * 0.3, '🎮', {
      fontSize: '80px'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: icon,
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Title
    const title = this.add.text(width / 2, height * 0.45, 'DODGE GAME', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#00ff88',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
    
    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });
    
    // Subtitle
    const subtitle = this.add.text(width / 2, height * 0.55, 
      'Swipe to survive!\nHow long can you last?', {
      fontSize: '20px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);
    
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 800,
      delay: 400,
      ease: 'Power2'
    });
    
    // Start Tutorial Button
    const startBtn = this.createButton(
      width / 2,
      height * 0.75,
      'START TUTORIAL',
      () => this.startTutorial()
    );
    
    // Skip Button
    const skipBtn = this.createButton(
      width / 2,
      height * 0.85,
      'SKIP',
      () => this.skipTutorial(),
      '#666666'
    );
    
    // Check if returning user
    if (!StorageManager.getInstance().isFirstTime()) {
      this.scene.start('Menu');
    }
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    color: string = '#00ff88'
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 250, 55, 0x000000, 0.5);
    bg.setStrokeStyle(2, color);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: color
    }).setOrigin(0.5);
    
    container.add([bg, label]);
    container.setSize(250, 55);
    container.setInteractive({ useHandCursor: true });
    
    container.on('pointerdown', () => {
      HapticManager.getInstance().light();
      SoundManager.getInstance().play('click');
      this.tweens.add({
        targets: container,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: onClick
      });
    });
    
    // Slide up animation
    container.setY(y + 50).setAlpha(0);
    this.tweens.add({
      targets: container,
      y: y,
      alpha: 1,
      duration: 600,
      delay: 600,
      ease: 'Back.easeOut'
    });
    
    return container;
  }

  private startTutorial(): void {
    this.scene.start('Tutorial');
  }

  private skipTutorial(): void {
    StorageManager.getInstance().setFirstTime(false);
    this.scene.start('Menu');
  }
}
```

---

## 🎓 Tutorial Scene

İnteraktif tutorial overlay ile oyunu öğretme.

### Tutorial Adımları

#### Step 1: Movement
```
┌─────────────────────────────────┐
│                                 │
│     ← Swipe to move →          │
│                                 │
│         [Player]   ───┐         │
│                       │         │
│     👆 Try it!        │         │
│                       │         │
└───────────────────────┼─────────┘
                        │
              Animated hand gesture
```

#### Step 2: Avoid Obstacles
```
┌─────────────────────────────────┐
│      ⬇️  ⬇️  ⬇️               │
│                                 │
│   Avoid falling objects!        │
│                                 │
│         [Player]                │
│                                 │
└─────────────────────────────────┘
```

#### Step 3: Power-Ups
```
┌─────────────────────────────────┐
│         ⭐                      │
│                                 │
│  Collect power-ups for help!    │
│                                 │
│         [Player]                │
│                                 │
└─────────────────────────────────┘
```

#### Step 4: Survive
```
┌─────────────────────────────────┐
│   Time: 0:00      ⭐⭐⭐        │
│                                 │
│   Survive as long as you can!   │
│   Earn stars for rewards!       │
│                                 │
│         [Player]                │
│                                 │
│      [START GAME!]              │
└─────────────────────────────────┘
```

### Implementation

```typescript
// src/scenes/TutorialScene.ts
export default class TutorialScene extends Phaser.Scene {
  private currentStep = 0;
  private steps = [
    this.showMovementStep,
    this.showObstacleStep,
    this.showPowerUpStep,
    this.showSurviveStep
  ];
  
  private overlay!: Phaser.GameObjects.Container;
  private player!: Player;

  constructor() {
    super({ key: 'Tutorial' });
  }

  create(): void {
    // Create game background
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x1a1a2e
    );
    
    // Create player
    this.player = new Player(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
      'player'
    );
    
    // Start first step
    this.showStep();
  }

  private showStep(): void {
    // Remove previous overlay
    if (this.overlay) {
      this.overlay.destroy();
    }
    
    // Show current step
    if (this.currentStep < this.steps.length) {
      this.steps[this.currentStep].call(this);
    } else {
      // Tutorial complete
      this.completeTutorial();
    }
  }

  private showMovementStep(): void {
    const { width, height } = this.scale;
    
    this.overlay = this.add.container(0, 0);
    
    // Dim background
    const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    
    // Instruction text
    const text = this.add.text(width / 2, height * 0.2, '← Swipe to move →', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);
    
    // Animated hand gesture
    const hand = this.add.text(width / 2, height * 0.5, '👆', {
      fontSize: '64px'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: hand,
      x: width * 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Try it text
    const tryIt = this.add.text(width / 2, height * 0.65, 'Try it!', {
      fontSize: '24px',
      color: '#00ff88'
    }).setOrigin(0.5);
    
    this.overlay.add([dim, text, hand, tryIt]);
    
    // Detect player movement
    let moved = false;
    const initialX = this.player.x;
    
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (Math.abs(this.player.x - initialX) > 50 && !moved) {
          moved = true;
          HapticManager.getInstance().medium();
          
          // Show success feedback
          const success = this.add.text(width / 2, height * 0.4, '✓ Great!', {
            fontSize: '36px',
            color: '#00ff88'
          }).setOrigin(0.5).setAlpha(0);
          
          this.tweens.add({
            targets: success,
            alpha: 1,
            y: height * 0.35,
            duration: 500,
            onComplete: () => {
              this.time.delayedCall(1000, () => {
                this.currentStep++;
                this.showStep();
              });
            }
          });
        }
      }
    });
  }

  private showObstacleStep(): void {
    const { width, height } = this.scale;
    
    this.overlay = this.add.container(0, 0);
    
    const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    
    const text = this.add.text(width / 2, height * 0.2, 'Avoid falling objects!', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);
    
    this.overlay.add([dim, text]);
    
    // Spawn demo obstacles
    for (let i = 0; i < 3; i++) {
      const obstacle = this.add.rectangle(
        width * (0.25 + i * 0.25),
        -50,
        40,
        40,
        0xff0055
      );
      
      this.tweens.add({
        targets: obstacle,
        y: height * 0.4,
        duration: 2000,
        delay: i * 500,
        ease: 'Linear'
      });
    }
    
    // Next step after 3 seconds
    this.time.delayedCall(3500, () => {
      this.currentStep++;
      this.showStep();
    });
  }

  private showPowerUpStep(): void {
    const { width, height } = this.scale;
    
    this.overlay = this.add.container(0, 0);
    
    const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    
    const text = this.add.text(width / 2, height * 0.2, 'Collect power-ups!', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);
    
    // Show power-up icons
    const powerups = [
      { icon: '🛡️', name: 'Shield' },
      { icon: '⏱️', name: 'Slow Motion' },
      { icon: '⭐', name: 'Double Score' }
    ];
    
    powerups.forEach((pu, i) => {
      const icon = this.add.text(
        width / 2,
        height * (0.4 + i * 0.1),
        `${pu.icon} ${pu.name}`,
        { fontSize: '24px', color: '#ffffff' }
      ).setOrigin(0.5).setAlpha(0);
      
      this.tweens.add({
        targets: icon,
        alpha: 1,
        duration: 500,
        delay: i * 300
      });
      
      this.overlay.add(icon);
    });
    
    this.overlay.add([dim, text]);
    
    this.time.delayedCall(4000, () => {
      this.currentStep++;
      this.showStep();
    });
  }

  private showSurviveStep(): void {
    const { width, height } = this.scale;
    
    this.overlay = this.add.container(0, 0);
    
    const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    
    const text = this.add.text(
      width / 2,
      height * 0.3,
      'Survive as long as you can!\nEarn stars for rewards!',
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Arial Black',
        align: 'center'
      }
    ).setOrigin(0.5);
    
    // Stars display
    const stars = this.add.text(width / 2, height * 0.5, '⭐⭐⭐', {
      fontSize: '48px'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: stars,
      scale: { from: 1, to: 1.2 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });
    
    // Start button
    const startBtn = this.createButton(
      width / 2,
      height * 0.7,
      'START GAME!',
      () => this.completeTutorial()
    );
    
    this.overlay.add([dim, text, stars, startBtn]);
  }

  private createButton(x: number, y: number, text: string, onClick: () => void) {
    const container = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 250, 60, 0x00ff88);
    const label = this.add.text(0, 0, text, {
      fontSize: '24px',
      fontFamily: 'Arial Black',
      color: '#000000'
    }).setOrigin(0.5);
    
    container.add([bg, label]);
    container.setSize(250, 60);
    container.setInteractive({ useHandCursor: true });
    
    container.on('pointerdown', () => {
      HapticManager.getInstance().medium();
      SoundManager.getInstance().play('click');
      this.tweens.add({
        targets: container,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: onClick
      });
    });
    
    return container;
  }

  private completeTutorial(): void {
    StorageManager.getInstance().setFirstTime(false);
    StorageManager.getInstance().setTutorialCompleted(true);
    
    // Start first game with easy mode
    this.scene.start('Game', { 
      theme: ThemeManager.getInstance().getDefaultTheme(),
      isFirstGame: true 
    });
  }
}
```

---

## 🎮 İlk Oyun (Easy Mode)

Tutorial sonrası ilk oyun **daha kolay** olacak:

```typescript
// GameScene.ts
init(data: GameSceneData): void {
  if (data.isFirstGame) {
    // First game is easier
    this.difficultyMultiplier = 0.6; // %40 daha kolay
    this.showEncouragement = true;
  }
}
```

### Encouragement Messages

Oyun sırasında motive edici mesajlar:

```typescript
private showEncouragement(time: number): void {
  const messages = [
    { time: 5, text: 'Great start! Keep going!' },
    { time: 10, text: 'You got this! 🔥' },
    { time: 15, text: 'Amazing! Almost 1 star!' },
    { time: 20, text: 'Fantastic! 1 star earned! ⭐' }
  ];
  
  const msg = messages.find(m => m.time === Math.floor(time));
  if (msg) {
    this.showFloatingText(msg.text);
  }
}
```

---

## ✅ Onboarding Completion Tracking

```typescript
// StorageManager.ts
interface OnboardingData {
  isFirstTime: boolean;
  tutorialCompleted: boolean;
  firstGameCompleted: boolean;
  firstThemeUnlocked: boolean;
  rewardedAdWatched: boolean;
}

setOnboardingStep(step: keyof OnboardingData, value: boolean): void {
  const data = this.getOnboardingData();
  data[step] = value;
  localStorage.setItem('onboarding', JSON.stringify(data));
}
```

---

## 📊 Metrics

Track edilecek onboarding metrikleri:

- **Tutorial Start Rate**: Kaç kişi tutorial'ı başlatıyor?
- **Tutorial Completion Rate**: Kaç kişi bitiriyor?
- **Time to First Game**: Tutorial'dan ilk oyuna kadar süre
- **First Game Retention**: İlk oyun sonrası retention

---

Bu onboarding sistemi ile yeni kullanıcılar hızlıca oyunu öğrenip eğlenmeye başlayabilir! 🎓
