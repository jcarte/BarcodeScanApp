import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CrossSvgComponent from './CrossSVG'
import { Camera } from 'expo-camera'


export function BarcodeScannerComponent(props) {

 
  const [hasPermission, requestPermissions] = Camera.useCameraPermissions();

  useEffect(() => {
    console.log("BCS: use effect")
      if (!hasPermission?.granted) requestPermissions();
  }, []);

  console.log("BCS: Set scanned state to false")
  const [scanned, setScanned] = useState(false);

  console.log("BCS has permission:",hasPermission)

  const handleBarCodeScanned = ({ type, data }) => {
    console.log('Barcode found')
    setScanned(true);

    console.log("BCS props", props)
    console.log("BCS data", data)
    props.onBarCodeScanned(data)
    //navigation.navigate('Home', {barcode: data})
  };
  


  return (
    <View style={styles.container}> 
      
      {!hasPermission ? <Text>Requesting for camera permission</Text> : undefined }
      {!hasPermission?.granted ? <Text>No access to camera</Text> : undefined }

      
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        onMountError={(e) => console.log(e)}
        style={StyleSheet.absoluteFillObject}
      />
      

           
    </View>
  );
}

/*
      <TouchableOpacity onPress={()=>navigation.navigate('Home', {barcode:''})} style={StyleSheet.absoluteFill}> 
        <CrossSvgComponent style={styles.exit}></CrossSvgComponent>
      </TouchableOpacity>
*/

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



  // // const [permission, requestPermission] = Camera.useCameraPermissions();
  // const [cameraPermission, setCameraPermission] = useState(null);
  // const requestPermissionAgain = () => {
  //     Linking.openSettings();
  // }


  // barCodeScannerSettings={{ barCodeTypes: [
  //   BarCodeScanner.Constants.BarCodeType.codabar,
  //   BarCodeScanner.Constants.BarCodeType.code39, 
  //   BarCodeScanner.Constants.BarCodeType.code93,
  //   BarCodeScanner.Constants.BarCodeType.code128,
  //   BarCodeScanner.Constants.BarCodeType.code39mod43,
  //   BarCodeScanner.Constants.BarCodeType.ean13,
  //   BarCodeScanner.Constants.BarCodeType.ean8,
  //   BarCodeScanner.Constants.BarCodeType.interleaved2of5,
  //   BarCodeScanner.Constants.BarCodeType.itf14,
  //   BarCodeScanner.Constants.BarCodeType.upc_a,
  //   BarCodeScanner.Constants.BarCodeType.upc_e,
  //   BarCodeScanner.Constants.BarCodeType.upc_ean,
  // ], }}


  // const [hasPermission, setHasPermission] = useState(null);
  // useEffect(() => {
  //   console.log("Check camera permissions")
    
  //   const getBarCodeScannerPermissions = async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //     console.log(status)
  //     console.log(hasPermission)
  //   };

  //   getBarCodeScannerPermissions();
  // }, []);
  // if (!hasPermission) {
  //   return <Text>Requesting for camera permission</Text>;
  // }
  //console.log(hasPermission)
  // if (!hasPermission.granted) {
  //   return <Text>No access to camera</Text>;
  // }
