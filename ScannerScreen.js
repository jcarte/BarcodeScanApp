import React, { useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CrossSvgComponent from './CrossSVG'
import { Camera } from 'expo-camera'

export function ScannerScreen({ navigation }) {

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);


  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    navigation.navigate('Home', {barcode: data})
  };
  
  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}> 
      
      
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      <TouchableOpacity onPress={()=>navigation.navigate('Home', {barcode:''})} style={StyleSheet.absoluteFill}> 
        <CrossSvgComponent style={styles.exit}></CrossSvgComponent>
      </TouchableOpacity>
           
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ff0',
    // alignItems: 'center',
    // justifyContent: 'center',
    
  },
  exit: {
    position: 'absolute',
    margin: '7%',
    width: '5%',
    height: '5%',
    right: 0,
    top: 0,
  }
});
