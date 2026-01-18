import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zynk.dodgegame',
  appName: 'Dodge Game',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
