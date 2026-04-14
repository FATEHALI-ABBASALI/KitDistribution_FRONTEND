import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kitdistribution.app',
  appName: 'Kit Distribution',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};


export default config;
