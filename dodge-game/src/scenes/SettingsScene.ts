import Phaser from 'phaser';
import StorageManager from '@systems/StorageManager';
import { GAME_WIDTH, GAME_HEIGHT } from '@config/Constants';

/**
 * SettingsScene - Game settings and preferences
 */
export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Settings' });
    }

    create(): void {
        const { width, height } = this.scale;
        const storage = StorageManager.getInstance();
        const settings = storage.getSettings();

        // Background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Title
        this.add
            .text(width / 2, 60, '⚙️ SETTINGS', {
                fontSize: '40px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        let y = 150;

        // Sound Toggle
        this.createToggle(
            y,
            'Sound',
            '🔊',
            settings.soundEnabled,
            enabled => {
                storage.updateSettings({ soundEnabled: enabled });
            }
        );
        y += 80;

        // Haptic Toggle
        this.createToggle(
            y,
            'Haptic Feedback',
            '📳',
            settings.hapticEnabled,
            enabled => {
                storage.updateSettings({ hapticEnabled: enabled });
                // Test haptic
                // if (enabled) HapticManager.getInstance().light();
            }
        );
        y += 80;

        // Dark Mode Toggle
        this.createToggle(y, 'Dark Mode', '🌙', settings.darkMode, enabled => {
            storage.updateSettings({ darkMode: enabled });
            // Update background immediately
            this.cameras.main.setBackgroundColor(enabled ? '#1a1a2e' : '#f0f0f0');
        });
        y += 120;

        // Reset Progress Button
        this.createResetButton(y);
        y += 100;

        // Back Button
        this.createBackButton(height - 80);

        // Version info (bottom)
        this.add
            .text(width / 2, height - 30, 'v1.0.0', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#666666',
            })
            .setOrigin(0.5);
    }

    /**
     * Create toggle switch
     */
    private createToggle(
        y: number,
        label: string,
        icon: string,
        initialValue: boolean,
        onChange: (enabled: boolean) => void
    ): void {
        const { width } = this.scale;

        // Icon
        this.add
            .text(60, y, icon, {
                fontSize: '28px',
            })
            .setOrigin(0.5);

        // Label
        this.add
            .text(110, y, label, {
                fontSize: '22px',
                fontFamily: 'Arial',
                color: '#ffffff',
            })
            .setOrigin(0, 0.5);

        // Toggle switch background
        const toggleBg = this.add
            .rectangle(width - 80, y, 60, 30, initialValue ? 0x00ff88 : 0x666666, 1)
            .setStrokeStyle(2, 0x333333)
            .setInteractive({ useHandCursor: true });

        // Toggle knob
        const knobX = initialValue ? width - 60 : width - 100;
        const knob = this.add.circle(knobX, y, 12, 0xffffff);

        let isEnabled = initialValue;

        // Toggle interaction
        toggleBg.on('pointerdown', () => {
            isEnabled = !isEnabled;

            // Animate knob
            this.tweens.add({
                targets: knob,
                x: isEnabled ? width - 60 : width - 100,
                duration: 200,
                ease: 'Power2',
            });

            // Change bg color
            toggleBg.setFillStyle(isEnabled ? 0x00ff88 : 0x666666);

            // Callback
            onChange(isEnabled);

            // Haptic feedback placeholder
            // HapticManager.getInstance().light();
        });

        // Hover effect
        toggleBg.on('pointerover', () => {
            this.tweens.add({
                targets: toggleBg,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
            });
        });

        toggleBg.on('pointerout', () => {
            this.tweens.add({
                targets: toggleBg,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });
    }

    /**
     * Create reset progress button
     */
    private createResetButton(y: number): void {
        const { width } = this.scale;

        const button = this.add
            .rectangle(width / 2, y, 280, 50, 0xcc0000)
            .setInteractive({ useHandCursor: true });

        const buttonText = this.add
            .text(width / 2, y, '🗑️ RESET PROGRESS', {
                fontSize: '20px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Hover
        button.on('pointerover', () => {
            button.setFillStyle(0xaa0000);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(0xcc0000);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });

        // Click - show confirmation
        button.on('pointerdown', () => {
            this.showResetConfirmation();
        });
    }

    /**
     * Show reset confirmation dialog
     */
    private showResetConfirmation(): void {
        const { width, height } = this.scale;

        // Overlay
        const overlay = this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
            .setInteractive();

        // Dialog box
        const dialogBg = this.add.rectangle(width / 2, height / 2, 300, 200, 0x1a1a2e, 1);
        dialogBg.setStrokeStyle(2, 0xff0055);

        // Text
        const dialogText = this.add
            .text(
                width / 2,
                height / 2 - 40,
                'Reset all progress?\n\nThis cannot be undone!',
                {
                    fontSize: '18px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    align: 'center',
                }
            )
            .setOrigin(0.5);

        // Yes button
        const yesBtn = this.add
            .rectangle(width / 2 - 60, height / 2 + 50, 100, 40, 0xcc0000)
            .setInteractive({ useHandCursor: true });

        const yesText = this.add
            .text(width / 2 - 60, height / 2 + 50, 'YES', {
                fontSize: '18px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // No button
        const noBtn = this.add
            .rectangle(width / 2 + 60, height / 2 + 50, 100, 40, 0x666666)
            .setInteractive({ useHandCursor: true });

        const noText = this.add
            .text(width / 2 + 60, height / 2 + 50, 'NO', {
                fontSize: '18px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Dialog group
        const dialogGroup = [overlay, dialogBg, dialogText, yesBtn, yesText, noBtn, noText];

        // Yes action
        yesBtn.on('pointerdown', () => {
            StorageManager.getInstance().resetGameData();
            dialogGroup.forEach(obj => obj.destroy());
            // Show success message
            this.showMessage('Progress reset!');
        });

        // No action
        noBtn.on('pointerdown', () => {
            dialogGroup.forEach(obj => obj.destroy());
        });
    }

    /**
     * Show temporary message
     */
    private showMessage(text: string): void {
        const { width, height } = this.scale;

        const message = this.add
            .text(width / 2, height / 2, text, {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#00ff88',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setAlpha(0);

        this.tweens.add({
            targets: message,
            alpha: 1,
            duration: 300,
            yoyo: true,
            hold: 1500,
            onComplete: () => message.destroy(),
        });
    }

    /**
     * Create back button
     */
    private createBackButton(y: number): void {
        const { width } = this.scale;

        const button = this.add
            .rectangle(width / 2, y, 200, 50, 0x666666)
            .setInteractive({ useHandCursor: true });

        const buttonText = this.add
            .text(width / 2, y, '← BACK', {
                fontSize: '20px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Hover
        button.on('pointerover', () => {
            button.setFillStyle(0x555555);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x666666);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });

        // Click
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('Menu');
                },
            });
        });
    }
}
