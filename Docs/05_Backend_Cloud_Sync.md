# Backend & Cloud Sync Stratejisi (Phase 2)

## 🌐 Genel Bakış

**Phase 1**: Tamamen client-side, LocalStorage ile veri saklama  
**Phase 2**: Firebase entegrasyonu ile cloud sync, leaderboard ve anti-cheat

---

## 🔥 Firebase Servisleri

### Kullanılacak Firebase Özellikleri

1. **Firebase Authentication** - Kullanıcı kimlik doğrulama
2. **Cloud Firestore** - Kullanıcı verileri sync
3. **Firebase Analytics** - Event tracking (zaten var)
4. **Firebase Remote Config** - A/B testing ve feature flags
5. **Firebase Cloud Functions** - Sunucu tarafı logic
6. **Firebase Hosting** - Web versiyonu deploy

---

## 🔐 Firebase Authentication

### Anonymous Authentication (Phase 2 başlangıç)

İlk adımda kullanıcılardan email/şifre istemeden:

```typescript
// src/systems/AuthManager.ts
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

class AuthManager {
  private static instance: AuthManager;
  private auth = getAuth();
  private currentUser: User | null = null;

  async init(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        resolve();
      });
    });
  }

  async signInAnonymously(): Promise<User> {
    const result = await signInAnonymously(this.auth);
    this.currentUser = result.user;
    
    LogManager.getInstance().info('Auth', 'Anonymous sign-in successful', {
      uid: result.user.uid
    });
    
    return result.user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserId(): string | null {
    return this.currentUser?.uid || null;
  }
}
```

### Social Login (Phase 2 sonrası)

Google, Apple, Facebook ile giriş:

```typescript
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  linkWithCredential 
} from 'firebase/auth';

async signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(this.auth, provider);
  
  AnalyticsManager.getInstance().logEvent('login', {
    method: 'google'
  });
  
  return result.user;
}

// Anonymous hesabı Google hesabına bağla
async linkAnonymousToGoogle(): Promise<void> {
  if (!this.currentUser?.isAnonymous) return;
  
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(this.auth, provider);
  await linkWithCredential(this.currentUser, credential.credential);
  
  LogManager.getInstance().info('Auth', 'Anonymous account linked to Google');
}
```

---

## 📊 Cloud Firestore - Veri Yapısı

### Database Schema

```
users/
  {userId}/
    profile:
      displayName: string
      createdAt: timestamp
      lastLoginAt: timestamp
      
    gameData:
      totalStars: number
      highScore: number
      totalGamesPlayed: number
      unlockedThemes: string[]
      currentTheme: string
      settings: {
        soundEnabled: boolean
        hapticEnabled: boolean
        darkMode: boolean
        colorBlindMode: string
        // ... other settings
      }
      
    statistics:
      totalTimePlayed: number (seconds)
      averageGameTime: number
      longestStreak: number
      powerupsCollected: number
      
    achievements:
      {achievementId}: {
        unlockedAt: timestamp
        progress: number
      }

leaderboards/
  global/
    allTime/
      {userId}: {
        score: number
        username: string
        achievedAt: timestamp
      }
    daily/
      {date}/
        {userId}: { ... }
    weekly/
      {weekId}/
        {userId}: { ... }

gameEvents/
  {userId}/
    {sessionId}/
      {eventId}: {
        type: string
        timestamp: timestamp
        data: object
      }
```

### Cloud Sync Manager

```typescript
// src/systems/CloudSyncManager.ts
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';

interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: number | null;
  syncError: string | null;
}

class CloudSyncManager {
  private static instance: CloudSyncManager;
  private db = getFirestore();
  private syncStatus: SyncStatus = {
    isSyncing: false,
    lastSyncTime: null,
    syncError: null
  };

  async syncGameData(): Promise<void> {
    const userId = AuthManager.getInstance().getUserId();
    if (!userId) {
      LogManager.getInstance().warn('CloudSync', 'No user ID, skipping sync');
      return;
    }

    this.syncStatus.isSyncing = true;

    try {
      const localData = StorageManager.getInstance().loadGameData();
      
      // Firestore'a yaz
      await setDoc(doc(this.db, 'users', userId, 'gameData'), {
        ...localData,
        lastSyncedAt: serverTimestamp()
      }, { merge: true });

      this.syncStatus.lastSyncTime = Date.now();
      this.syncStatus.syncError = null;
      
      LogManager.getInstance().info('CloudSync', 'Game data synced successfully');
      
    } catch (error) {
      this.syncStatus.syncError = error.message;
      LogManager.getInstance().error('CloudSync', 'Sync failed', { error });
      
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  async loadGameDataFromCloud(): Promise<GameData | null> {
    const userId = AuthManager.getInstance().getUserId();
    if (!userId) return null;

    try {
      const docRef = doc(this.db, 'users', userId, 'gameData');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        LogManager.getInstance().info('CloudSync', 'Loaded data from cloud');
        return docSnap.data() as GameData;
      }
      
      return null;
      
    } catch (error) {
      LogManager.getInstance().error('CloudSync', 'Failed to load from cloud', { error });
      return null;
    }
  }

  async mergeLocalAndCloudData(): Promise<void> {
    const localData = StorageManager.getInstance().loadGameData();
    const cloudData = await this.loadGameDataFromCloud();

    if (!cloudData) {
      // Cloud'da veri yok, local'i upload et
      await this.syncGameData();
      return;
    }

    // Merge logic: En yüksek değerleri al
    const mergedData: GameData = {
      totalStars: Math.max(localData.totalStars, cloudData.totalStars),
      highScore: Math.max(localData.highScore, cloudData.highScore),
      totalGamesPlayed: Math.max(localData.totalGamesPlayed, cloudData.totalGamesPlayed),
      
      // Temaları birleştir
      unlockedThemes: [
        ...new Set([...localData.unlockedThemes, ...cloudData.unlockedThemes])
      ],
      
      // Son ayarları kullan (timestamp'e göre)
      settings: cloudData.lastSyncedAt > localData.lastSyncedAt 
        ? cloudData.settings 
        : localData.settings,
        
      currentTheme: cloudData.currentTheme || localData.currentTheme
    };

    // Merge edilmiş veriyi hem local hem cloud'a yaz
    StorageManager.getInstance().saveGameData(mergedData);
    await this.syncGameData();
    
    LogManager.getInstance().info('CloudSync', 'Data merged successfully', {
      localStars: localData.totalStars,
      cloudStars: cloudData.totalStars,
      mergedStars: mergedData.totalStars
    });
  }

  // Real-time sync dinleyicisi
  setupRealtimeSync(): void {
    const userId = AuthManager.getInstance().getUserId();
    if (!userId) return;

    const docRef = doc(this.db, 'users', userId, 'gameData');
    
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const cloudData = doc.data() as GameData;
        const localData = StorageManager.getInstance().loadGameData();
        
        // Cloud'daki veri daha güncel mi?
        if (cloudData.lastSyncedAt > localData.lastSyncedAt) {
          StorageManager.getInstance().saveGameData(cloudData);
          
          LogManager.getInstance().info('CloudSync', 'Data updated from cloud (realtime)');
          
          // UI'ı güncelle
          this.notifyDataChanged();
        }
      }
    });
  }

  private notifyDataChanged(): void {
    // Event emit et, sahneler dinlesin
    window.dispatchEvent(new Event('gameDataUpdated'));
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
}
```

---

## 🏆 Leaderboard Sistemi

### Leaderboard Manager

```typescript
// src/systems/LeaderboardManager.ts
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  setDoc,
  doc
} from 'firebase/firestore';

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  achievedAt: number;
  rank?: number;
}

class LeaderboardManager {
  private db = getFirestore();

  async submitScore(score: number): Promise<void> {
    const userId = AuthManager.getInstance().getUserId();
    if (!userId) return;

    const username = AuthManager.getInstance().getCurrentUser()?.displayName || 'Anonymous';

    // Global all-time leaderboard
    await setDoc(
      doc(this.db, 'leaderboards', 'global', 'allTime', userId),
      {
        userId,
        username,
        score,
        achievedAt: serverTimestamp()
      }
    );

    // Daily leaderboard
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    await setDoc(
      doc(this.db, 'leaderboards', 'global', 'daily', today, userId),
      {
        userId,
        username,
        score,
        achievedAt: serverTimestamp()
      }
    );

    LogManager.getInstance().info('Leaderboard', 'Score submitted', { score });
    
    AnalyticsManager.getInstance().logEvent('leaderboard_score_submitted', {
      score,
      leaderboard_type: 'global'
    });
  }

  async getTopScores(leaderboardType: 'allTime' | 'daily' | 'weekly', topN: number = 100): Promise<LeaderboardEntry[]> {
    let path: string;

    if (leaderboardType === 'allTime') {
      path = 'leaderboards/global/allTime';
    } else if (leaderboardType === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      path = `leaderboards/global/daily/${today}`;
    } else {
      // Weekly logic
      const weekId = this.getCurrentWeekId();
      path = `leaderboards/global/weekly/${weekId}`;
    }

    const q = query(
      collection(this.db, path),
      orderBy('score', 'desc'),
      limit(topN)
    );

    const snapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];

    snapshot.forEach((doc, index) => {
      entries.push({
        ...doc.data() as LeaderboardEntry,
        rank: index + 1
      });
    });

    return entries;
  }

  async getUserRank(userId: string, leaderboardType: 'allTime' | 'daily'): Promise<number | null> {
    // Simplified: Get all scores and find user's rank
    const allScores = await this.getTopScores(leaderboardType, 10000);
    const userEntry = allScores.find(entry => entry.userId === userId);
    return userEntry?.rank || null;
  }

  private getCurrentWeekId(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  }
}
```

### Leaderboard UI

```typescript
// src/scenes/LeaderboardScene.ts
export default class LeaderboardScene extends Phaser.Scene {
  async create(): void {
    // Tabs: All Time | Daily | Weekly
    const tabs = ['All Time', 'Daily', 'Weekly'];
    let activeTab = 0;

    // Load top 100
    const scores = await LeaderboardManager.getInstance().getTopScores('allTime', 100);

    this.displayLeaderboard(scores);
  }

  private displayLeaderboard(entries: LeaderboardEntry[]): void {
    const { width } = this.scale;
    let y = 150;

    entries.forEach((entry) => {
      const rankText = this.add.text(50, y, `#${entry.rank}`, {
        fontSize: '20px',
        color: entry.rank <= 3 ? '#FFD700' : '#ffffff'
      });

      const nameText = this.add.text(120, y, entry.username, {
        fontSize: '18px',
        color: '#ffffff'
      });

      const scoreText = this.add.text(width - 100, y, `${entry.score}s`, {
        fontSize: '18px',
        color: '#00ff88'
      }).setOrigin(1, 0);

      y += 40;
    });
  }
}
```

---

## 🛡️ Anti-Cheat Sistem

### Server-side Score Validation (Cloud Functions)

```typescript
// functions/src/index.ts (Firebase Cloud Functions)
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const validateScore = functions.https.onCall(async (data, context) => {
  // Auth check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { score, timeSurvived, obstaclesDodged, sessionId } = data;
  const userId = context.auth.uid;

  // Validation rules
  const isValid = 
    score === timeSurvived && // Score should equal time survived
    timeSurvived <= 300 && // Max 5 minutes seems reasonable
    obstaclesDodged <= timeSurvived * 5 && // Max 5 obstacles per second
    obstaclesDodged >= timeSurvived * 0.5; // Min 0.5 obstacles per second

  if (!isValid) {
    // Log suspicious activity
    await admin.firestore().collection('suspiciousActivities').add({
      userId,
      score,
      timeSurvived,
      obstaclesDodged,
      sessionId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      reason: 'Invalid score metrics'
    });

    throw new functions.https.HttpsError('invalid-argument', 'Score validation failed');
  }

  // Store validated score
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('validatedScores')
    .add({
      score,
      timeSurvived,
      obstaclesDodged,
      sessionId,
      validatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

  return { valid: true, score };
});
```

### Client Tarafında Kullanım

```typescript
// GameScene.ts
async gameOver(): void {
  // ... existing code ...

  // Validate score with server
  try {
    const validateScore = httpsCallable(getFunctions(), 'validateScore');
    const result = await validateScore({
      score: this.gameTime,
      timeSurvived: this.gameTime,
      obstaclesDodged: this.obstaclesDodged,
      sessionId: this.sessionId
    });

    if (result.data.valid) {
      // Submit to leaderboard
      await LeaderboardManager.getInstance().submitScore(this.gameTime);
    }
    
  } catch (error) {
    LogManager.getInstance().error('AntiCheat', 'Score validation failed', { error });
    // Don't submit to leaderboard
  }
}
```

---

## ⚙️ Firebase Remote Config

### Feature Flags & A/B Testing

```typescript
// src/systems/RemoteConfigManager.ts
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

class RemoteConfigManager {
  private remoteConfig = getRemoteConfig();

  async init(): Promise<void> {
    // Default values
    this.remoteConfig.defaultConfig = {
      min_spawn_delay: 300,
      max_spawn_delay: 1500,
      star_threshold_1: 10,
      star_threshold_2: 20,
      star_threshold_3: 40,
      show_rewarded_continue: true,
      leaderboard_enabled: true,
      new_theme_unlocked: false // Feature flag
    };

    // Fetch from server
    await fetchAndActivate(this.remoteConfig);
    
    LogManager.getInstance().info('RemoteConfig', 'Config fetched and activated');
  }

  getMinSpawnDelay(): number {
    return getValue(this.remoteConfig, 'min_spawn_delay').asNumber();
  }

  getStarThresholds(): { one: number; two: number; three: number } {
    return {
      one: getValue(this.remoteConfig, 'star_threshold_1').asNumber(),
      two: getValue(this.remoteConfig, 'star_threshold_2').asNumber(),
      three: getValue(this.remoteConfig, 'star_threshold_3').asNumber()
    };
  }

  isFeatureEnabled(featureName: string): boolean {
    return getValue(this.remoteConfig, featureName).asBoolean();
  }
}
```

---

## 📈 Backend Metrics

Firebase Console'da track edilecek:

- **DAU/MAU**: Firebase Analytics otomatik
- **Cloud Sync Rate**: Kaç kullanıcı sync ediyor?
- **Leaderboard Engagement**: Kaç kişi leaderboard'a bakıyor?
- **Cheat Detection**: Kaç score reddedildi?
- **Cloud Function Errors**: Validation hataları

---

## 💰 Firebase Costs (Tahmin)

**Spark Plan (Free):**
- ✅ 50K Cloud Function invocations/month
- ✅ 1GB Firestore storage
- ✅ 10GB hosting bandwidth

**10,000 DAU için Blaze Plan tahmini:**
- Cloud Functions: ~$5-10/month
- Firestore: ~$5-15/month
- **Total**: ~$10-25/month

---

Bu backend stratejisi ile oyun data persistence, competitive leaderboards ve anti-cheat korumasına sahip olur! 🔥
