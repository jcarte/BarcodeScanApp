import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './src/screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Sentry from '@sentry/react-native';

export const Stack = createNativeStackNavigator();

Sentry.init({
  dsn: __DEV__? undefined : 'https://120475c6ff30d996e1167a7e38c5ec91@o4506823877984256.ingest.us.sentry.io/4506823900200960',
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

function App() {

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
              <Stack.Screen name="Home" component={HomeScreen} initialParams={{}}/>
            </Stack.Navigator>
          </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );

}
export default Sentry.wrap(App);