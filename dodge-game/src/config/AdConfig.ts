// AdMob Configuration

export const USE_TEST_ADS = true; // Change to false for production

export const AdConfig = {
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

    // Get current config based on USE_TEST_ADS flag
    get current() {
        return USE_TEST_ADS ? this.test : this.production;
    },
};
