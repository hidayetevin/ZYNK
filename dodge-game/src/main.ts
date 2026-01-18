import Phaser from 'phaser';
import gameConfig from '@config/GameConfig';

// Initialize game when DOM is ready
window.addEventListener('load', () => {
    const game = new Phaser.Game(gameConfig);

    // Add game to window for debugging (development only)
    if (import.meta.env.DEV) {
        (window as any).game = game;
    }
});
