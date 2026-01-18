import Phaser from 'phaser';
import type { ObstacleType } from '../types/GameTypes';

/**
 * Obstacle - Enemy objects that move in various directions
 * Supports multi-directional movement and object pooling
 */
export default class Obstacle extends Phaser.GameObjects.Sprite {
    private speed: number = 200;
    private direction: number = 0; // Angle in degrees
    private obstacleType: ObstacleType = 'meteor';
    public active: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Start with placeholder texture
        super(scene, x, y, 'obstacle_meteor');

        // Add to scene
        scene.add.existing(this);

        // Setup physics
        scene.physics.add.existing(this);

        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setCircle(48 / 2); // Will match sprite size
        }

        this.setDisplaySize(48, 48);
        this.setOrigin(0.5);
        this.setActive(false);
        this.setVisible(false);
    }

    /**
     * Initialize/Reset obstacle with new parameters
     */
    reset(
        x: number,
        y: number,
        speed: number,
        direction: number,
        type: ObstacleType = 'meteor'
    ): void {
        this.setPosition(x, y);
        this.speed = speed;
        this.direction = direction;
        this.obstacleType = type;
        this.active = true;

        // Set texture based on type (will use AI-generated sprites later)
        this.setTexture(`obstacle_${type}`);

        // Calculate velocity from direction
        const radians = Phaser.Math.DegToRad(direction);
        const vx = Math.cos(radians) * speed;
        const vy = Math.sin(radians) * speed;

        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(vx, vy);
        }

        this.setActive(true);
        this.setVisible(true);
        this.setAlpha(1);

        // Rotate sprite to face direction
        this.setRotation(radians);
    }

    /**
     * Update obstacle (called from scene)
     */
    update(delta: number): void {
        if (!this.active) return;

        // Check if off-screen (any edge)
        const bounds = this.scene.scale;
        const margin = 100;

        if (
            this.x < -margin ||
            this.x > bounds.width + margin ||
            this.y < -margin ||
            this.y > bounds.height + margin
        ) {
            this.deactivate();
        }
    }

    /**
     * Deactivate obstacle (return to pool)
     */
    deactivate(): void {
        this.active = false;
        this.setActive(false);
        this.setVisible(false);

        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(0, 0);
        }
    }

    /**
     * Get obstacle type
     */
    getObstacleType(): ObstacleType {
        return this.obstacleType;
    }

    /**
     * Override destroy to ensure cleanup
     */
    destroy(fromScene?: boolean): void {
        this.active = false;
        super.destroy(fromScene);
    }

    /**
     * Create placeholder textures (static method, call once)
     */
    static createPlaceholderTextures(scene: Phaser.Scene): void {
        const types: ObstacleType[] = ['meteor', 'spike', 'electric'];
        const colors = {
            meteor: 0xff4444,
            spike: 0xf06292,
            electric: 0x00d4ff,
        };

        types.forEach(type => {
            const graphics = scene.add.graphics();
            graphics.fillStyle(colors[type], 1);
            graphics.fillCircle(24, 24, 20);

            // Add some detail based on type
            if (type === 'spike') {
                graphics.lineStyle(2, 0x6a1b9a);
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    const x1 = 24 + Math.cos(angle) * 15;
                    const y1 = 24 + Math.sin(angle) * 15;
                    const x2 = 24 + Math.cos(angle) * 24;
                    const y2 = 24 + Math.sin(angle) * 24;
                    graphics.lineBetween(x1, y1, x2, y2);
                }
            } else if (type === 'electric') {
                graphics.lineStyle(2, 0xffffff, 0.8);
                graphics.strokeCircle(24, 24, 15);
            }

            graphics.generateTexture(`obstacle_${type}`, 48, 48);
            graphics.destroy();
        });
    }
}
