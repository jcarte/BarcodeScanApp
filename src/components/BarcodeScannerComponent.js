import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

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

    if((new Date() - lastScan) > props.scanInterval)//only scan at least every interval (specified in props)
    {
      //check is only numbers
      if(data.match(/^[0-9]+$/) == null)
      {
        console.log("BCS: barcode found in wrong format: ",data)
        return
      }

      console.log("BCS: Notify parent")

      //Tell parent, found a barcode
      props.onBarCodeScanned(data)
  
      setLastScan(new Date())
    }

  };
  
  /*
    Barcode Types List
    https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/#supported-formats
  */

  return (
    <View style={styles.container}> 
      
      {!hasPermission ? <Text>Requesting for camera permission</Text> : undefined }
      {!hasPermission?.granted ? <Text>No access to camera</Text> : undefined }
      
      <Camera
        barcodeSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
            BarCodeScanner.Constants.BarCodeType.upc_a,
            BarCodeScanner.Constants.BarCodeType.upc_e,
            BarCodeScanner.Constants.BarCodeType.upc_ean,
            
          ],
        }}
        onBarCodeScanned={handleBarCodeScanned}
        onMountError={(e) => console.log(e)}
        style={StyleSheet.absoluteFillObject}
      />
           
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  }
});
