import Phaser from 'phaser';
import Obstacle from '@entities/Obstacle';
import type { ObstacleType } from '../types/GameTypes';
import { GAME_WIDTH, GAME_HEIGHT, MAX_ACTIVE_OBSTACLES } from '@config/Constants';

/**
 * ObstacleSpawner - Manages obstacle spawning and difficulty
 * Handles multi-directional spawn patterns
 */
export default class ObstacleSpawner {
    private scene: Phaser.Scene;
    private obstacles: Phaser.GameObjects.Group;
    private spawnTimer: number = 0;
    private nextSpawnDelay: number = 1500;
    private gameTime: number = 0;

    constructor(scene: Phaser.Scene, obstaclesGroup: Phaser.GameObjects.Group) {
        this.scene = scene;
        this.obstacles = obstaclesGroup;
    }

    /**
     * Reset spawner state
     */
    reset(): void {
        this.spawnTimer = 0;
        this.nextSpawnDelay = 1500;
        this.gameTime = 0;
    }

    /**
     * Update spawner (call from scene update)
     */
    update(delta: number, currentGameTime: number): void {
        this.gameTime = currentGameTime;
        this.spawnTimer += delta;

        if (this.spawnTimer >= this.nextSpawnDelay) {
            this.spawn();
            this.spawnTimer = 0;
            this.calculateNextSpawnDelay();
        }
    }

    /**
     * Spawn a new obstacle
     */
    private spawn(): void {
        // Check if we've hit the max
        const activeCount = this.obstacles.getChildren().filter((child: any) => child.active).length;
        if (activeCount >= MAX_ACTIVE_OBSTACLES) {
            return;
        }

        // Get or create obstacle from pool
        let obstacle = this.obstacles.getFirstDead(false) as Obstacle;

        if (!obstacle) {
            obstacle = new Obstacle(this.scene, 0, 0);
            this.obstacles.add(obstacle);
        }

        // Calculate spawn position and direction based on edge
        const spawnData = this.calculateSpawnData();

        // Calculate speed based on game time (difficulty scaling)
        const baseSpeed = 200;
        const speed = baseSpeed + this.gameTime * 2;

        // Random obstacle type
        const types: ObstacleType[] = ['meteor', 'spike', 'electric'];
        const type = Phaser.Utils.Array.GetRandom(types) as ObstacleType;

        // Activate obstacle
        obstacle.reset(spawnData.x, spawnData.y, speed, spawnData.direction, type);
    }

    /**
     * Calculate spawn position and direction
     * Returns data for spawning from random edge
     */
    private calculateSpawnData(): { x: number; y: number; direction: number } {
        // Random edge: 0=top, 1=right, 2=bottom, 3=left
        const edge = Phaser.Math.Between(0, 3);
        let x = 0;
        let y = 0;
        let direction = 0;

        const margin = 50;

        switch (edge) {
            case 0: // Top edge - spawn above, move downward
                x = Phaser.Math.Between(0, GAME_WIDTH);
                y = -margin;
                direction = Phaser.Math.Between(45, 135); // 45-135 degrees (downward)
                break;

            case 1: // Right edge - spawn right, move leftward
                x = GAME_WIDTH + margin;
                y = Phaser.Math.Between(0, GAME_HEIGHT);
                direction = Phaser.Math.Between(135, 225); // 135-225 degrees (leftward)
                break;

            case 2: // Bottom edge - spawn below, move upward
                x = Phaser.Math.Between(0, GAME_WIDTH);
                y = GAME_HEIGHT + margin;
                direction = Phaser.Math.Between(225, 315); // 225-315 degrees (upward)
                break;

            case 3: // Left edge - spawn left, move rightward
                x = -margin;
                y = Phaser.Math.Between(0, GAME_HEIGHT);
                direction = Phaser.Math.Between(-45, 45); // -45 to 45 degrees (rightward)
                break;
        }

        return { x, y, direction };
    }

    /**
     * Calculate next spawn delay based on difficulty curve
     */
    private calculateNextSpawnDelay(): void {
        const maxDelay = 1500; // Start delay
        const minDelay = 300; // Minimum delay (hardest)

        // Linear difficulty increase: subtract 10ms per second of game time
        this.nextSpawnDelay = Math.max(minDelay, maxDelay - this.gameTime * 10);
    }

    /**
     * Get current spawn delay (for debugging/UI)
     */
    getCurrentSpawnDelay(): number {
        return this.nextSpawnDelay;
    }

    /**
     * Get active obstacles count
     */
    getActiveCount(): number {
        return this.obstacles.getChildren().filter((child: any) => child.active).length;
    }
}
