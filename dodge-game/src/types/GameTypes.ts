// Game Data Types

export interface GameData {
    highScore: number;
    totalStars: number;
    unlockedThemes: string[];
    currentTheme: string;
    settings: Settings;
    totalGamesPlayed: number;
    lastSyncedAt?: number;
}

export interface Settings {
    soundEnabled: boolean;
    hapticEnabled: boolean;
    darkMode: boolean;
    colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    visualFeedbackEnabled?: boolean;
    fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
    unlocked: boolean;
    cost: number;
}

export interface ThemeColors {
    bg: string;
    player: string;
    obstacle: string;
    powerup?: string;
    ui?: string;
}

export type SceneKey = 'Boot' | 'Menu' | 'Game' | 'Result' | 'Settings';

export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
}

export type PowerUpType = 'shield' | 'slowmo' | 'double_score';

export type ObstacleType = 'meteor' | 'spike' | 'electric';

export interface PowerUp {
    type: PowerUpType;
    active: boolean;
    duration: number;
    timeRemaining: number;
}
