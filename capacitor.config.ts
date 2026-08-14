import { CapacitorConfig } from '@capacitor/cli';

const config = {
  appId: 'com.kami.extension',
  appName: 'KAMI-EXT',
  webDir: 'out',
  server: {
    // Cette option transforme l'APK en un "navigateur" direct vers votre site
    url: 'https://kami-extension-v3.vercel.app/',
    cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  }
};

export default config;
