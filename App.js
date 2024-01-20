import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import { FullResultsScreen } from './FullResultsComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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


/*
          <Stack.Screen name="Results" component={FullResultsScreen} initialParams={{ 
            product: {
              brand: "Walkers",
              fodmapStatus: "high",
              imgUrl: "https://images.openfoodfacts.org/images/products/51000005/front_en.34.400.jpg",
              name: "Cheese Onion Flavour Potato Crisps"
            }}}/>
*/

