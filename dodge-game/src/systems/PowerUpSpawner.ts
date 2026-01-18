import Phaser from 'phaser';
import PowerUp from '@entities/PowerUp';
import type { PowerUpType } from '../types/GameTypes';
import { GAME_WIDTH, GAME_HEIGHT, POWERUP_SPAWN_INTERVAL } from '@config/Constants';

/**
 * PowerUpSpawner - Manages power-up spawning
 * Spawns random power-ups at regular intervals
 */
export default class PowerUpSpawner {
    private scene: Phaser.Scene;
    private powerUps: Phaser.GameObjects.Group;
    private spawnTimer: number = 0;
    private spawnInterval: number = POWERUP_SPAWN_INTERVAL;
    private maxActivePowerUps: number = 3;

    constructor(scene: Phaser.Scene, powerUpsGroup: Phaser.GameObjects.Group) {
        this.scene = scene;
        this.powerUps = powerUpsGroup;
    }

    /**
     * Reset spawner state
     */
    reset(): void {
        this.spawnTimer = 0;
    }

    /**
     * Update spawner (call from scene update)
     */
    update(delta: number): void {
        this.spawnTimer += delta;

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn();
            this.spawnTimer = 0;
        }
    }

    /**
     * Spawn a new power-up
     */
    private spawn(): void {
        // Check if we've hit the max
        const activeCount = this.powerUps.getChildren().filter((child: any) => child.active).length;
        if (activeCount >= this.maxActivePowerUps) {
            return;
        }

        // Get or create power-up from pool
        let powerUp = this.powerUps.getFirstDead(false) as PowerUp;

        if (!powerUp) {
            powerUp = new PowerUp(this.scene, 0, 0);
            this.powerUps.add(powerUp);
        }

        // Random position (center area, avoid edges)
        const margin = 80;
        const x = Phaser.Math.Between(margin, GAME_WIDTH - margin);
        const y = Phaser.Math.Between(margin + 100, GAME_HEIGHT - margin - 100);

        // Random power-up type
        const types: PowerUpType[] = ['shield', 'slowmo', 'double_score'];
        const type = Phaser.Utils.Array.GetRandom(types) as PowerUpType;

        // Spawn power-up
        powerUp.reset(x, y, type);
    }

    /**
     * Get active power-ups count
     */
    getActiveCount(): number {
        return this.powerUps.getChildren().filter((child: any) => child.active).length;
    }

    /**
     * Clear all power-ups
     */
    clearAll(): void {
        this.powerUps.getChildren().forEach(child => {
            const powerUp = child as PowerUp;
            powerUp.deactivate();
        });
    }
}
