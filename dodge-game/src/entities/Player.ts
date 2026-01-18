import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_SIZE } from '@config/Constants';

/**
 * Player - Main player character
 * Supports 360° movement with physics
 */
export default class Player extends Phaser.GameObjects.Sprite {
    private speed: number;
    private hasShield: boolean = false;
    private shieldGraphic?: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'player') {
        super(scene, x, y, texture);

        this.speed = PLAYER_SPEED;

        // Add to scene
        scene.add.existing(this);

        // Setup physics
        scene.physics.add.existing(this);

        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setCollideWorldBounds(true);
            body.setCircle(PLAYER_SIZE / 2); // Circular hitbox for better feel
            body.setDamping(true);
            body.setDrag(0.8); // Smooth movement
        }

        // Set size and origin
        this.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE);
        this.setOrigin(0.5);

        // Create placeholder visual (will be replaced with AI-generated sprite)
        this.createPlaceholderGraphic();
    }

    /**
     * Move player in specified direction
     * @param directionX - X direction (-1 to 1)
     * @param directionY - Y direction (-1 to 1)
     */
    move(directionX: number, directionY: number): void {
        if (!this.body) return;

        const body = this.body as Phaser.Physics.Arcade.Body;

        // Normalize diagonal movement
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        if (magnitude > 0) {
            directionX /= magnitude;
            directionY /= magnitude;
        }

        body.setVelocity(directionX * this.speed, directionY * this.speed);
    }

    /**
     * Set velocity directly
     */
    setVelocity(vx: number, vy: number): void {
        if (!this.body) return;
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(vx, vy);
    }

    /**
   * Stop player movement
   */
    stop(): this {
        if (!this.body) return this;
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
        return this;
    }

    /**
     * Reset player to initial state
     */
    reset(): void {
        this.stop();
        this.hasShield = false;
        if (this.shieldGraphic) {
            this.shieldGraphic.destroy();
            this.shieldGraphic = undefined;
        }
        this.setAlpha(1);
    }

    /**
     * Activate shield power-up
     */
    activateShield(): void {
        this.hasShield = true;
        this.createShieldVisual();
    }

    /**
     * Deactivate shield
     */
    deactivateShield(): void {
        this.hasShield = false;
        if (this.shieldGraphic) {
            this.shieldGraphic.destroy();
            this.shieldGraphic = undefined;
        }
    }

    /**
     * Check if player has shield active
     */
    getHasShield(): boolean {
        return this.hasShield;
    }

    /**
     * Create placeholder graphic (temporary until AI sprites are ready)
     */
    private createPlaceholderGraphic(): void {
        // This will be replaced with actual sprite texture
        // For now, draw a simple circle
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x00ff88, 1);
        graphics.fillCircle(0, 0, PLAYER_SIZE / 2);

        // Generate texture from graphics
        graphics.generateTexture('player', PLAYER_SIZE, PLAYER_SIZE);
        graphics.destroy();

        // Apply texture
        this.setTexture('player');
    }

    /**
     * Create shield visual effect
     */
    private createShieldVisual(): void {
        if (this.shieldGraphic) {
            this.shieldGraphic.destroy();
        }

        this.shieldGraphic = this.scene.add.graphics();
        this.shieldGraphic.lineStyle(3, 0x4fc3f7, 0.8);
        this.shieldGraphic.strokeCircle(this.x, this.y, PLAYER_SIZE / 2 + 10);

        // Animate shield
        this.scene.tweens.add({
            targets: this.shieldGraphic,
            alpha: { from: 0.8, to: 0.4 },
            duration: 500,
            yoyo: true,
            repeat: -1,
        });
    }

    /**
     * Update shield position (call in scene update)
     */
    updateShield(): void {
        if (this.shieldGraphic && this.hasShield) {
            this.shieldGraphic.clear();
            this.shieldGraphic.lineStyle(3, 0x4fc3f7, 0.8);
            this.shieldGraphic.strokeCircle(this.x, this.y, PLAYER_SIZE / 2 + 10);
        }
    }

    /**
     * Override destroy to clean up shield
     */
    destroy(fromScene?: boolean): void {
        if (this.shieldGraphic) {
            this.shieldGraphic.destroy();
        }
        super.destroy(fromScene);
    }
}
