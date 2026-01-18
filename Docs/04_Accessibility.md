# Accessibility (Erişilebilirlik) Özellikleri

## ♿ Genel Bakış

Dodge Game, **mümkün olduğunca çok kişinin** oyunu oynayabilmesini hedefler. Renk körlüğü, işitme/görme engeli ve motor becerileri kısıtlılığı olan kullanıcılar da düşünülmeli.

---

## 🎨 Renk Körlüğü Desteği

### Color-Blind Friendly Modes

3 ana renk körlüğü tipi desteklenecek:

1. **Protanopia** (Kırmızı körlüğü) - %1 erkek
2. **Deuteranopia** (Yeşil körlüğü) - %1 erkek  
3. **Tritanopia** (Mavi körlüğü) - %0.001

### Color Palette Adjustments

```typescript
// src/config/ColorBlindModes.ts
export enum ColorBlindMode {
  NONE = 'none',
  PROTANOPIA = 'protanopia',
  DEUTERANOPIA = 'deuteranopia',
  TRITANOPIA = 'tritanopia'
}

export const ColorBlindPalettes = {
  [ColorBlindMode.NONE]: {
    player: '#00ff88',      // Bright green
    obstacle: '#ff0055',    // Bright red
    powerup: '#ffdd00',     // Yellow
    background: '#1a1a2e'
  },
  
  [ColorBlindMode.PROTANOPIA]: {
    player: '#0088ff',      // Bright blue (kırmızı yerine)
    obstacle: '#ff8800',    // Orange (yeşil yerine)
    powerup: '#ffff00',     // Yellow
    background: '#1a1a2e'
  },
  
  [ColorBlindMode.DEUTERANOPIA]: {
    player: '#0088ff',      // Blue
    obstacle: '#dd00dd',    // Magenta
    powerup: '#ffff00',     // Yellow
    background: '#1a1a2e'
  },
  
  [ColorBlindMode.TRITANOPIA]: {
    player: '#ff4444',      // Red
    obstacle: '#00dddd',    // Cyan
    powerup: '#ff88ff',     // Pink
    background: '#1a1a2e'
  }
};
```

### Pattern Overlays (İsteğe Bağlı)

Sadece renk değil, **desenler** de ekleyerek ayırt edilebilirliği artır:

```typescript
// Obstacle patterns
const patterns = {
  obstacle: 'diagonal-stripes',    // ⋰⋰⋰
  player: 'solid',                 // █
  powerup: 'dots'                  // ⚫⚫
};
```

### Settings Implementation

```typescript
// SettingsScene.ts
private createColorBlindToggle(): void {
  const modes = [
    { key: ColorBlindMode.NONE, label: 'Normal' },
    { key: ColorBlindMode.PROTANOPIA, label: 'Protanopia' },
    { key: ColorBlindMode.DEUTERANOPIA, label: 'Deuteranopia' },
    { key: ColorBlindMode.TRITANOPIA, label: 'Tritanopia' }
  ];
  
  const currentMode = StorageManager.getInstance().getColorBlindMode();
  
  modes.forEach((mode, i) => {
    const btn = this.createToggleButton(
      this.scale.width / 2,
      200 + i * 60,
      mode.label,
      mode.key === currentMode,
      () => {
        StorageManager.getInstance().setColorBlindMode(mode.key);
        ThemeManager.getInstance().applyColorBlindMode(mode.key);
        this.scene.restart(); // Refresh UI
      }
    );
  });
}
```

---

## 🔊 Ses ve Görsel Feedback Alternatifleri

### Haptic Feedback'in Görsel Alternatifi

İşitme engelli veya sessiz modda oynayan kullanıcılar için:

```typescript
// HapticManager.ts
class HapticManager {
  light(): void {
    // Haptic
    if (this.isEnabled() && this.isHapticAvailable()) {
      Haptics.impact({ style: ImpactStyle.Light });
    }
    
    // Visual feedback (alternatif)
    if (StorageManager.getInstance().getVisualFeedbackEnabled()) {
      this.showVisualFeedback('light');
    }
  }
  
  private showVisualFeedback(intensity: 'light' | 'medium' | 'heavy'): void {
    const scene = this.getCurrentScene();
    if (!scene) return;
    
    const flash = scene.add.rectangle(
      scene.scale.width / 2,
      scene.scale.height / 2,
      scene.scale.width,
      scene.scale.height,
      0xffffff,
      intensity === 'light' ? 0.1 : intensity === 'medium' ? 0.2 : 0.3
    );
    
    scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });
  }
}
```

### Ses Efektlerinin Görsel Gösterimi

```typescript
// SoundManager.ts
class SoundManager {
  play(soundKey: string): void {
    if (this.isMuted()) {
      // Show visual indicator
      this.showSoundIndicator(soundKey);
    } else {
      this.sounds[soundKey]?.play();
    }
  }
  
  private showSoundIndicator(soundKey: string): void {
    const icons = {
      'click': '👆',
      'hit': '💥',
      'star': '⭐',
      'powerup': '🎁'
    };
    
    const scene = this.getCurrentScene();
    const icon = scene.add.text(
      scene.scale.width - 50,
      50,
      icons[soundKey] || '🔊',
      { fontSize: '32px' }
    ).setAlpha(0);
    
    scene.tweens.add({
      targets: icon,
      alpha: 1,
      scale: 1.5,
      duration: 300,
      yoyo: true,
      onComplete: () => icon.destroy()
    });
  }
}
```

---

## 📏 Font Size Ayarı

Görme zorluğu yaşayan kullanıcılar için:

```typescript
// Settings.ts
enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',    // Default
  LARGE = 'large',
  EXTRA_LARGE = 'xlarge'
}

const fontSizes = {
  [FontSize.SMALL]: 1.0,
  [FontSize.MEDIUM]: 1.2,
  [FontSize.LARGE]: 1.5,
  [FontSize.EXTRA_LARGE]: 2.0
};

// Kullanım
class UIText {
  createText(baseSize: number, text: string): Phaser.GameObjects.Text {
    const multiplier = fontSizes[StorageManager.getInstance().getFontSize()];
    return this.add.text(0, 0, text, {
      fontSize: `${baseSize * multiplier}px`
    });
  }
}
```

---

## 🎮 Motor Beceri Desteği

### Daha Kolay Kontroller

```typescript
// Accessibility mode'da oyuncu daha geniş dokunma alanı
class GameScene extends Phaser.Scene {
  setupTouchControls(): void {
    const isAccessibilityMode = StorageManager.getInstance().getAccessibilityMode();
    
    const touchZoneSize = isAccessibilityMode ? 150 : 100; // Daha büyük alan
    
    // Daha toleranslı swipe detection
    const minSwipeDistance = isAccessibilityMode ? 20 : 40;
    
    // Daha yavaş hareket (opsiyonel)
    if (isAccessibilityMode) {
      this.player.setSpeed(PLAYER_SPEED * 0.8);
    }
  }
}
```

### Auto-Aim (Opsiyonel)

Engelden kaçmayı kolaylaştıran hafif yardım:

```typescript
class PlayerController {
  update(): void {
    if (StorageManager.getInstance().getAutoAimEnabled()) {
      const nearestObstacle = this.findNearestObstacle();
      if (nearestObstacle && this.isInDanger(nearestObstacle)) {
        this.suggestSafeDirection(nearestObstacle);
      }
    }
  }
  
  private suggestSafeDirection(obstacle: Obstacle): void {
    // Subtle arrow indicator showing safe direction
    const safeX = obstacle.x < this.player.x ? 1 : -1;
    this.showDirectionHint(safeX);
  }
}
```

---

## ⏸️ Pause & Slow Motion

Oyunu duraklatma ve yavaşlatma seçeneği:

```typescript
// GameScene.ts
class GameScene extends Phaser.Scene {
  private isPaused = false;
  
  togglePause(): void {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.physics.pause();
      this.time.paused = true;
      this.showPauseOverlay();
    } else {
      this.physics.resume();
      this.time.paused = false;
      this.hidePauseOverlay();
    }
  }
  
  enableSlowMotion(): void {
    // Accessibility mode: Kalıcı yavaş mod
    if (StorageManager.getInstance().getSlowMotionEnabled()) {
      this.physics.world.timeScale = 0.7; // %30 yavaş
    }
  }
}
```

---

## 🔤 Dil ve Metin Desteği

### Dyslexia-Friendly Font

Dyslexia (okuma güçlüğü) için özel font:

```typescript
// BootScene.ts
preload(): void {
  // OpenDyslexic font
  this.load.font('opendyslexic', 'assets/fonts/OpenDyslexic-Regular.ttf');
}

// Settings'de toggle
const isDyslexicFont = StorageManager.getInstance().getDyslexicFontEnabled();
const fontFamily = isDyslexicFont ? 'opendyslexic' : 'Arial';
```

### Türkçe Dil Desteği

```typescript
// i18n/tr.json
{
  "menu.play": "OYNA",
  "menu.settings": "AYARLAR",
  "settings.sound": "Ses",
  "settings.haptic": "Titreşim",
  "settings.colorBlind": "Renk Körlüğü Modu",
  "settings.fontSize": "Yazı Boyutu",
  "settings.accessibility": "Erişilebilirlik",
  "game.paused": "DURAKLATILDI",
  "result.gameOver": "OYUN BİTTİ",
  "result.newRecord": "YENİ REKOR!"
}
```

---

## 🎯 Settings Screen - Accessibility Section

```
┌─────────────────────────────────────┐
│         ⚙️ ACCESSIBILITY           │
│                                     │
│  Color Blind Mode                   │
│  ○ Normal  ○ Protanopia             │
│  ○ Deuteranopia  ○ Tritanopia       │
│                                     │
│  Font Size                          │
│  ○ Small  ● Medium  ○ Large         │
│                                     │
│  Visual Feedback       [ON]         │
│  (flash on haptic)                  │
│                                     │
│  Sound Indicators      [OFF]        │
│  (show icons when muted)            │
│                                     │
│  Easier Controls       [OFF]        │
│  (larger touch zones)               │
│                                     │
│  Slow Motion Mode      [OFF]        │
│  (30% slower gameplay)              │
│                                     │
│  Dyslexia Font         [OFF]        │
│                                     │
│         [BACK TO SETTINGS]          │
└─────────────────────────────────────┘
```

### Implementation

```typescript
// src/scenes/AccessibilityScene.ts
export default class AccessibilityScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Accessibility' });
  }

  create(): void {
    const { width, height } = this.scale;
    
    // Title
    this.add.text(width / 2, 60, '♿ ACCESSIBILITY', {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    let y = 140;
    
    // Color Blind Mode
    this.createSection(y, 'Color Blind Mode', [
      ColorBlindMode.NONE,
      ColorBlindMode.PROTANOPIA,
      ColorBlindMode.DEUTERANOPIA,
      ColorBlindMode.TRITANOPIA
    ], 'colorBlindMode');
    y += 100;
    
    // Font Size
    this.createSection(y, 'Font Size', [
      FontSize.SMALL,
      FontSize.MEDIUM,
      FontSize.LARGE,
      FontSize.EXTRA_LARGE
    ], 'fontSize');
    y += 100;
    
    // Toggles
    this.createToggle(y, 'Visual Feedback', 'visualFeedback');
    y += 60;
    
    this.createToggle(y, 'Sound Indicators', 'soundIndicators');
    y += 60;
    
    this.createToggle(y, 'Easier Controls', 'easierControls');
    y += 60;
    
    this.createToggle(y, 'Slow Motion Mode', 'slowMotion');
    y += 60;
    
    this.createToggle(y, 'Dyslexia Font', 'dyslexicFont');
    y += 80;
    
    // Back button
    this.createBackButton(width / 2, y);
  }

  private createToggle(y: number, label: string, settingKey: string): void {
    const storage = StorageManager.getInstance();
    const isEnabled = storage.get(settingKey) || false;
    
    const text = this.add.text(60, y, label, {
      fontSize: '20px',
      color: '#ffffff'
    });
    
    const toggle = this.add.rectangle(
      this.scale.width - 80,
      y,
      60,
      30,
      isEnabled ? 0x00ff88 : 0x666666
    ).setInteractive({ useHandCursor: true });
    
    const knob = this.add.circle(
      this.scale.width - (isEnabled ? 65 : 95),
      y,
      12,
      0xffffff
    );
    
    toggle.on('pointerdown', () => {
      const newValue = !storage.get(settingKey);
      storage.set(settingKey, newValue);
      
      // Animate toggle
      toggle.setFillStyle(newValue ? 0x00ff88 : 0x666666);
      this.tweens.add({
        targets: knob,
        x: this.scale.width - (newValue ? 65 : 95),
        duration: 200,
        ease: 'Power2'
      });
      
      HapticManager.getInstance().light();
      SoundManager.getInstance().play('click');
    });
  }
}
```

---

## 📊 Accessibility Metrics

Track edilmesi gereken:

```typescript
AnalyticsManager.getInstance().logEvent('accessibility_setting_changed', {
  setting_name: 'color_blind_mode',
  new_value: ColorBlindMode.PROTANOPIA,
  user_id: userId
});
```

**Metrikler:**
- Kaç kullanıcı accessibility ayarlarını kullanıyor?
- Hangi ayarlar daha popüler?
- Accessibility kullanıcılarının retention oranı nasıl?

---

## ✅ WCAG Compliance Checklist

Web Content Accessibility Guidelines uyumu:

- [x] Yeterli renk kontrastı (4.5:1 minimum)
- [x] Sadece renge bağlı olmayan göstergeler
- [x] Klavye ile navigation (web için)
- [x] Screen reader desteği (web için)
- [x] Yazı boyutu ayarlanabilir
- [x] Pause/stop mekanizması
- [x] Anlaşılır hata mesajları
- [x] Tutarlı navigasyon

---

Bu özellikler ile **herkes** Dodge Game'i oynayabilir! ♿✨
