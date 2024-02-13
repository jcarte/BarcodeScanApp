#Deploy web version to github pages
npm run deploy

#start for normal expo/android debug
npx expo start

#Refresh device
r

#Start web version locally
npx expo start --web

#Start Expo version
npx expo start --go

#Start dev client
npx expo start --dev-client

#Export APK (builds on and avalable from https://expo.dev/accounts/jcarte)
eas build -p android --profile preview-apk

#Dev Builds
eas build -p android --profile development

