import React from 'react';
import { Text, View, Button } from 'react-native';



export function HomeScreen({ route, navigation }) {

const {barcode} = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>HOME</Text>
      <Text>Barcode: {barcode}</Text>
      <Button 
        title='Scan Barcode'
        onPress={() => navigation.navigate('Scanner')}
      />
    </View>
  );
}
