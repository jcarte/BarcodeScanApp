#Deploy web version to github pages
npm run deploy

#Start web version locally
npx expo start --web

#Export APK
eas build -p android --profile preview-apk