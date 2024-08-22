import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from './src/screens/HomeScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Sentry from '@sentry/react-native';

import { PostHogProvider } from 'posthog-react-native'
import { HistoryScreen } from './src/screens/HistoryScreen';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


Sentry.init({
  dsn: __DEV__ ? undefined : 'https://120475c6ff30d996e1167a7e38c5ec91@o4506823877984256.ingest.us.sentry.io/4506823900200960',
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

const NavStack = createNativeStackNavigator();

const HomeTabs = createBottomTabNavigator();
function HomeNav() {
  return(
    <HomeTabs.Navigator
      initialRouteName='Scan'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 75
        },
        tabBarLabelStyle: {
          fontSize: 11
        },
        tabBarItemStyle: {
          paddingBottom: 15,
          paddingTop: 15,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'History') return <MaterialIcons name="history" size={size} color={color} />
          if (route.name === 'Scan') return <MaterialCommunityIcons name="barcode-scan" size={size} color={color} />
          if (route.name === 'About') return <MaterialIcons name="info-outline" size={size} color={color} />
        }
      })}
  >
      <HomeTabs.Screen name="History" component={HistoryScreen} />
      <HomeTabs.Screen name="Scan" component={HomeScreen} />
      <HomeTabs.Screen name="About" component={AboutScreen} />
    </HomeTabs.Navigator>
  )
}

function App() {

  const isAnalyticsActive = !__DEV__;//only enable on prod not dev

  return(
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <PostHogProvider apiKey="phc_Yvgu0ct7RmzgmZ6WLhhRGiQhOnM7XZq6KFb43QFn0Ve" options={{ host: "https://eu.i.posthog.com", disabled: !isAnalyticsActive }}>
            <NavStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='OnboardingNav'>
              <NavStack.Screen name="OnboardingNav" component={OnboardingScreen} />
              <NavStack.Screen name="HomeNav" component={HomeNav} />
            </NavStack.Navigator>
          </PostHogProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
export default Sentry.wrap(App);