import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './src/screens/HomeScreen';

export const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} initialParams={{}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );

}