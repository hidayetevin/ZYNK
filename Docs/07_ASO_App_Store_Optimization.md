# App Store Optimization (ASO) Stratejisi

## 🎯 Genel Bakış

Play Store ve App Store'da yüksek görünürlük ve download oranı için ASO (App Store Optimization) stratejisi.

---

## 📱 Store Listing Elementleri

### App Name (Uygulama Adı)
- **Primary**: "Dodge Game"
- **Subtitle/Short Description**: "Fast-Paced Arcade Challenge"
- **Uzunluk**: Max 30 karakter (görünürlük için)

### Keywords (Anahtar Kelimeler)

**Primary Keywords:**
- dodge game
- arcade game
- reflex game
- casual game
- survival game

**Long-tail Keywords:**
- dodge obstacles game
- reaction time game
- quick reflex challenge
- minimalist arcade game

**Türkçe Keywords:**
- kayma oyunu
- arcade oyun
- refleks oyunu
- sağkalım oyunu

---

## 📝 App Description

### Short Description (80 karakter)
```
Test your reflexes! Dodge falling obstacles and survive as long as you can!
```

### Full Description Template

```markdown
🎮 Can you survive the ultimate reflex challenge?

Dodge Game is a fast-paced arcade game that tests your reaction time and survival skills. 
Swipe to dodge falling obstacles, collect power-ups, and see how long you can last!

✨ FEATURES:
• Simple one-finger controls
• Increasingly challenging gameplay  
• Beautiful themes to unlock
• Compete on global leaderboards
• No ads interrupting gameplay
• Works offline

🌟 EARN STARS & UNLOCK THEMES:
Survive longer to earn stars and unlock stunning new visual themes!

🏆 COMPETE GLOBALLY:
Challenge players worldwide on the leaderboard!

⚡ POWER-UPS:
• Shield: Protect yourself from one hit
• Slow Motion: Slow down time
• Double Score: Earn points faster

Perfect for quick gaming sessions or marathon challenges. 
How long can YOU survive?

Download now and test your reflexes! 🚀
```

---

## 📸 Screenshots (5-8 adet)

### Screenshot Planı

1. **Hero Shot**: Oyun sahnesi (gameplay action)
2. **Theme Showcase**: Farklı temalar
3. **Leaderboard**: Global sıralama
4. **Power-ups**: Power-up'ların gösterimi
5. **Results Screen**: Yıldız kazanma ekranı

### Screenshot Captions

```
1. "Dodge obstacles and survive!"
2. "Unlock beautiful themes"
3. "Compete globally"
4. "Powerful boosts to help you"
5. "Earn stars and rewards"
```

---

## 🎬 Preview Video (30 saniye)

**Video Outline:**
```
0-5s: Logo + "Test your reflexes!"
5-15s: Gameplay footage (normal → intense)
15-20s: Power-up showcase
20-25s: Theme unlocking
25-30s: Call to action "Download Now!"
```

---

## 🏷️ Category & Tags

- **Primary Category**: Games → Arcade
- **Secondary Category**: Games → Casual
- **Content Rating**: Everyone (3+)
- **In-App Purchases**: No
- **Contains Ads**: Yes

---

## 📊 ASO Metrics to Track

- **Impressions**: Kaç kişi store'da gördü?
- **Conversion Rate**: Görüntüleme → Download oranı
- **Keyword Rankings**: Hangi kelimeler için sıralamadayız?
- **Competitor Analysis**: Rakipler hangi kelimeleri kullanıyor?

---

## 🧪 A/B Testing Plan

Test edilebilecek elementler:

1. **Icon Variations**: 3 farklı icon test et
2. **Screenshot Order**: Hangi sıralama daha iyi?
3. **Description Copy**: 2 farklı açıklama versiyonu
4. **Video vs No Video**: Video etkisi ölçümü

---

## 🔍 Competitor Research

Analiz edilecek rakip oyunlar:
- "Duet Game"
- "Stack"
- "Flappy Bird" tarzı oyunlar
- "Geometry Dash Lite"

**Bakılacaklar:**
- Hangi keyword'leri kullanıyorlar?
- Screenshot stratejileri nasıl?
- Rating'leri nasıl yüksek?
- Review'larda ne isteniyor?

---

## ⭐ Review & Rating Stratejisi

### Timing
İlk rating isteği:
- 3. oyundan sonra
- Eğer kullanıcı 20+ saniye hayatta kaldıysa (pozitif deneyim)
- Günde en fazla 1 kez sor

### Implementation
```typescript
// src/systems/ReviewManager.ts
class ReviewManager {
  async requestReview(): Promise<void> {
    const gamesPlayed = StorageManager.getInstance().getTotalGames();
    const lastReviewRequest = StorageManager.getInstance().getLastReviewRequest();
    
    if (gamesPlayed >= 3 && Date.now() - lastReviewRequest > 86400000) {
      // Request review
      await AppRate.requestReview();
      StorageManager.getInstance().setLastReviewRequest(Date.now());
    }
  }
}
```

### Negative Feedback Funneling
Eğer kullanıcı memnun değilse:
- Store review yerine feedback form göster
- Sorunları öğren ve düzelt

---

## 🌍 Localization (İlk aşamada 2 dil)

1. **English** (Primary)
2. **Turkish** (Secondary)

Store listing'in her iki dilde hazırlanması.

---

## 📅 Launch Checklist

- [ ] App name finalized
- [ ] Keywords researched
- [ ] Description written (EN + TR)
- [ ] 5-8 screenshots prepared
- [ ] Preview video created
- [ ] Icon designed (multiple variants)
- [ ] Privacy policy published
- [ ] Support email set up
- [ ] Promo graphics created

---

Bu ASO stratejisi ile organic downloads maksimize edilir! 📈
