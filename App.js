import React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './HomeScreen';
import { ScannerScreenCAM } from './ScannerScreenCAM';


export const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} initialParams={{ barcode: ''}}/>
        <Stack.Screen name="Scanner" component={ScannerScreenCAM} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}


