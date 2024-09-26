 # TODO

 ### MUST

 ### SHOULD
 - Select triggers laggy
 - Make drawer jiggle when new results



# Run Locally

#### Start Expo version (run JS)
`export env REACT_NATIVE_PACKAGER_HOSTNAME=192.168.0.57`
`echo "$REACT_NATIVE_PACKAGER_HOSTNAME"`
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
