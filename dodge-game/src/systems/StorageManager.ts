import type { GameData, Settings } from '../types/GameTypes';

/**
 * StorageManager - LocalStorage wrapper with type safety
 * Singleton pattern for managing game data persistence
 */
class StorageManager {
    private static instance: StorageManager;
    private readonly STORAGE_KEY = 'dodge_game_data';

    private defaultGameData: GameData = {
        highScore: 0,
        totalStars: 0,
        unlockedThemes: ['classic'], // Classic theme is unlocked by default
        currentTheme: 'classic',
        totalGamesPlayed: 0,
        settings: {
            soundEnabled: true,
            hapticEnabled: true,
            darkMode: true,
            colorBlindMode: 'none',
            visualFeedbackEnabled: false,
            fontSize: 'medium',
        },
    };

    private constructor() {
        // Private constructor for singleton
    }

    /**
     * Get singleton instance
     */
    static getInstance(): StorageManager {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    }

    /**
     * Save game data to LocalStorage
     */
    saveGameData(data: GameData): void {
        try {
            const json = JSON.stringify(data);
            localStorage.setItem(this.STORAGE_KEY, json);
        } catch (error) {
            console.error('Failed to save game data:', error);

            // Handle quota exceeded error
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                console.warn('LocalStorage quota exceeded. Clearing old data...');
                this.resetGameData();
            }
        }
    }

    /**
     * Load game data from LocalStorage
     */
    loadGameData(): GameData {
        try {
            const json = localStorage.getItem(this.STORAGE_KEY);

            if (!json) {
                // No saved data, return default
                return { ...this.defaultGameData };
            }

            const data = JSON.parse(json) as GameData;

            // Merge with default data to handle new fields
            return {
                ...this.defaultGameData,
                ...data,
                settings: {
                    ...this.defaultGameData.settings,
                    ...data.settings,
                },
            };
        } catch (error) {
            console.error('Failed to load game data:', error);
            return { ...this.defaultGameData };
        }
    }

    /**
     * Reset all game data to defaults
     */
    resetGameData(): void {
        this.saveGameData({ ...this.defaultGameData });
    }

    /**
     * Get current high score
     */
    getHighScore(): number {
        return this.loadGameData().highScore;
    }

    /**
     * Get total stars earned
     */
    getTotalStars(): number {
        return this.loadGameData().totalStars;
    }

    /**
     * Get total games played
     */
    getTotalGamesPlayed(): number {
        return this.loadGameData().totalGamesPlayed;
    }

    /**
     * Update high score if new score is higher
     */
    updateHighScore(score: number): boolean {
        const data = this.loadGameData();
        if (score > data.highScore) {
            data.highScore = score;
            this.saveGameData(data);
            return true;
        }
        return false;
    }

    /**
     * Add stars to total
     */
    addStars(amount: number): number {
        const data = this.loadGameData();
        data.totalStars += amount;
        this.saveGameData(data);
        return data.totalStars;
    }

    /**
     * Increment total games played
     */
    incrementGamesPlayed(): number {
        const data = this.loadGameData();
        data.totalGamesPlayed += 1;
        this.saveGameData(data);
        return data.totalGamesPlayed;
    }

    /**
     * Get current settings
     */
    getSettings(): Settings {
        return this.loadGameData().settings;
    }

    /**
     * Update settings
     */
    updateSettings(settings: Partial<Settings>): void {
        const data = this.loadGameData();
        data.settings = {
            ...data.settings,
            ...settings,
        };
        this.saveGameData(data);
    }

    /**
     * Check if theme is unlocked
     */
    isThemeUnlocked(themeId: string): boolean {
        const data = this.loadGameData();
        return data.unlockedThemes.includes(themeId);
    }

    /**
     * Unlock a theme
     */
    unlockTheme(themeId: string, cost: number): boolean {
        const data = this.loadGameData();

        // Check if already unlocked
        if (data.unlockedThemes.includes(themeId)) {
            return false;
        }

        // Check if enough stars
        if (data.totalStars < cost) {
            return false;
        }

        // Deduct stars and unlock theme
        data.totalStars -= cost;
        data.unlockedThemes.push(themeId);
        this.saveGameData(data);
        return true;
    }

    /**
     * Set current theme
     */
    setCurrentTheme(themeId: string): void {
        const data = this.loadGameData();
        data.currentTheme = themeId;
        this.saveGameData(data);
    }

    /**
     * Get current theme
     */
    getCurrentTheme(): string {
        return this.loadGameData().currentTheme;
    }
}

export default StorageManager;
