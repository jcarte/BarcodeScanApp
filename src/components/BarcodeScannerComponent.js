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
  }, [hasPermission]); 

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
