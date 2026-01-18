import Phaser from 'phaser';
import type { PowerUpType } from '../types/GameTypes';

/**
 * PowerUp - Collectible power-up items
 * Types: shield, slowmo, double_score
 */
export default class PowerUp extends Phaser.GameObjects.Sprite {
    private powerUpType: PowerUpType = 'shield';
    public active: boolean = false;
    private floatTween?: Phaser.Tweens.Tween;
    private rotateTween?: Phaser.Tweens.Tween;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'powerup_shield');

        // Add to scene
        scene.add.existing(this);

        // Setup physics
        scene.physics.add.existing(this);

        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setCircle(40 / 2); // 40px power-up size
        }

        this.setDisplaySize(40, 40);
        this.setOrigin(0.5);
        this.setActive(false);
        this.setVisible(false);
    }

    /**
     * Initialize/Reset power-up
     */
    reset(x: number, y: number, type: PowerUpType): void {
        this.setPosition(x, y);
        this.powerUpType = type;
        this.active = true;

        // Set texture based on type
        this.setTexture(`powerup_${type}`);

        this.setActive(true);
        this.setVisible(true);
        this.setAlpha(1);
        this.setScale(1);

        // Start floating animation
        this.startFloatAnimation();

        // Start rotation
        this.startRotationAnimation();
    }

    /**
     * Start floating animation (bob up and down)
     */
    private startFloatAnimation(): void {
        if (this.floatTween) {
            this.floatTween.destroy();
        }

        this.floatTween = this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    /**
     * Start rotation animation
     */
    private startRotationAnimation(): void {
        if (this.rotateTween) {
            this.rotateTween.destroy();
        }

        this.rotateTween = this.scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 2000,
            repeat: -1,
            ease: 'Linear',
        });
    }

    /**
     * Collect animation (called before deactivation)
     */
    collect(onComplete?: () => void): void {
        // Stop animations
        if (this.floatTween) {
            this.floatTween.destroy();
            this.floatTween = undefined;
        }
        if (this.rotateTween) {
            this.rotateTween.destroy();
            this.rotateTween = undefined;
        }

        // Scale up and fade out
        this.scene.tweens.add({
            targets: this,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.deactivate();
                if (onComplete) onComplete();
            },
        });
    }

    /**
     * Deactivate power-up (return to pool)
     */
    deactivate(): void {
        this.active = false;
        this.setActive(false);
        this.setVisible(false);

        // Stop all tweens
        if (this.floatTween) {
            this.floatTween.destroy();
            this.floatTween = undefined;
        }
        if (this.rotateTween) {
            this.rotateTween.destroy();
            this.rotateTween = undefined;
        }

        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(0, 0);
        }
    }

    /**
     * Get power-up type
     */
    getPowerUpType(): PowerUpType {
        return this.powerUpType;
    }

    /**
     * Override destroy to cleanup tweens
     */
    destroy(fromScene?: boolean): void {
        if (this.floatTween) {
            this.floatTween.destroy();
        }
        if (this.rotateTween) {
            this.rotateTween.destroy();
        }
        super.destroy(fromScene);
    }

    /**
     * Create placeholder textures (static method, call once)
     */
    static createPlaceholderTextures(scene: Phaser.Scene): void {
        const types: PowerUpType[] = ['shield', 'slowmo', 'double_score'];
        const colors = {
            shield: 0x4fc3f7, // Blue
            slowmo: 0x9c27b0, // Purple
            double_score: 0xffd700, // Gold
        };

        types.forEach(type => {
            const graphics = scene.add.graphics();

            // Draw circle background
            graphics.fillStyle(colors[type], 1);
            graphics.fillCircle(40, 40, 35);

            // Add white border
            graphics.lineStyle(3, 0xffffff, 1);
            graphics.strokeCircle(40, 40, 35);

            // Add icon based on type
            graphics.fillStyle(0xffffff, 1);
            if (type === 'shield') {
                // Shield shape - simplified
                graphics.beginPath();
                graphics.moveTo(40, 20);
                graphics.lineTo(60, 30);
                graphics.lineTo(60, 50);
                graphics.lineTo(40, 65);
                graphics.lineTo(20, 50);
                graphics.lineTo(20, 30);
                graphics.closePath();
                graphics.fillPath();
            } else if (type === 'slowmo') {
                // Clock icon
                graphics.fillCircle(40, 40, 15);
                graphics.fillStyle(colors[type], 1);
                graphics.fillCircle(40, 40, 12);
                graphics.fillStyle(0xffffff, 1);
                graphics.fillRect(38, 28, 4, 12);
                graphics.fillRect(38, 38, 10, 4);
            } else if (type === 'double_score') {
                // 2X text
                graphics.fillStyle(0xffffff, 1);
                const text = scene.add.text(40, 40, '2X', {
                    fontSize: '20px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff',
                });
                text.setOrigin(0.5);
                text.x = 40;
                text.y = 40;
            }

            graphics.generateTexture(`powerup_${type}`, 80, 80);
            graphics.destroy();
        });
    }
}
