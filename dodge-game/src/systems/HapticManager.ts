import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import StorageManager from './StorageManager';

/**
 * HapticManager - Manages haptic feedback
 * Works on native platforms (iOS/Android) via Capacitor
 * Singleton pattern
 */
class HapticManager {
    private static instance: HapticManager;
    private enabled: boolean = true;
    private isNativePlatform: boolean = false;

    private constructor() {
        // Check if running on native platform
        this.isNativePlatform = Capacitor.isNativePlatform();

        // Load enabled state from storage
        const storage = StorageManager.getInstance();
        const settings = storage.getSettings();
        this.enabled = settings.hapticEnabled;
    }

    /**
     * Get singleton instance
     */
    static getInstance(): HapticManager {
        if (!HapticManager.instance) {
            HapticManager.instance = new HapticManager();
        }
        return HapticManager.instance;
    }

    /**
     * Light haptic feedback (UI interactions)
     */
    async light(): Promise<void> {
        if (!this.enabled || !this.isNativePlatform) return;

        try {
            await Haptics.impact({ style: ImpactStyle.Light });
        } catch (error) {
            console.warn('Haptic feedback failed:', error);
        }
    }

    /**
     * Medium haptic feedback (button presses)
     */
    async medium(): Promise<void> {
        if (!this.enabled || !this.isNativePlatform) return;

        try {
            await Haptics.impact({ style: ImpactStyle.Medium });
        } catch (error) {
            console.warn('Haptic feedback failed:', error);
        }
    }

    /**
     * Heavy haptic feedback (collisions, important events)
     */
    async heavy(): Promise<void> {
        if (!this.enabled || !this.isNativePlatform) return;

        try {
            await Haptics.impact({ style: ImpactStyle.Heavy });
        } catch (error) {
            console.warn('Haptic feedback failed:', error);
        }
    }

    /**
     * Vibrate for specific duration (fallback for web)
     * @param duration - Duration in milliseconds
     */
    vibrate(duration: number = 50): void {
        if (!this.enabled) return;

        // Use native haptics on mobile
        if (this.isNativePlatform) {
            this.medium();
            return;
        }

        // Fallback to Vibration API on web (if supported)
        if ('vibrate' in navigator) {
            try {
                navigator.vibrate(duration);
            } catch (error) {
                console.warn('Vibration API not supported');
            }
        }
    }

    /**
     * Selection changed haptic (light)
     */
    async selectionChanged(): Promise<void> {
        await this.light();
    }

    /**
     * Notification haptic (success)
     */
    async notificationSuccess(): Promise<void> {
        if (!this.enabled || !this.isNativePlatform) return;

        try {
            await Haptics.notification({ type: 'SUCCESS' } as any);
        } catch (error) {
            // Fallback to medium
            await this.medium();
        }
    }

    /**
     * Notification haptic (warning)
     */
    async notificationWarning(): Promise<void> {
        if (!this.enabled || !this.isNativePlatform) return;

        try {
            await Haptics.notification({ type: 'WARNING' } as any);
        } catch (error) {
            // Fallback to heavy
            await this.heavy();
        }
    }

    /**
     * Notification haptic (error)
     */
    async notificationError(): Promise<void> {
        if (!this.enabled || !this.isNativePlatform) return;

        try {
            await Haptics.notification({ type: 'ERROR' } as any);
        } catch (error) {
            // Fallback to heavy
            await this.heavy();
        }
    }

    /**
     * Set enabled state
     * @param enabled - True to enable, false to disable
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;

        // Update storage
        const storage = StorageManager.getInstance();
        storage.updateSettings({ hapticEnabled: enabled });
    }

    /**
     * Get enabled state
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Check if haptic is available on this device
     */
    isAvailable(): boolean {
        return this.isNativePlatform || 'vibrate' in navigator;
    }

    /**
     * Get platform info
     */
    getPlatformInfo(): { isNative: boolean; isAvailable: boolean } {
        return {
            isNative: this.isNativePlatform,
            isAvailable: this.isAvailable(),
        };
    }
}

export default HapticManager;
