import Phaser from 'phaser';
import StorageManager from '@systems/StorageManager';

/**
 * BootScene - Initial loading scene
 * Handles asset loading and initializes game systems
 */
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    /**
     * Preload game assets
     */
    preload(): void {
        // Create loading UI
        this.createLoadingUI();

        // TODO: Load actual assets when ready
        // For now, just show loading screen

        // Update loading progress
        this.load.on('progress', (value: number) => {
            this.updateLoadingBar(value);
        });
    }

    /**
     * Initialize game systems and start menu
     */
    create(): void {
        // Initialize StorageManager
        const storage = StorageManager.getInstance();
        const gameData = storage.loadGameData();

        console.log('Game initialized with data:', gameData);

        // Wait a bit to show loading screen
        this.time.delayedCall(1000, () => {
            // Start MenuScene
            this.scene.start('Menu');
        });
    }

    /**
     * Create simple loading UI
     */
    private createLoadingUI(): void {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        // Title
        this.add
            .text(width / 2, height / 2 - 100, 'DODGE GAME', {
                fontSize: '48px',
                fontFamily: 'Arial Black',
                color: '#00ff88',
            })
            .setOrigin(0.5);

        // Loading text
        this.add
            .text(width / 2, height / 2 + 50, 'Loading...', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Progress bar background
        const barWidth = 300;
        const barHeight = 20;
        this.add.rectangle(width / 2, height / 2 + 100, barWidth, barHeight, 0x222222).setOrigin(0.5);

        // Progress bar (will be updated)
        const progressBar = this.add
            .rectangle(width / 2 - barWidth / 2, height / 2 + 100, 0, barHeight - 4, 0x00ff88)
            .setOrigin(0, 0.5);

        // Store for updating
        this.data.set('progressBar', progressBar);
        this.data.set('barWidth', barWidth);
    }

    /**
     * Update loading bar progress
     */
    private updateLoadingBar(progress: number): void {
        const progressBar = this.data.get('progressBar') as Phaser.GameObjects.Rectangle;
        const barWidth = this.data.get('barWidth') as number;

        if (progressBar) {
            progressBar.width = (barWidth - 4) * progress;
        }
    }

    /**
     * Show success message (temporary, until MenuScene is ready)
     */
    private showSuccessMessage(): void {
        const { width, height } = this.scale;

        this.add
            .text(
                width / 2,
                height / 2,
                'Setup Complete!\nProject is ready for development.',
                {
                    fontSize: '20px',
                    fontFamily: 'Arial',
                    color: '#00ff88',
                    align: 'center',
                }
            )
            .setOrigin(0.5);
    }
}
