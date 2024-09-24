 # TODO

 ### MUST
 - Analytics
 - Painted door on history

 ### SHOULD
 - Visual cleanup results - divider shows, 3x list section headers too big, bigger handle, select triggers laggy
 - Stop barcode scanner when results are up
 - Make drawer jiggle when new results
 - Show picture of barcode in not found results header 




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

#### iOS Build
`eas build -p ios --profile preview`

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
or
`npx expo install --check`

#### Expo Check Health
`npx expo-doctor`
