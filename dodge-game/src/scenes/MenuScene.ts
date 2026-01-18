import Phaser from 'phaser';
import type { Theme } from '../types/GameTypes';
import StorageManager from '@systems/StorageManager';
import ThemeManager from '@systems/ThemeManager';
import { GAME_WIDTH, GAME_HEIGHT } from '@config/Constants';

/**
 * MenuScene - Main menu with play button and stats
 */
export default class MenuScene extends Phaser.Scene {
    private currentTheme!: Theme;

    constructor() {
        super({ key: 'Menu' });
    }

    create(): void {
        const storage = StorageManager.getInstance();
        const themeManager = ThemeManager.getInstance();
        const gameData = storage.loadGameData();

        // Get current theme from ThemeManager
        this.currentTheme = themeManager.getCurrentTheme();

        // Background
        this.cameras.main.setBackgroundColor(this.currentTheme.colors.bg);

        // Title
        this.add
            .text(GAME_WIDTH / 2, 120, 'DODGE GAME', {
                fontSize: '56px',
                fontFamily: 'Arial Black',
                color: '#00ff88',
            })
            .setOrigin(0.5);

        // High Score
        this.add
            .text(GAME_WIDTH / 2, 200, `High Score: ${gameData.highScore}s`, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Total Stars
        this.add
            .text(GAME_WIDTH / 2, 240, `⭐ ${gameData.totalStars} Stars`, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ffd700',
            })
            .setOrigin(0.5);

        // Play Button
        this.createPlayButton();

        // Instructions
        this.add
            .text(
                GAME_WIDTH / 2,
                GAME_HEIGHT - 130,
                'Use Arrow Keys or Touch to Move\nSurvive as long as you can!',
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#888888',
                    align: 'center',
                }
            )
            .setOrigin(0.5);

        // Settings button (top right)
        this.createSettingsButton();
    }

    /**
     * Create settings button
     */
    private createSettingsButton(): void {
        const settingsBtn = this.add
            .text(GAME_WIDTH - 20, 20, '⚙️', {
                fontSize: '32px',
            })
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true });

        settingsBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: settingsBtn,
                angle: 360,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    settingsBtn.setAngle(0);
                    this.scene.start('Settings');
                },
            });
        });
    }

    /**
     * Create play button
     */
    private createPlayButton(): void {
        const buttonY = GAME_HEIGHT / 2 + 50;

        // Button background
        const button = this.add
            .rectangle(GAME_WIDTH / 2, buttonY, 200, 70, 0x00ff88)
            .setInteractive({ useHandCursor: true });

        // Button text
        const buttonText = this.add
            .text(GAME_WIDTH / 2, buttonY, 'PLAY', {
                fontSize: '36px',
                fontFamily: 'Arial Black',
                color: '#000000',
            })
            .setOrigin(0.5);

        // Button hover effect
        button.on('pointerover', () => {
            button.setFillStyle(0x00cc66);
            this.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x00ff88);
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });

        // Button click
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    this.startGame();
                },
            });
        });
    }

    /**
     * Start game with selected theme
     */
    private startGame(): void {
        this.scene.start('Game', { theme: this.currentTheme });
    }
}
