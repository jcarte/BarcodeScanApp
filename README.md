# Run Locally

#### Start Expo version (run JS)
`npx expo start --go`

#### Run dev client locally (some debugging) (dev mode vs production: https://docs.expo.dev/workflow/development-mode/)
`npx expo start --dev-client`

#### Run production build locally
`npx expo start --no-dev --minify`

# Build

#### Export APK (builds on and avalable from https://expo.dev/accounts/jcarte)
`eas build -p android --profile preview-apk`

#### Dev Builds
`eas build -p android --profile development`




# Defunct Web Version

#### Deploy web version to github pages
`npm run deploy`

#### Start web version locally
`npx expo start --web`



# Other

#### Expo upgrade dependencies
`npx expo install --fix`



# TODO
#### IOS
- Register FB app: https://firebase.google.com/docs/ios/setup
