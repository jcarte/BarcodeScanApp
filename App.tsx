import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigationEventMap, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SafeAreaProvider } from 'react-native-safe-area-context';


import * as Sentry from '@sentry/react-native';

import { PostHogProvider } from 'posthog-react-native'
import { HistoryScreen } from './src/screens/HistoryScreen';



import { AboutScreen } from './src/screens/AboutScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import ScanScreen from './src/screens/ScanScreen';
import { RoutingScreen } from './src/screens/RoutingScreen';
import { UpdateTriggersScreen } from './src/screens/UpdateTriggersScreen';
import { TabBarComponent } from './src/components/layout/TabBarComponent';
import GlobalStyles from './src/lib/GlobalStyles';

Sentry.init({
  dsn: __DEV__ ? undefined : 'https://120475c6ff30d996e1167a7e38c5ec91@o4506823877984256.ingest.us.sentry.io/4506823900200960',
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});



const HomeTabs = createBottomTabNavigator();
function HomeNav() {

  return (
    <HomeTabs.Navigator
      initialRouteName='Scan'
      tabBar={TabBarComponent}
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <HomeTabs.Screen name="History" component={HistoryScreen} />
      <HomeTabs.Screen name="Scan" component={ScanScreen} />
      <HomeTabs.Screen name="About" component={AboutScreen} />

    </HomeTabs.Navigator>
  )
}


const NavStack = createNativeStackNavigator();
function App() {

  const isAnalyticsActive = !__DEV__;//only enable on prod not dev

  const posthogApiKey = "phc_Yvgu0ct7RmzgmZ6WLhhRGiQhOnM7XZq6KFb43QFn0Ve"

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <PostHogProvider apiKey={posthogApiKey} options={{ host: "https://eu.i.posthog.com", disabled: !isAnalyticsActive }}>
            <NavStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Router'>
              <NavStack.Screen name="Router" component={RoutingScreen} />
              <NavStack.Screen name="HomeNav" component={HomeNav} />
              <NavStack.Screen name="OnboardingNav" component={OnboardingScreen} />

              <HomeTabs.Screen name="UpdateTriggers" component={UpdateTriggersScreen} />

            </NavStack.Navigator>
          </PostHogProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
export default Sentry.wrap(App);