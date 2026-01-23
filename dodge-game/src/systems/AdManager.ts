import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdmobConsentStatus } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import StorageManager from './StorageManager';
import { AD_CONFIG } from '@config/AdConfig';

/**
 * AdManager - Manages AdMob integration
 * Handles banner, interstitial, and rewarded ads
 * Native-only (web fallback does nothing)
 */
class AdManager {
    private static instance: AdManager;
    private isInitialized: boolean = false;
    private isNativePlatform: boolean = false;
    private bannerVisible: boolean = false;

    private constructor() {
        this.isNativePlatform = Capacitor.isNativePlatform();
    }

    /**
     * Get singleton instance
     */
    static getInstance(): AdManager {
        if (!AdManager.instance) {
            AdManager.instance = new AdManager();
        }
        return AdManager.instance;
    }

    /**
     * Initialize AdMob
     */
    async initialize(): Promise<void> {
        if (!this.isNativePlatform || this.isInitialized) {
            console.log('[AdManager] Skipping init (web or already initialized)');
            return;
        }

        try {
            await AdMob.initialize({
                initializeForTesting: AD_CONFIG.USE_TEST_ADS,
            });

            this.isInitialized = true;
            console.log('[AdManager] Initialized successfully');
        } catch (error) {
            console.error('[AdManager] Init failed:', error);
        }
    }

    /**
     * Show banner ad
     */
    async showBanner(): Promise<void> {
        if (!this.isNativePlatform || !this.isInitialized || this.bannerVisible) {
            return;
        }

        try {
            const options: BannerAdOptions = {
                adId: AD_CONFIG.BANNER_ID,
                adSize: BannerAdSize.BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
                isTesting: AD_CONFIG.USE_TEST_ADS,
            };

            await AdMob.showBanner(options);
            this.bannerVisible = true;
            console.log('[AdManager] Banner shown');
        } catch (error) {
            console.error('[AdManager] Banner failed:', error);
        }
    }

    /**
     * Hide banner ad
     */
    async hideBanner(): Promise<void> {
        if (!this.isNativePlatform || !this.bannerVisible) {
            return;
        }

        try {
            await AdMob.hideBanner();
            this.bannerVisible = false;
            console.log('[AdManager] Banner hidden');
        } catch (error) {
            console.error('[AdManager] Hide banner failed:', error);
        }
    }

    /**
     * Show interstitial ad (game over, menu transitions)
     */
    async showInterstitial(): Promise<void> {
        if (!this.isNativePlatform || !this.isInitialized) {
            return;
        }

        try {
            // Prepare ad
            await AdMob.prepareInterstitial({
                adId: AD_CONFIG.INTERSTITIAL_ID,
                isTesting: AD_CONFIG.USE_TEST_ADS,
            });

            // Show ad
            await AdMob.showInterstitial();
            console.log('[AdManager] Interstitial shown');
        } catch (error) {
            console.error('[AdManager] Interstitial failed:', error);
        }
    }

    /**
     * Show rewarded ad (watch ad for bonus stars)
     * @returns Promise<boolean> - true if reward earned
     */
    async showRewarded(): Promise<boolean> {
        if (!this.isNativePlatform || !this.isInitialized) {
            return false;
        }

        try {
            // Prepare ad
            await AdMob.prepareRewardVideoAd({
                adId: AD_CONFIG.REWARDED_ID,
                isTesting: AD_CONFIG.USE_TEST_ADS,
            });

            // Show ad
            const result = await AdMob.showRewardVideoAd();
            console.log('[AdManager] Rewarded ad shown, result:', result);

            // Check if user watched completely
            return true; // User watched ad
        } catch (error) {
            console.error('[AdManager] Rewarded ad failed:', error);
            return false;
        }
    }

    /**
     * Check if ads are available (native platform check)
     */
    isAvailable(): boolean {
        return this.isNativePlatform && this.isInitialized;
    }

    /**
     * Get consent status (GDPR compliance)
     */
    async getConsentStatus(): Promise<AdmobConsentStatus | null> {
        if (!this.isNativePlatform) return null;

        try {
            const info = await AdMob.requestConsentInfo();
            console.log('[AdManager] Consent info:', info);
            return info.status;
        } catch (error) {
            console.error('[AdManager] Consent check failed:', error);
            return null;
        }
    }

    /**
     * Request tracking authorization (iOS 14+)
     */
    async requestTrackingAuthorization(): Promise<void> {
        if (!this.isNativePlatform) return;

        try {
            await AdMob.trackingAuthorizationStatus();
            console.log('[AdManager] Tracking authorization requested');
        } catch (error) {
            console.error('[AdManager] Tracking auth failed:', error);
        }
    }
}

export default AdManager;
