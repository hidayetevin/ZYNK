import Phaser from 'phaser';
import type { ResultSceneData } from '../types/SceneData';
import StorageManager from '@systems/StorageManager';
import ThemeManager from '@systems/ThemeManager';
import { GAME_WIDTH, GAME_HEIGHT } from '@config/Constants';

/**
 * ResultScene - Game over screen with stars and stats
 */
export default class ResultScene extends Phaser.Scene {
    private resultData!: ResultSceneData;

    constructor() {
        super({ key: 'Result' });
    }

    /**
     * Initialize with game result data
     */
    init(data: ResultSceneData): void {
        this.resultData = data;
    }

    /**
     * Create result screen UI
     */
    create(): void {
        const { width, height } = this.scale;
        const storage = StorageManager.getInstance();

        // Background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Game Over Title
        const gameOverText = this.add
            .text(width / 2, 80, 'GAME OVER', {
                fontSize: '48px',
                fontFamily: 'Arial Black',
                color: this.resultData.isNewHighScore ? '#ffd700' : '#ffffff',
            })
            .setOrigin(0.5)
            .setAlpha(0);

        // Fade in title
        this.tweens.add({
            targets: gameOverText,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
        });

        // New High Score indicator
        if (this.resultData.isNewHighScore) {
            const newRecordText = this.add
                .text(width / 2, 140, '🏆 NEW RECORD! 🏆', {
                    fontSize: '24px',
                    fontFamily: 'Arial',
                    color: '#ffd700',
                })
                .setOrigin(0.5)
                .setAlpha(0);

            this.tweens.add({
                targets: newRecordText,
                alpha: 1,
                duration: 500,
                delay: 300,
                ease: 'Power2',
            });

            // Pulse animation
            this.tweens.add({
                targets: newRecordText,
                scale: { from: 1, to: 1.1 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }

        // Time Survived (large display)
        const timeY = this.resultData.isNewHighScore ? 200 : 160;
        this.add
            .text(width / 2, timeY, `${this.resultData.score}s`, {
                fontSize: '64px',
                fontFamily: 'Arial Black',
                color: '#00ff88',
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setData('appear', timeY + 100);

        // "Time Survived" label
        this.add
            .text(width / 2, timeY + 60, 'Time Survived', {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#888888',
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setData('appear', timeY + 150);

        // Stats panel
        const statsY = timeY + 120;
        this.add
            .text(
                width / 2,
                statsY,
                `Obstacles Dodged: ${this.resultData.obstaclesDodged}\nPower-ups Collected: ${this.resultData.powerupsCollected}`,
                {
                    fontSize: '18px',
                    fontFamily: 'Arial',
                    color: '#cccccc',
                    align: 'center',
                }
            )
            .setOrigin(0.5)
            .setAlpha(0)
            .setData('appear', statsY + 200);

        // Stars earned (animated)
        const starsY = statsY + 80;
        this.createStarDisplay(starsY);

        // Total stars display
        const totalStars = storage.getTotalStars();
        this.add
            .text(width / 2, starsY + 80, `Total Stars: ⭐ ${totalStars}`, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ffd700',
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setData('appear', starsY + 350);

        // Buttons
        this.createButtons();

        // Animate all elements
        this.time.delayedCall(200, () => this.animateElements());
    }

    /**
     * Create animated star display
     */
    private createStarDisplay(y: number): void {
        const { width } = this.scale;
        const stars = this.resultData.stars;

        // Container for stars
        const starContainer = this.add.container(width / 2, y);

        // Create 3 star positions
        const starPositions = [-80, 0, 80];

        for (let i = 0; i < 3; i++) {
            const x = starPositions[i];
            const earned = i < stars;

            // Star emoji or empty
            const starText = this.add
                .text(x, 0, earned ? '⭐' : '☆', {
                    fontSize: '48px',
                })
                .setOrigin(0.5)
                .setAlpha(0)
                .setScale(0);

            starContainer.add(starText);

            // Animate each star with delay
            this.time.delayedCall(800 + i * 300, () => {
                this.tweens.add({
                    targets: starText,
                    alpha: 1,
                    scale: 1.2,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        // Haptic feedback (will be implemented later)
                        // HapticManager.getInstance().light();

                        this.tweens.add({
                            targets: starText,
                            scale: 1,
                            duration: 200,
                            ease: 'Power2',
                        });
                    },
                });
            });
        }
    }

    /**
     * Create action buttons
     */
    private createButtons(): void {
        const { width, height } = this.scale;

        // Play Again button
        this.createButton(width / 2, height - 160, 'PLAY AGAIN', '#00ff88', () =>
            this.playAgain()
        );

        // Menu button
        this.createButton(width / 2, height - 90, 'MENU', '#666666', () => this.backToMenu());
    }

    /**
     * Create interactive button
     */
    private createButton(
        x: number,
        y: number,
        text: string,
        color: string,
        onClick: () => void
    ): void {
        const buttonWidth = 250;
        const buttonHeight = 60;

        // Button background
        const colorNum = parseInt(color.replace('#', ''), 16);
        const button = this.add
            .rectangle(x, y, buttonWidth, buttonHeight, colorNum)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0);

        // Button text
        const buttonText = this.add
            .text(x, y, text, {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: color === '#666666' ? '#ffffff' : '#000000',
            })
            .setOrigin(0.5)
            .setAlpha(0);

        // Store for animation
        button.setData('appear', 1500);
        buttonText.setData('appear', 1500);

        // Hover effect
        button.on('pointerover', () => {
            const darkerColor = this.darkenColor(colorNum);
            button.setFillStyle(darkerColor);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(colorNum);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });

        // Click effect
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: onClick,
            });
        });
    }

    /**
     * Animate all elements in sequence
     */
    private animateElements(): void {
        const children = this.children.list;

        children.forEach(child => {
            const appearTime = child.getData('appear');
            if (appearTime !== undefined) {
                this.tweens.add({
                    targets: child,
                    alpha: 1,
                    duration: 400,
                    delay: appearTime,
                    ease: 'Power2',
                });
            }
        });
    }

    /**
     * Darken color for hover effect
     */
    private darkenColor(color: number): number {
        const r = Math.max(0, ((color >> 16) & 0xff) - 20);
        const g = Math.max(0, ((color >> 8) & 0xff) - 20);
        const b = Math.max(0, (color & 0xff) - 20);
        return (r << 16) | (g << 8) | b;
    }

    /**
   * Play again - restart game
   */
    private playAgain(): void {
        // Get current theme from ThemeManager
        const theme = ThemeManager.getInstance().getCurrentTheme();

        this.scene.start('Game', { theme });
    }

    /**
     * Back to main menu
     */
    private backToMenu(): void {
        this.scene.start('Menu');
    }
}
