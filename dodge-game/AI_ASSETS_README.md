# AI Generated Assets - Kopyalama Talimatları

## 📸 Üretilen Görseller

Aşağıdaki görseller AI tarafından üretildi ve chat penceresinde görüntülendi:

### ✅ Tamamlanan Assets:
1. **player_normal.png** - Cyan glowing player sprite
2. **app_icon_1024.png** - 1024x1024 app icon
3. **powerup_shield.png** - Blue shield power-up
4. **powerup_slowmo.png** - Purple slow-mo power-up
5. **powerup_doublescore.png** - Gold 2X power-up
6. **obstacle_spike.png** - Pink spike ball
7. **obstacle_electric.png** - Electric cyan orb

### ⏳ Eksik (Şimdilik Placeholder):
- **obstacle_meteor.png** - Sonra eklenecek

---

## 📂 Kopyalama Adımları

### 1. Manuel Kopyalama (Tavsiye Edilen):

Chat penceresinde gördüğün görselleri sağ tıklayıp **"Save Image As"** ile şuraya kaydet:

```
D:\PROJECTS\ZYNK\dodge-game\public\assets\
├── sprites/
│   └── player_normal.png
├── powerups/
│   ├── powerup_shield.png
│   ├── powerup_slowmo.png
│   └── powerup_doublescore.png
├── obstacles/
│   ├── obstacle_spike.png
│   └── obstacle_electric.png
└── icon-1024.png (app_icon_1024.png olarak kaydet)
```

### 2. Icon'ları PWA için kopyala:

```bash
# icon-1024.png'den küçük versiyonlar oluştur (online tool: iloveimg.com/resize-image)
# 192x192 → public/icon-192.png
# 512x512 → public/icon-512.png
```

---

## 🎮 Kod Entegrasyonu

Assetler kopyalandıktan sonra, oyun otomatik olarak gerçek görselleri yükleyecek:

**BootScene.ts** - preload metodunda:
```typescript
// Player
this.load.image('player_normal', 'assets/sprites/player_normal.png');

// Power-ups
this.load.image('powerup_shield', 'assets/powerups/powerup_shield.png');
this.load.image('powerup_slowmo', 'assets/powerups/powerup_slowmo.png');
this.load.image('powerup_double_score', 'assets/powerups/powerup_doublescore.png');

// Obstacles
this.load.image('obstacle_spike', 'assets/obstacles/obstacle_spike.png');
this.load.image('obstacle_electric', 'assets/obstacles/obstacle_electric.png');
```

---

## ⚠️ Şimdilik:

Görseller kopyalanana kadar **placeholder grafikler** (renkli şekiller) kullanılmaya devam edecek.

Assets kopyalandığında otomatik olarak yenilenecek! 🎨
