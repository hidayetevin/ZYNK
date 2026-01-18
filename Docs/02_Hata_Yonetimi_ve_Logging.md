# Hata Yönetimi & Logging Stratejisi

## 🚨 Genel Bakış

Production ortamında hataları yakalamak, loglamak ve izlemek için **Sentry** kullanılacak. Development'ta ise gelişmiş console logging sistemi olacak.

---

## 🛡 Sentry Entegrasyonu

### Setup

```bash
npm install @sentry/capacitor @sentry/browser
```

### Initialization

```typescript
// src/main.ts
import * as Sentry from '@sentry/capacitor';
import * as SentryBrowser from '@sentry/browser';

// Capacitor ve Browser entegrasyonu
Sentry.init(
  {
    dsn: 'YOUR_SENTRY_DSN',
    release: 'dodge-game@' + process.env.APP_VERSION,
    environment: process.env.NODE_ENV || 'development',
    
    // Production'da enable, development'ta disable
    enabled: process.env.NODE_ENV === 'production',
    
    // Sample rate (crash'lerin %100'ü gönderilsin)
    sampleRate: 1.0,
    
    // Performance monitoring
    tracesSampleRate: 0.2, // %20 transaction sample
    
    // Integrations
    integrations: [
      new SentryBrowser.BrowserTracing(),
      new SentryBrowser.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Session replay sample rate
    replaysSessionSampleRate: 0.1, // %10 normal session
    replaysOnErrorSampleRate: 1.0,  // %100 error'lu session
    
    // BeforeSend hook - sensitive data filtreleme
    beforeSend(event, hint) {
      // LocalStorage verilerini temizle
      if (event.contexts?.localStorage) {
        delete event.contexts.localStorage;
      }
      return event;
    },
  },
  SentryBrowser.init // Browser integration
);
```

---

## 📝 Logging Sistemi

### LogManager Implementation

```typescript
// src/systems/LogManager.ts

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  stackTrace?: string;
}

class LogManager {
  private static instance: LogManager;
  private logs: LogEntry[] = [];
  private maxLogs = 500; // Maximum log count in memory
  private currentLogLevel: LogLevel = LogLevel.INFO;
  
  static getInstance(): LogManager {
    if (!this.instance) {
      this.instance = new LogManager();
    }
    return this.instance;
  }

  init(isDevelopment: boolean): void {
    this.currentLogLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
    
    // Global error handler
    window.addEventListener('error', (event) => {
      this.error('GlobalError', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.error('UnhandledRejection', event.reason, {
        promise: event.promise
      });
    });
  }

  debug(category: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  info(category: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  warn(category: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  error(category: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, category, message, data);
    
    // Sentry'ye gönder
    Sentry.captureException(new Error(message), {
      tags: { category },
      extra: data
    });
  }

  critical(category: string, message: string, data?: any): void {
    this.log(LogLevel.CRITICAL, category, message, data);
    
    // Sentry'ye critical olarak işaretle
    Sentry.captureException(new Error(message), {
      level: 'fatal',
      tags: { category },
      extra: data
    });
  }

  private log(level: LogLevel, category: string, message: string, data?: any): void {
    if (level < this.currentLogLevel) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
      stackTrace: level >= LogLevel.ERROR ? new Error().stack : undefined
    };

    this.logs.push(entry);
    
    // Memory optimization
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    this.outputToConsole(entry);
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.category}]`;
    const style = this.getConsoleStyle(entry.level);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`%c${prefix}`, style, entry.message, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(`%c${prefix}`, style, entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(`%c${prefix}`, style, entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(`%c${prefix}`, style, entry.message, entry.data || '');
        if (entry.stackTrace) {
          console.error(entry.stackTrace);
        }
        break;
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'color: #888; font-weight: normal',
      [LogLevel.INFO]: 'color: #0066cc; font-weight: bold',
      [LogLevel.WARN]: 'color: #ff9900; font-weight: bold',
      [LogLevel.ERROR]: 'color: #cc0000; font-weight: bold',
      [LogLevel.CRITICAL]: 'color: #fff; background: #cc0000; font-weight: bold; padding: 2px 4px'
    };
    return styles[level];
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Get recent logs
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }
}

export default LogManager;
```

---

## 🎯 Kategoriler

Loglar kategorilendirilecek:

- **Game**: Oyun logic ile ilgili
- **Physics**: Fizik hesaplamaları
- **Input**: Kullanıcı input'ları
- **Storage**: LocalStorage işlemleri
- **Network**: API/Ad yükleme
- **Scene**: Scene transition'ları
- **Audio**: Ses sistemi
- **Haptic**: Titreşim feedback
- **Analytics**: Analytics eventleri
- **Ad**: Reklam işlemleri
- **Performance**: FPS, memory usage

---

## 📊 Kullanım Örnekleri

### Game Scene

```typescript
// src/scenes/GameScene.ts
import LogManager from '@systems/LogManager';

export default class GameScene extends Phaser.Scene {
  private logger = LogManager.getInstance();

  create(): void {
    this.logger.info('Game', 'GameScene created', {
      theme: this.theme.id,
      resolution: `${this.scale.width}x${this.scale.height}`
    });
  }

  checkCollision(): void {
    // Collision detection
    if (this.physics.overlap(this.player, this.obstacles)) {
      this.logger.warn('Game', 'Collision detected', {
        playerPos: { x: this.player.x, y: this.player.y },
        gameTime: this.gameTime,
        obstacleCount: this.obstacles.getLength()
      });
      
      this.gameOver();
    }
  }

  gameOver(): void {
    this.logger.info('Game', 'Game Over', {
      timeSurvived: this.gameTime,
      starsEarned: this.stars,
      obstaclesDodged: this.score
    });
  }
}
```

### Ad Manager

```typescript
// src/systems/AdManager.ts
import LogManager from './LogManager';
import * as Sentry from '@sentry/capacitor';

class AdManager {
  private logger = LogManager.getInstance();

  async showInterstitial(): Promise<void> {
    try {
      this.logger.debug('Ad', 'Attempting to show interstitial ad');
      
      await AdMob.showInterstitial();
      
      this.logger.info('Ad', 'Interstitial ad shown successfully');
      
    } catch (error) {
      this.logger.error('Ad', 'Failed to show interstitial', {
        error: error.message,
        code: error.code
      });
      
      // Sentry breadcrumb ekle
      Sentry.addBreadcrumb({
        category: 'ad',
        message: 'Interstitial ad failed',
        level: 'error',
        data: { error }
      });
    }
  }
}
```

### Storage Manager

```typescript
// src/systems/StorageManager.ts
import LogManager from './LogManager';

class StorageManager {
  private logger = LogManager.getInstance();

  saveGameData(data: GameData): void {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem('gameData', json);
      
      this.logger.debug('Storage', 'Game data saved', {
        dataSize: json.length,
        stars: data.totalStars
      });
      
    } catch (error) {
      this.logger.error('Storage', 'Failed to save game data', {
        error: error.message,
        data
      });
      
      // Quota exceeded hatası?
      if (error.name === 'QuotaExceededError') {
        this.logger.critical('Storage', 'LocalStorage quota exceeded');
        // Fallback: Eski verileri temizle
        this.clearOldData();
      }
    }
  }
}
```

---

## 🔍 Sentry Context Enrichment

```typescript
// Her oyun başladığında context set et
class GameScene extends Phaser.Scene {
  init(data: GameSceneData): void {
    Sentry.setContext('game', {
      theme: data.theme.id,
      totalGamesPlayed: StorageManager.getInstance().getTotalGames(),
      highScore: StorageManager.getInstance().getHighScore()
    });
    
    Sentry.setTag('theme', data.theme.id);
  }
}
```

---

## 📈 Performance Monitoring

```typescript
// src/systems/PerformanceMonitor.ts
import LogManager from './LogManager';
import * as Sentry from '@sentry/capacitor';

class PerformanceMonitor {
  private frameCount = 0;
  private lastFrameTime = 0;
  private fps = 60;
  private fpsHistory: number[] = [];

  update(time: number): void {
    this.frameCount++;
    
    if (time - this.lastFrameTime >= 1000) {
      this.fps = this.frameCount;
      this.fpsHistory.push(this.fps);
      
      // FPS düşükse logla
      if (this.fps < 55) {
        LogManager.getInstance().warn('Performance', 'Low FPS detected', {
          fps: this.fps,
          avgFps: this.getAverageFPS()
        });
        
        // Sentry'ye performance breadcrumb
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `Low FPS: ${this.fps}`,
          level: 'warning',
          data: { fps: this.fps }
        });
      }
      
      this.frameCount = 0;
      this.lastFrameTime = time;
      
      // Keep last 60 seconds
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
    }
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }
}
```

---

## 🚨 Error Boundaries

```typescript
// Global try-catch wrapper for critical functions
function withErrorHandler<T extends (...args: any[]) => any>(
  fn: T,
  category: string
): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      LogManager.getInstance().error(category, 'Function execution failed', {
        functionName: fn.name,
        error: error.message,
        args
      });
      throw error; // Re-throw after logging
    }
  }) as T;
}

// Kullanım
const safeGameOver = withErrorHandler(this.gameOver.bind(this), 'Game');
```

---

## 📊 Sentry Dashboard Alerts

### Critical Alerts (Slack/Email)
- Crash rate > 1%
- Error rate > 5%
- Response time > 3 seconds
- Fatal errors (any)

### Warning Alerts
- FPS < 55 (10+ users)
- LocalStorage quota exceeded
- Ad load failures > 20%

---

## 🔐 Privacy & Data Retention

- **Personal Data**: Sentry'de kişisel veri gönderme
- **IP Anonymization**: IP adresleri anonimleştirilsin
- **Data Retention**: 90 gün log tutma
- **GDPR Compliance**: Kullanıcı isterse verilerini sil

```typescript
// Sentry config
beforeSend(event) {
  // Remove sensitive data
  if (event.user?.email) {
    delete event.user.email;
  }
  if (event.user?.ip_address) {
    event.user.ip_address = '0.0.0.0';
  }
  return event;
}
```

---

Bu strateji ile production'daki tüm hatalar yakalanır, loglanır ve hızlıca çözülebilir! 🛡️
