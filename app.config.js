import 'dotenv/config';

export default {
  expo: {
    name: "agendaApp",
    slug: "agendaApp",
    version: "1.0.3",
    orientation: "portrait",
    icon: "./assets/images/imageLogin.png",
    scheme: "agendaapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    assetBundlePatterns: [
      "assets/fonts/*"
    ],
    android: {
      googleServicesFile: "./google-services.json",
      package: "com.suzuki.agendaLA",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    ios: {
      supportsTablet: true
    },
    updates: {
      url: "https://u.expo.dev/f3bcf0ac-735e-479d-a669-49e9903a2c78"
    },
    web: {
      bundler: "metro",
      output: "server",
      favicon: "./assets/images/icon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
       [
        "expo-build-properties",
        {
          android: {
            googleServicesFile: "./google-services.json"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      eas: {
        projectId: "f3bcf0ac-735e-479d-a669-49e9903a2c78"
      }
    }
  }
};
