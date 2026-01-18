# Analytics & Tracking Stratejisi

## 📊 Genel Bakış

Dodge Game için kullanıcı davranışlarını anlamak ve oyun dengesini optimize etmek için **Firebase Analytics** kullanılacak.

---

## 🎯 Track Edilecek Eventler

### 1. Oyun Yaşam Döngüsü

#### `game_started`
Kullanıcı oyunu başlattığında
```typescript
{
  theme_id: string,          // Seçilen tema
  total_games_played: number // Toplam oynanan oyun sayısı
}
```

#### `game_over`
Oyun bittiğinde
```typescript
{
  time_survived: number,     // Hayatta kalma süresi (saniye)
  stars_earned: number,      // Kazanılan yıldız (1-3)
  obstacles_dodged: number,  // Atlanan engel sayısı
  powerups_collected: number,// Toplanan power-up sayısı
  is_new_highscore: boolean, // Yeni rekor mu?
  theme_id: string          // Hangi temada oynandı
}
```

#### `game_continued`
Rewarded ad izleyerek oyuna devam edildiğinde
```typescript
{
  time_at_continue: number,  // Devam edildiği andaki süre
  stars_before: number       // Devam etmeden önceki yıldız
}
```

---

### 2. Tema Sistemi

#### `theme_unlocked`
Yeni tema kilidi açıldığında
```typescript
{
  theme_id: string,
  stars_spent: number,       // Harcanan yıldız
  total_stars_remaining: number
}
```

#### `theme_selected`
Tema değiştirildiğinde
```typescript
{
  theme_id: string,
  from_theme: string         // Önceki tema
}
```

---

### 3. Monetization

#### `ad_impression`
Reklam gösterildiğinde
```typescript
{
  ad_type: 'banner' | 'interstitial' | 'rewarded',
  placement: 'menu' | 'game_over' | 'continue',
  is_test_ad: boolean
}
```

#### `ad_clicked`
Reklam tıklandığında
```typescript
{
  ad_type: string,
  placement: string
}
```

#### `ad_rewarded`
Rewarded ad başarıyla izlendiğinde
```typescript
{
  reward_type: 'continue_game' | 'bonus_stars',
  reward_amount: number
}
```

#### `ad_failed`
Reklam yüklenemediğinde
```typescript
{
  ad_type: string,
  error_code: string,
  error_message: string
}
```

---

### 4. Kullanıcı Ayarları

#### `settings_changed`
Ayarlar değiştirildiğinde
```typescript
{
  setting_name: 'sound' | 'haptic' | 'dark_mode',
  new_value: boolean,
  old_value: boolean
}
```

#### `progress_reset`
Kullanıcı ilerlemeyi sıfırladığında
```typescript
{
  total_stars_lost: number,
  games_played_lost: number,
  high_score_lost: number
}
```

---

### 5. Power-Up Sistemi

#### `powerup_collected`
Power-up toplandığında
```typescript
{
  powerup_type: 'shield' | 'slow_motion' | 'double_score',
  game_time: number,         // Toplandığı oyun süresi
  powerups_total: number     // Oyunda toplanan toplam power-up
}
```

#### `powerup_expired`
Power-up süresi dolduğunda
```typescript
{
  powerup_type: string,
  duration_used: number      // Kaç saniye kullanıldı
}
```

---

## 📈 Kullanıcı Özellikleri (User Properties)

Firebase'de kullanıcı özelliği olarak tutulacak veriler:

```typescript
{
  total_games_played: number,
  total_stars_earned: number,
  high_score: number,
  themes_unlocked: number,
  preferred_theme: string,
  sound_enabled: boolean,
  haptic_enabled: boolean,
  dark_mode_enabled: boolean,
  first_play_date: string,
  last_play_date: string,
  avg_session_length: number // Saniye cinsinden
}
```

---

## 🔍 Önemli Metrikler

### Engagement Metrics
- **DAU/MAU** (Daily/Monthly Active Users)
- **Session Length**: Ortalama oturum süresi
- **Retention Rate**: 1, 7, 30 günlük retention
- **Games per Session**: Oturum başına oyun sayısı

### Game Balance Metrics
- **Average Time Survived**: Ortalama hayatta kalma süresi
- **Star Distribution**: Kaç kişi 1/2/3 yıldız alıyor?
- **Theme Popularity**: Hangi temalar daha çok tercih ediliyor?
- **Difficulty Curve**: Oyuncular hangi sürelerde ölüyor?

### Monetization Metrics
- **Ad Fill Rate**: Reklamların doluluk oranı
- **Ad CTR**: Reklam tıklama oranı
- **Rewarded Ad Completion Rate**: Rewarded reklamları kaç kişi sonuna kadar izliyor?
- **ARPDAU**: Kullanıcı başına günlük ortalama gelir

---

## 🛠 Implementation

### Firebase Analytics Setup

```typescript
// src/systems/AnalyticsManager.ts
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

class AnalyticsManager {
  private static instance: AnalyticsManager;
  
  static getInstance(): AnalyticsManager {
    if (!this.instance) {
      this.instance = new AnalyticsManager();
    }
    return this.instance;
  }

  async init(): Promise<void> {
    await FirebaseAnalytics.setEnabled({ enabled: true });
    await FirebaseAnalytics.setSessionTimeoutDuration({ duration: 1800 }); // 30 min
  }

  async logEvent(eventName: string, params?: Record<string, any>): Promise<void> {
    try {
      await FirebaseAnalytics.logEvent({
        name: eventName,
        params: params || {}
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  async setUserProperty(name: string, value: string): Promise<void> {
    await FirebaseAnalytics.setUserProperty({ name, value });
  }
}
```

### Kullanım Örneği

```typescript
// GameScene.ts
gameOver(): void {
  const analytics = AnalyticsManager.getInstance();
  
  analytics.logEvent('game_over', {
    time_survived: this.gameTime,
    stars_earned: this.stars,
    obstacles_dodged: this.obstaclesDodged,
    powerups_collected: this.powerupsCollected,
    is_new_highscore: this.isNewHighScore,
    theme_id: this.theme.id
  });
  
  // ...
}
```

---

## 📊 Dashboard & Funnels

### Oyuncu Yolculuğu Funnel
```
App Launch (100%)
  ↓
Menu Viewed (95%)
  ↓
Game Started (80%)
  ↓
Survived > 10s (60%)
  ↓
Survived > 20s (30%)
  ↓
Survived > 40s (10%)
```

### Tema Kilidi Açma Funnel
```
Locked Theme Viewed (100%)
  ↓
5 Stars Earned (40%)
  ↓
Theme Unlocked (35%)
  ↓
Theme Selected (30%)
```

---

## 🚨 Privacy & GDPR

- **Consent Management**: İlk açılışta analytics izni istenmeli
- **Data Minimization**: Sadece gerekli veriler toplanmalı
- **Anonymization**: Kişisel veri toplanmamalı
- **Opt-out**: Kullanıcı isterse analytics kapatabilmeli

```typescript
// SettingsScene.ts
toggleAnalytics(): void {
  const enabled = !StorageManager.getInstance().getAnalyticsEnabled();
  StorageManager.getInstance().setAnalyticsEnabled(enabled);
  FirebaseAnalytics.setEnabled({ enabled });
}
```

---

## 📅 Reporting Kadansı

- **Günlük**: DAU, ad revenue, crash rate
- **Haftalık**: Retention, session metrics, popular themes
- **Aylık**: MRR, user acquisition cost, LTV

---

## 🎯 A/B Testing İmkanları (Gelecek)

1. **Difficulty Curve**: Farklı zorluk eğrileri test et
2. **Star Thresholds**: Yıldız eşikleri optimize et
3. **Ad Frequency**: Reklam sıklığı test et
4. **Theme Prices**: Tema fiyatları A/B test
5. **UI Variations**: Farklı button renkleri/yerleşimleri

---

Bu strateji ile oyunun her yönü ölçülebilir ve optimize edilebilir hale gelir. 📊
