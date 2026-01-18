/**
 * DifficultyManager - Manages dynamic difficulty scaling
 * Provides difficulty multipliers and scaling formulas
 */
class DifficultyManager {
    private static instance: DifficultyManager;

    private constructor() {
        // Singleton
    }

    /**
     * Get singleton instance
     */
    static getInstance(): DifficultyManager {
        if (!DifficultyManager.instance) {
            DifficultyManager.instance = new DifficultyManager();
        }
        return DifficultyManager.instance;
    }

    /**
     * Get obstacle speed based on base speed and game time
     * @param baseSpeed - Base obstacle speed (default 200)
     * @param gameTime - Current game time in seconds
     * @returns Scaled speed
     */
    getObstacleSpeed(baseSpeed: number, gameTime: number): number {
        // Linear speed increase: +2 pixels/second per game second
        const speed = baseSpeed + gameTime * 2;

        // Cap at reasonable maximum (60 seconds worth)
        const maxSpeed = baseSpeed + 120; // +2 * 60
        return Math.min(speed, maxSpeed);
    }

    /**
     * Get spawn delay based on game time
     * @param gameTime - Current game time in seconds
     * @returns Delay in milliseconds
     */
    getSpawnDelay(gameTime: number): number {
        const maxDelay = 1500; // Starting delay (easy)
        const minDelay = 300; // Minimum delay (hard)

        // Linear decrease: -10ms per game second
        const delay = maxDelay - gameTime * 10;

        return Math.max(minDelay, delay);
    }

    /**
     * Get difficulty multiplier for current game time
     * @param gameTime - Current game time in seconds
     * @returns Multiplier (0-1 scale: 0=easy, 1=hardest)
     */
    getDifficultyMultiplier(gameTime: number): number {
        // Normalize to 0-1 based on expected max survival time (60s)
        const maxTime = 60;
        const multiplier = Math.min(gameTime / maxTime, 1.0);

        return multiplier;
    }

    /**
     * Get difficulty tier based on game time
     * @param gameTime - Current game time in seconds
     * @returns 'easy' | 'medium' | 'hard'
     */
    getDifficultyTier(gameTime: number): 'easy' | 'medium' | 'hard' {
        if (gameTime < 10) return 'easy';
        if (gameTime < 30) return 'medium';
        return 'hard';
    }

    /**
     * Check if game time qualifies for star reward
     * @param gameTime - Current game time in seconds
     * @param starLevel - Star level to check (1, 2, or 3)
     * @returns True if time qualifies
     */
    qualifiesForStar(gameTime: number, starLevel: 1 | 2 | 3): boolean {
        const thresholds = {
            1: 10, // 1 star at 10+ seconds
            2: 20, // 2 stars at 20+ seconds
            3: 40, // 3 stars at 40+ seconds
        };

        return gameTime >= thresholds[starLevel];
    }

    /**
     * Get spawn rate (obstacles per second)
     * @param gameTime - Current game time in seconds
     * @returns Obstacles per second
     */
    getSpawnRate(gameTime: number): number {
        const delay = this.getSpawnDelay(gameTime);
        const rate = 1000 / delay; // Convert delay to rate
        return Number(rate.toFixed(2));
    }

    /**
     * Get difficulty stats for display
     * @param gameTime - Current game time in seconds
     */
    getDifficultyStats(gameTime: number): {
        tier: string;
        multiplier: number;
        spawnRate: number;
        speedMultiplier: number;
    } {
        const tier = this.getDifficultyTier(gameTime);
        const multiplier = this.getDifficultyMultiplier(gameTime);
        const spawnRate = this.getSpawnRate(gameTime);
        const baseSpeed = 200;
        const currentSpeed = this.getObstacleSpeed(baseSpeed, gameTime);
        const speedMultiplier = Number((currentSpeed / baseSpeed).toFixed(2));

        return {
            tier,
            multiplier,
            spawnRate,
            speedMultiplier,
        };
    }
}

export default DifficultyManager;
