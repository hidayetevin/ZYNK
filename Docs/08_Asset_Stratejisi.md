# Asset Stratejisi - Dodge Game

## 🎨 Genel Bakış

Tüm grafikler **Gemini (AI)** tarafından üretilecek. Döküman boyunca detaylı promptlar ve spesifikasyonlar yer alıyor.

---

## 📐 Asset Spesifikasyonları

### Çözünürlük ve Format
- **Format**: PNG (transparency için)
- **Çözünürlük**: 2x (Retina ready)
- **Renk Modu**: RGBA
- **Boyutlar**: Square (eşit width/height) - Phaser rotation için ideal

---

## 🎮 Game Assets

### 1. Player Character (Oyuncu)

**Konsept**: Minimal, modern, hareketli karakter

**Prompt for AI:**
```
Create a circular player character sprite for a mobile dodge game:
- Style: Minimalist, modern, flat design
- Shape: Perfect circle
- Size: 128x128 pixels
- Color: Vibrant cyan (#00ff88)
- Details: Subtle gradient from center to edge
- Add a small directional indicator (arrow or glow) to show facing direction
- Background: Transparent (PNG)
- Visual vibe: Friendly, energetic, glowing
- Add a subtle pulse/breathing animation feel (slight inner glow)

The character should look appealing and stand out against dark backgrounds.
```

**Variations Needed:**
1. **player_normal.png** (128x128) - Normal state
2. **player_shield.png** (128x128) - With shield effect (blue glow ring)
3. **player_hit.png** (128x128) - Hit flash effect (red tint)

---

### 2. Obstacles (Engeller)

**3 Farklı Tip:** Meteor, Spike, Electric

#### Type 1: Meteor
**Prompt:**
```
Create a meteor obstacle sprite for a space dodge game:
- Style: Stylized, low-poly look
- Shape: Irregular rock with angular facets
- Size: 96x96 pixels
- Color Palette: Dark grays (#3a3a3a, #2a2a2a) with red-orange lava cracks (#ff4444, #ff8800)
- Details: Glowing cracks, slight motion blur trail
- Rotation: Should look good at any angle
- Background: Transparent
- Feel: Dangerous, fast-moving

The meteor should have a sci-fi arcade feel.
```

#### Type 2: Spike Ball
**Prompt:**
```
Create a spike ball obstacle sprite:
- Style: Geometric, sharp, clean
- Shape: Circular core with evenly-spaced sharp spikes radiating outward
- Size: 96x96 pixels
- Color: Dark purple core (#6a1b9a) with pink spikes (#f06292)
- Details: Subtle gradient on spikes, metallic sheen
- Background: Transparent
- Feel: Sharp, threatening, geometric

Should be visually distinct from the meteor.
```

#### Type 3: Electric Orb
**Prompt:**
```
Create an electric energy orb obstacle:
- Style: Glowing, energy-based, particle effect
- Shape: Spherical with electric arcs
- Size: 96x96 pixels
- Color: Bright electric blue (#00d4ff) with white lightning bolts
- Details: Crackling electricity, inner glow, outer sparks
- Background: Transparent
- Feel: Energetic, buzzing, dangerous

The orb should have a sci-fi energy weapon aesthetic.
```

**Obstacle Variations:** 3 types × 1 sprite each = **3 sprites**

---

### 3. Power-Ups

#### Shield Power-Up
**Prompt:**
```
Create a shield power-up icon for a game:
- Style: Clean, iconic, glowing
- Shape: Circular with shield symbol inside
- Size: 80x80 pixels
- Color: Bright blue (#4fc3f7) with white shield icon
- Details: Rotating rim effect, subtle pulse
- Background: Transparent
- Visual cue: Defensive, protective

The power-up should clearly communicate "protection".
```

#### Slow Motion Power-Up
**Prompt:**
```
Create a slow-motion time power-up icon:
- Style: Modern, tech-inspired
- Shape: Circular with clock/time symbol
- Size: 80x80 pixels
- Color: Purple (#9c27b0) with white clock hands
- Details: Time wave ripples, slow-motion trails
- Background: Transparent
- Visual cue: Time manipulation, slow

Should evoke the feeling of slowing down time.
```

#### Double Score Power-Up
**Prompt:**
```
Create a double score multiplier power-up:
- Style: Bold, rewarding, shiny
- Shape: Circular with "2X" text or star burst
- Size: 80x80 pixels
- Color: Golden yellow (#ffd700) with orange accents (#ff9800)
- Details: Sparkles, shine effect
- Background: Transparent
- Visual cue: Valuable, rewarding

Should look like a valuable collectible.
```

**Power-Up Total:** 3 sprites

---

### 4. Particle Effects (Optional Phase 1, Required Phase 2)

**Explosion Effect** (when obstacle is destroyed)
```
Create an explosion particle sprite sheet:
- Style: Cartoon explosion, burst effect
- Grid: 4x4 (16 frames)
- Each frame: 128x128 pixels
- Colors: Orange to yellow gradient (#ff6600 → #ffdd00)
- Animation: Expand outward, fade out
- Background: Transparent

For a satisfying destruction effect.
```

**Shield Break Effect**
```
Create a shield breaking particle effect:
- Style: Glass shatter
- Grid: 3x3 (9 frames)
- Each frame: 128x128 pixels
- Color: Blue fragments (#4fc3f7)
- Animation: Shatter and fade
- Background: Transparent
```

**Star Collect Effect**
```
Create a star collection sparkle effect:
- Style: Magical sparkles
- Grid: 3x4 (12 frames)
- Each frame: 64x64 pixels
- Color: Golden (#ffd700)
- Animation: Burst and twinkle
- Background: Transparent
```

---

## 🎨 UI Assets

### 1. Buttons

**Play Button**
```
Create a modern game play button:
- Style: Rounded rectangle, bold
- Size: 400x120 pixels
- Color: Gradient from cyan (#00ff88) to green (#00cc66)
- Text: "PLAY" in bold white sans-serif font (size 60px)
- Details: Subtle shadow, glossy effect
- Background: Transparent around rounded shape
- States needed: Normal, Pressed (slightly darker), Hover

Should feel inviting and easy to tap.
```

**Settings Button (Icon)**
```
Create a settings gear icon button:
- Style: Simple, clean gear/cog icon
- Size: 80x80 pixels
- Color: White (#ffffff) with subtle gray stroke
- Background: Semi-transparent dark circle
- Details: Minimal, recognizable

Universal settings icon.
```

### 2. Theme Preview Cards

5 tema için 5 farklı preview kart gerekli. Her kart temayı temsil eden miniature görünüm.

**Card Template Prompt:**
```
Create a theme preview card for [THEME_NAME]:
- Size: 200x150 pixels
- Background: [THEME_BG_COLOR]
- Contains: Mini player icon (30x30) + 2-3 mini obstacles (20x20)
- Border: 4px border in [THEME_ACCENT_COLOR]
- Label: "[THEME_NAME]" text at bottom (18px font)
- Lock icon overlay if locked (50x50, semi-transparent)

[Repeat for each theme: Classic, Ocean, Sunset, Forest, Neon]
```

### 3. Icons & Symbols

**Star Icon** (for rewards)
```
Create a clean star icon:
- Style: 5-pointed star, flat design
- Size: 64x64 pixels
- Color: Golden yellow (#ffd700)
- Details: Slight gradient, subtle glow
- States: Filled (earned), Empty (not earned, outline only)
- Background: Transparent
```

**Lock Icon**
```
Create a padlock icon:
- Style: Simple, recognizable
- Size: 64x64 pixels
- Color: Gray (#666666)
- Details: Minimalist design
- Background: Transparent
```

**Trophy Icon** (high score)
```
Create a trophy/achievement icon:
- Style: Modern, sleek
- Size: 80x80 pixels
- Color: Gold (#ffd700) with silver accents
- Background: Transparent
```

---

## 🖼️ Background & Environment

### Background Gradients (Code-based, no assets needed)

Arka planlar CSS/Canvas gradient ile oluşturulacak, texture asset gerekmez:

```typescript
// Theme backgrounds will be simple gradients
const backgrounds = {
  classic: { top: '#1a1a2e', bottom: '#16213e' },
  ocean: { top: '#0a1929', bottom: '#0f3460' },
  sunset: { top: '#1a0a29', bottom: '#4a0e4e' },
  forest: { top: '#0d1f0d', bottom: '#1a3a1a' },
  neon: { top: '#0a0a0a', bottom: '#1a0a2e' }
};
```

### Parallax Stars (optional)
```
Create a star field particle:
- Style: Simple dots, various sizes
- Size: 512x512 tileable texture
- Colors: White dots on transparent background
- Density: Sparse (space theme)
- Sizes: 1px, 2px, 3px random stars

Tileable for parallax scrolling background.
```

---

## 🎵 Sound & Music (Not AI-generated, use libraries)

**Sources:**
- **Sound Effects**: [Freesound.org](https://freesound.org) (CC0 license)
- **Music**: [OpenGameArt.org](https://opengameart.org) or [Incompetech](https://incompetech.com)

**Needed Sounds:**
1. `click.mp3` - UI button click (short, clean)
2. `hit.mp3` - Collision with obstacle (impact sound)
3. `powerup.mp3` - Collecting power-up (positive chime)
4. `shield_break.mp3` - Shield breaking (glass shatter)
5. `star.mp3` - Earning a star (achievement ding)
6. `theme_unlock.mp3` - New theme unlocked (fanfare)

**Music:**
- `bgm_menu.mp3` - Calm, ambient loop for menu (60s loop)
- `bgm_game.mp3` - Upbeat, tense music for gameplay (90s loop)

**Alternative**: Generate simple beep tones programmatically with Web Audio API for MVP.

---

## 📱 App Icons & Store Assets

### App Icon
```
Create a mobile app icon for Dodge Game:
- Size: 1024x1024 pixels
- Style: Bold, recognizable, simple
- Content: Stylized player character (cyan circle) dodging a meteor
- Background: Dark gradient (#1a1a2e to #2d3561)
- Colors: Vibrant cyan, orange accent
- Text: No text on icon
- Design: Should work at small sizes (60x60)

Memorable and eye-catching in app stores.
```

### Splash Screen
```
Create a splash screen for app loading:
- Size: 1242x2688 pixels (iPhone resolution)
- Style: Clean, branded
- Content: Game logo/title centered with player character
- Background: Theme gradient
- Text: "DODGE GAME" in bold sans-serif
- Loading indicator at bottom (subtle)

Should load instantly and look professional.
```

### Store Screenshots (Design Phase, not AI)

5 screenshots will be designed manually showing:
1. Gameplay action
2. Power-ups in action
3. Theme selection screen
4. Results screen with stars
5. Leaderboard

---

## 📦 Asset Organization

```
src/assets/
├── sprites/
│   ├── player/
│   │   ├── player_normal.png (128x128)
│   │   ├── player_shield.png (128x128)
│   │   └── player_hit.png (128x128)
│   │
│   ├── obstacles/
│   │   ├── meteor.png (96x96)
│   │   ├── spike.png (96x96)
│   │   └── electric.png (96x96)
│   │
│   ├── powerups/
│   │   ├── shield.png (80x80)
│   │   ├── slowmo.png (80x80)
│   │   └── double_score.png (80x80)
│   │
│   └── particles/
│       ├── explosion.png (512x512 spritesheet)
│       ├── shield_break.png (384x384 spritesheet)
│       └── star_sparkle.png (256x256 spritesheet)
│
├── ui/
│   ├── buttons/
│   │   ├── btn_play.png (400x120)
│   │   ├── btn_settings.png (80x80)
│   │   └── btn_back.png (80x80)
│   │
│   ├── icons/
│   │   ├── star_filled.png (64x64)
│   │   ├── star_empty.png (64x64)
│   │   ├── lock.png (64x64)
│   │   └── trophy.png (80x80)
│   │
│   └── themes/
│       ├── card_classic.png (200x150)
│       ├── card_ocean.png (200x150)
│       ├── card_sunset.png (200x150)
│       ├── card_forest.png (200x150)
│       └── card_neon.png (200x150)
│
├── sounds/
│   ├── click.mp3
│   ├── hit.mp3
│   ├── powerup.mp3
│   ├── shield_break.mp3
│   ├── star.mp3
│   ├── theme_unlock.mp3
│   ├── bgm_menu.mp3
│   └── bgm_game.mp3
│
└── app/
    ├── icon.png (1024x1024)
    └── splash.png (1242x2688)
```

---

## 🔄 Asset Generation Workflow

### Step 1: Generate Core Sprites
Öncelik sırasıyla:
1. ✅ Player (3 variants)
2. ✅ Obstacles (3 types)
3. ✅ Power-ups (3 types)
4. ✅ UI buttons (3 buttons)
5. ✅ Icons (star, lock, trophy)

### Step 2: Generate Theme Cards
Her tema için preview kartları

### Step 3: Generate Effects (Optional Phase 1)
Particle efektler (polish için)

### Step 4: App Icon & Splash
Store yayını öncesi

### Step 5: Store Assets
Screenshot tasarımları (manual design)

---

## ⚙️ Asset Loading Strategy

### Preload Priority

**Critical (BootScene):**
- Player sprites
- Obstacle sprites
- UI buttons

**Secondary (Lazy load):**
- Power-up sprites (ilk power-up spawn'dan önce)
- Particle effects
- Theme cards

**Deferred:**
- Sounds (user interaction'dan sonra)
- Music (mute check'ten sonra)

---

## 📊 Asset Size Budget

**Target:** < 5MB total initial load

**Breakdown:**
- Sprites: ~500KB (PNG optimized)
- UI: ~300KB
- Sounds: ~1MB (compressed MP3)
- Icons/Misc: ~200KB

**Total:** ~2MB (well under budget)

---

## 🎨 Art Direction Summary

**Visual Style:**
- **Aesthetic**: Minimalist sci-fi arcade
- **Color Palette**: Vibrant neon colors on dark backgrounds
- **Vibe**: Fast-paced, energetic, modern
- **Inspiration**: Geometry Dash + Duet Game + Neon aesthetics

**Key Principles:**
1. High contrast (visibility)
2. Clear silhouettes (recognition)
3. Smooth animations (polish)
4. Consistent style (cohesion)

---

## ✅ Asset Generation Checklist

**Phase 1 (MVP) - Required:**
- [ ] player_normal.png
- [ ] player_shield.png
- [ ] meteor.png
- [ ] spike.png
- [ ] electric.png
- [ ] powerup_shield.png
- [ ] powerup_slowmo.png
- [ ] powerup_doublescore.png
- [ ] btn_play.png
- [ ] btn_settings.png
- [ ] star_filled.png
- [ ] icon.png (app icon)

**Phase 2 (Polish):**
- [ ] Particle effects
- [ ] Theme preview cards
- [ ] Splash screen
- [ ] Additional animations

---

**Toplam Gerekli Asset:** ~20-25 dosya (Phase 1 için)

Hepsi AI (Gemini) ile üretilecek! 🎨
