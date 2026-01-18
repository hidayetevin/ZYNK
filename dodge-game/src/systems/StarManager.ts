import StorageManager from './StorageManager';
import { STAR_THRESHOLDS } from '@config/Constants';

/**
 * StarManager - Manages star calculation and economy
 * Static utility class for star-related operations
 */
class StarManager {
    /**
     * Calculate stars earned based on time survived
     * @param timeSeconds - Time survived in seconds
     * @returns Number of stars (0-3)
     */
    static calculateStars(timeSeconds: number): number {
        if (timeSeconds >= STAR_THRESHOLDS.THREE_STAR) return 3;
        if (timeSeconds >= STAR_THRESHOLDS.TWO_STAR) return 2;
        if (timeSeconds >= STAR_THRESHOLDS.ONE_STAR) return 1;
        return 0;
    }

    /**
     * Add stars to total
     * @param amount - Number of stars to add
     * @returns New total stars
     */
    static addStars(amount: number): number {
        const storage = StorageManager.getInstance();
        return storage.addStars(amount);
    }

    /**
     * Get total stars earned
     * @returns Total stars
     */
    static getTotalStars(): number {
        const storage = StorageManager.getInstance();
        return storage.getTotalStars();
    }

    /**
     * Check if user can unlock theme with current stars
     * @param themeCost - Cost of theme in stars
     * @returns True if enough stars available
     */
    static canUnlockTheme(themeCost: number): boolean {
        const totalStars = this.getTotalStars();
        return totalStars >= themeCost;
    }

    /**
     * Unlock theme by spending stars
     * @param themeId - Theme ID to unlock
     * @param themeCost - Cost in stars
     * @returns True if successful
     */
    static unlockTheme(themeId: string, themeCost: number): boolean {
        const storage = StorageManager.getInstance();
        return storage.unlockTheme(themeId, themeCost);
    }

    /**
     * Get star thresholds for display
     * @returns Object with threshold values
     */
    static getStarThresholds(): { oneStar: number; twoStar: number; threeStar: number } {
        return {
            oneStar: STAR_THRESHOLDS.ONE_STAR,
            twoStar: STAR_THRESHOLDS.TWO_STAR,
            threeStar: STAR_THRESHOLDS.THREE_STAR,
        };
    }

    /**
     * Calculate stars needed for next threshold
     * @param currentTime - Current survival time
     * @returns Seconds needed for next star, or null if max stars
     */
    static timeToNextStar(currentTime: number): number | null {
        if (currentTime < STAR_THRESHOLDS.ONE_STAR) {
            return STAR_THRESHOLDS.ONE_STAR - currentTime;
        }
        if (currentTime < STAR_THRESHOLDS.TWO_STAR) {
            return STAR_THRESHOLDS.TWO_STAR - currentTime;
        }
        if (currentTime < STAR_THRESHOLDS.THREE_STAR) {
            return STAR_THRESHOLDS.THREE_STAR - currentTime;
        }
        return null; // Already at max stars
    }

    /**
     * Get star progress percentage
     * @param currentTime - Current survival time
     * @returns Progress to next star (0-1)
     */
    static getStarProgress(currentTime: number): number {
        const currentStars = this.calculateStars(currentTime);

        if (currentStars === 0) {
            return currentTime / STAR_THRESHOLDS.ONE_STAR;
        }
        if (currentStars === 1) {
            return (
                (currentTime - STAR_THRESHOLDS.ONE_STAR) /
                (STAR_THRESHOLDS.TWO_STAR - STAR_THRESHOLDS.ONE_STAR)
            );
        }
        if (currentStars === 2) {
            return (
                (currentTime - STAR_THRESHOLDS.TWO_STAR) /
                (STAR_THRESHOLDS.THREE_STAR - STAR_THRESHOLDS.TWO_STAR)
            );
        }

        return 1.0; // Max stars reached
    }

    /**
     * Format star display string
     * @param stars - Number of stars (0-3)
     * @returns Formatted string with star emojis
     */
    static formatStars(stars: number): string {
        const filledStar = '⭐';
        const emptyStar = '☆';

        let result = '';
        for (let i = 0; i < 3; i++) {
            result += i < stars ? filledStar : emptyStar;
        }
        return result;
    }

    /**
     * Get star economy info
     * @returns Economy stats
     */
    static getStarEconomyInfo(): {
        totalEarned: number;
        averagePerGame: number;
        gamesPlayed: number;
    } {
        const storage = StorageManager.getInstance();
        const data = storage.loadGameData();

        const averagePerGame = data.totalGamesPlayed > 0 ? data.totalStars / data.totalGamesPlayed : 0;

        return {
            totalEarned: data.totalStars,
            averagePerGame: Number(averagePerGame.toFixed(2)),
            gamesPlayed: data.totalGamesPlayed,
        };
    }
}

export default StarManager;
