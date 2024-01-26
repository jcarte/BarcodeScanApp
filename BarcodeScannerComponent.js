import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera'

export function BarcodeScannerComponent(props) {
  const [lastScan, setLastScan] = useState(new Date('0001-01-01T00:00:00Z'))//start at min time
  const [hasPermission, requestPermissions] = Camera.useCameraPermissions();


  useEffect(() => {
    console.log("BCS: use effect")
    console.log("BCS has permission:",hasPermission)
    if (!hasPermission?.granted) {
      console.log("BCS: requesting permissions")
      requestPermissions();
    }
  }, []); 

  handleBarCodeScanned = ({ type, data }) => {
    // console.log("BCS props", props)
    // console.log("BCS data", data)
    //console.log("BCS: handle barcode")
    //console.log("BCS: last scan", lastScan,",    time diff:", new Date() - lastScan,",    interval:",props.scanInterval)

    if((new Date() - lastScan) > props.scanInterval)//only scan at least every interval (specified in props)
    {
      console.log("BCS: Notify parent")
      //Tell parent, found a barcode
      props.onBarCodeScanned(data)
  
      setLastScan(new Date())
    }

  };
  


  return (
    <View style={styles.container}> 
      
      {!hasPermission ? <Text>Requesting for camera permission</Text> : undefined }
      {!hasPermission?.granted ? <Text>No access to camera</Text> : undefined }
      
      <Camera
        barcodeSettings={{
          interval: 2000, // scan every 2 secs
        }}
        onBarCodeScanned={handleBarCodeScanned}
        onMountError={(e) => console.log(e)}
        style={StyleSheet.absoluteFillObject}
      />
           
    </View>
  );
}
//onBarCodeScanned={props.allowScanning ? handleBarCodeScanned : undefined}

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
