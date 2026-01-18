import Phaser from 'phaser';
import StorageManager from './StorageManager';

/**
 * SoundManager - Manages game audio and sound effects
 * Singleton pattern
 */
class SoundManager {
    private static instance: SoundManager;
    private scene?: Phaser.Scene;
    private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
    private muted: boolean = false;
    private volume: number = 1.0;

    private constructor() {
        // Singleton
    }

    /**
     * Get singleton instance
     */
    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    /**
     * Initialize sound manager with scene
     * @param scene - Phaser scene to attach sounds to
     */
    init(scene: Phaser.Scene): void {
        this.scene = scene;

        // Load sound enabled state from storage
        const storage = StorageManager.getInstance();
        const settings = storage.getSettings();
        this.muted = !settings.soundEnabled;

        // Add sound keys (will be loaded as actual files later)
        this.registerSounds();
    }

    /**
     * Register sound keys (placeholder - actual loading in BootScene)
     */
    private registerSounds(): void {
        // Sound keys that will be loaded
        const soundKeys = ['click', 'hit', 'powerup', 'shield_break', 'star', 'theme_unlock'];

        // For now, sounds are registered but not created
        // Actual sound files will be loaded in preload
        soundKeys.forEach(key => {
            // Placeholder - will be replaced with actual sounds
            if (this.scene && this.scene.sound.get(key)) {
                const sound = this.scene.sound.get(key);
                if (sound) {
                    this.sounds.set(key, sound);
                }
            }
        });
    }

    /**
     * Play sound effect
     * @param soundKey - Key of sound to play
     * @param volume - Optional volume override (0-1)
     */
    play(soundKey: string, volume?: number): void {
        if (!this.scene || this.muted) return;

        try {
            // Try to get existing sound
            let sound = this.sounds.get(soundKey);

            // If sound doesn't exist but key is registered, try to get from scene
            if (!sound && this.scene.sound.get(soundKey)) {
                sound = this.scene.sound.get(soundKey);
                if (sound) {
                    this.sounds.set(soundKey, sound);
                }
            }

            // Play sound if available
            if (sound) {
                const finalVolume = volume !== undefined ? volume : this.volume;
                sound.play({ volume: finalVolume });
            } else {
                // Fallback: Generate simple beep tone for placeholder
                this.playPlaceholderSound(soundKey);
            }
        } catch (error) {
            console.warn(`Failed to play sound: ${soundKey}`, error);
        }
    }

    /**
     * Play placeholder sound using Web Audio API (temporary)
     */
    private playPlaceholderSound(soundKey: string): void {
        if (!this.scene || this.muted) return;

        // Different frequencies for different sounds
        const frequencies: { [key: string]: number } = {
            click: 800,
            hit: 200,
            powerup: 1200,
            shield_break: 400,
            star: 1500,
            theme_unlock: 1000,
        };

        const frequency = frequencies[soundKey] || 440;
        const duration = 100; // ms

        try {
            // Use Phaser's sound system to play a tone
            // This is a placeholder until actual sound files are added
            const soundManager = this.scene.sound as any; // Type assertion for context
            if (soundManager.context) {
                const audioContext = soundManager.context as AudioContext;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioContext.currentTime + duration / 1000
                );

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration / 1000);
            }
        } catch (error) {
            // Silently fail if Web Audio not supported
            console.warn('Web Audio API not available');
        }
    }

    /**
     * Stop specific sound
     * @param soundKey - Key of sound to stop
     */
    stop(soundKey: string): void {
        const sound = this.sounds.get(soundKey);
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    }

    /**
     * Stop all sounds
     */
    stopAll(): void {
        this.sounds.forEach(sound => {
            if (sound.isPlaying) {
                sound.stop();
            }
        });
    }

    /**
     * Set muted state
     * @param muted - True to mute, false to unmute
     */
    setMuted(muted: boolean): void {
        this.muted = muted;

        // Update storage
        const storage = StorageManager.getInstance();
        storage.updateSettings({ soundEnabled: !muted });

        if (muted) {
            this.stopAll();
        }
    }

    /**
     * Get muted state
     */
    isMuted(): boolean {
        return this.muted;
    }

    /**
     * Set volume
     * @param volume - Volume level (0-1)
     */
    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Get current volume
     */
    getVolume(): number {
        return this.volume;
    }

    /**
     * Play click sound (UI interactions)
     */
    playClick(): void {
        this.play('click', 0.5);
    }

    /**
     * Play hit sound (collision)
     */
    playHit(): void {
        this.play('hit', 0.7);
    }

    /**
     * Play power-up collection sound
     */
    playPowerUp(): void {
        this.play('powerup', 0.6);
    }

    /**
     * Play shield break sound
     */
    playShieldBreak(): void {
        this.play('shield_break', 0.6);
    }

    /**
     * Play star earned sound
     */
    playStar(): void {
        this.play('star', 0.7);
    }

    /**
     * Play theme unlock sound
     */
    playThemeUnlock(): void {
        this.play('theme_unlock', 0.8);
    }
}

export default SoundManager;
