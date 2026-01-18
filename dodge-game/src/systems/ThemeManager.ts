import type { Theme } from '../types/GameTypes';
import StorageManager from './StorageManager';

/**
 * ThemeManager - Manages game themes and unlocking
 * Singleton pattern
 */
class ThemeManager {
    private static instance: ThemeManager;
    private themes: Theme[] = [];

    private constructor() {
        this.initializeThemes();
    }

    /**
     * Get singleton instance
     */
    static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    /**
     * Initialize default themes
     */
    private initializeThemes(): void {
        this.themes = [
            {
                id: 'classic',
                name: 'Classic',
                colors: {
                    bg: '#1a1a2e',
                    player: '#00ff88',
                    obstacle: '#ff0055',
                    powerup: '#ffdd00',
                    ui: '#ffffff',
                },
                unlocked: true,
                cost: 0,
            },
            {
                id: 'ocean',
                name: 'Ocean',
                colors: {
                    bg: '#0a1929',
                    player: '#4fc3f7',
                    obstacle: '#f06292',
                    powerup: '#26c6da',
                    ui: '#e1f5fe',
                },
                unlocked: false,
                cost: 5,
            },
            {
                id: 'sunset',
                name: 'Sunset',
                colors: {
                    bg: '#1a0a29',
                    player: '#ffb74d',
                    obstacle: '#ba68c8',
                    powerup: '#ffd54f',
                    ui: '#fff3e0',
                },
                unlocked: false,
                cost: 10,
            },
            {
                id: 'forest',
                name: 'Forest',
                colors: {
                    bg: '#0d1f0d',
                    player: '#66bb6a',
                    obstacle: '#ef5350',
                    powerup: '#aed581',
                    ui: '#e8f5e9',
                },
                unlocked: false,
                cost: 15,
            },
            {
                id: 'neon',
                name: 'Neon',
                colors: {
                    bg: '#0a0a0a',
                    player: '#00ffff',
                    obstacle: '#ff00ff',
                    powerup: '#ffff00',
                    ui: '#ffffff',
                },
                unlocked: false,
                cost: 20,
            },
        ];

        // Sync unlocked status with storage
        this.syncWithStorage();
    }

    /**
     * Sync themes with storage data
     */
    private syncWithStorage(): void {
        const storage = StorageManager.getInstance();
        const unlockedThemes = storage.loadGameData().unlockedThemes;

        this.themes.forEach(theme => {
            if (unlockedThemes.includes(theme.id)) {
                theme.unlocked = true;
            }
        });
    }

    /**
     * Get all themes
     */
    getAllThemes(): Theme[] {
        // Always sync before returning
        this.syncWithStorage();
        return [...this.themes];
    }

    /**
     * Get theme by ID
     */
    getTheme(id: string): Theme | undefined {
        this.syncWithStorage();
        return this.themes.find(theme => theme.id === id);
    }

    /**
     * Get current theme
     */
    getCurrentTheme(): Theme {
        const storage = StorageManager.getInstance();
        const currentThemeId = storage.getCurrentTheme();
        const theme = this.getTheme(currentThemeId);

        // Fallback to classic if theme not found
        return theme || this.themes[0];
    }

    /**
     * Set current theme (must be unlocked)
     */
    setCurrentTheme(id: string): boolean {
        const theme = this.getTheme(id);

        if (!theme) {
            console.warn(`Theme ${id} not found`);
            return false;
        }

        if (!theme.unlocked) {
            console.warn(`Theme ${id} is locked`);
            return false;
        }

        const storage = StorageManager.getInstance();
        storage.setCurrentTheme(id);
        return true;
    }

    /**
     * Check if theme is unlocked
     */
    isThemeUnlocked(id: string): boolean {
        const storage = StorageManager.getInstance();
        return storage.isThemeUnlocked(id);
    }

    /**
     * Unlock theme with stars
     */
    unlockTheme(id: string): boolean {
        const theme = this.getTheme(id);

        if (!theme) {
            console.warn(`Theme ${id} not found`);
            return false;
        }

        if (theme.unlocked) {
            console.warn(`Theme ${id} already unlocked`);
            return false;
        }

        const storage = StorageManager.getInstance();
        const totalStars = storage.getTotalStars();

        if (totalStars < theme.cost) {
            console.warn(`Not enough stars. Need ${theme.cost}, have ${totalStars}`);
            return false;
        }

        // Unlock in storage
        const success = storage.unlockTheme(id, theme.cost);

        if (success) {
            // Update local theme data
            theme.unlocked = true;
            console.log(`Theme ${id} unlocked!`);
        }

        return success;
    }

    /**
     * Get locked themes count
     */
    getLockedThemesCount(): number {
        return this.themes.filter(theme => !theme.unlocked).length;
    }

    /**
     * Get unlocked themes count
     */
    getUnlockedThemesCount(): number {
        return this.themes.filter(theme => theme.unlocked).length;
    }

    /**
     * Get next theme to unlock
     */
    getNextThemeToUnlock(): Theme | null {
        const locked = this.themes.filter(theme => !theme.unlocked);
        if (locked.length === 0) return null;

        // Return cheapest locked theme
        return locked.reduce((prev, current) => (prev.cost < current.cost ? prev : current));
    }
}

export default ThemeManager;
