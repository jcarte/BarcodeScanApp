import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './src/screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Sentry from '@sentry/react-native';

import { PostHogProvider } from 'posthog-react-native'

export const Stack = createNativeStackNavigator();

Sentry.init({
  dsn: __DEV__ ? undefined : 'https://120475c6ff30d996e1167a7e38c5ec91@o4506823877984256.ingest.us.sentry.io/4506823900200960',
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});


function App() {

  const isAnalyticsActive = !__DEV__;//only enable on prod not dev
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <PostHogProvider apiKey="phc_Yvgu0ct7RmzgmZ6WLhhRGiQhOnM7XZq6KFb43QFn0Ve" options={{ host: "https://eu.i.posthog.com", disabled: !isAnalyticsActive }}>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} initialParams={{}} />
            </Stack.Navigator>
          </PostHogProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );

}
export default Sentry.wrap(App);