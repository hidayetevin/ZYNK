// AdMob Configuration

const USE_TEST_ADS = true; // Change to false for production

export const AD_CONFIG = {
    USE_TEST_ADS,

    // Test IDs (AdMob provided)
    test: {
        bannerId: 'ca-app-pub-3940256099942544/6300978111',
        interstitialId: 'ca-app-pub-3940256099942544/1033173712',
        rewardedId: 'ca-app-pub-3940256099942544/5224354917',
    },

    // Production IDs (replace with your actual AdMob IDs)
    production: {
        bannerId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
        interstitialId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
        rewardedId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },

    // Get current IDs based on USE_TEST_ADS flag
    get BANNER_ID() {
        return this.USE_TEST_ADS ? this.test.bannerId : this.production.bannerId;
    },
    get INTERSTITIAL_ID() {
        return this.USE_TEST_ADS ? this.test.interstitialId : this.production.interstitialId;
    },
    get REWARDED_ID() {
        return this.USE_TEST_ADS ? this.test.rewardedId : this.production.rewardedId;
    },
};
