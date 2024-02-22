import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

export function BarcodeScannerComponent(props) {
  const [lastScan, setLastScan] = useState(new Date('0001-01-01T00:00:00Z'))//start at min time
  const [hasPermission, requestPermissions] = Camera.useCameraPermissions();


  useEffect(() => {
    console.log("BCS: use effect")
    console.log("BCS has permission:", hasPermission)
    if (!hasPermission?.granted) {
      console.log("BCS: requesting permissions")
      requestPermissions();
    }
  }, [hasPermission]);

  handleBarCodeScanned = ({ type, data }) => {

    if ((new Date() - lastScan) > props.scanInterval)//only scan at least every interval (specified in props)
    {
      //check is only numbers
      if (data.match(/^[0-9]+$/) == null) {
        console.log("BCS: barcode found in wrong format: ", data)
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

      {!hasPermission ? <Text>Requesting for camera permission</Text> : undefined}
      {!hasPermission?.granted ? <Text>No access to camera</Text> : undefined}

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
      <View style={styles.grid_container}>
        <View style={{ flex: 3, borderWidth: 0, }}></View>
        <View style={{ flex: 2, borderWidth: 0, flexDirection: 'row' }}>
          <View style={{ flex: 1, borderWidth: 0, }}></View>
          <View style={{ flex: 6, borderWidth: 0, flexDirection: 'row' }}>
            <View style={{ flex: 1, borderWidth: 0, justifyContent: "space-between" }}>
              <View style={styles.grid_tl}></View>
              <View style={styles.grid_bl}></View>
            </View>
            <View style={{ flex: 1, borderWidth: 0, justifyContent: "space-between", alignItems: "flex-end" }}>
              <View style={styles.grid_tr}></View>
              <View style={styles.grid_br}></View>
            </View>
          </View>
          <View style={{ flex: 1, borderWidth: 0, }}></View>
        </View>
        <View style={{ flex: 3, borderWidth: 0, }}></View>
      </View>
    </View>
  );
}

const barcodeOutlineWidth = 2

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid_container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 0,
    flex: 1,
  },

  grid_tl: {
    height: 50, 
    width: 50, 
    borderColor: "white", 
    borderTopWidth: barcodeOutlineWidth, 
    borderLeftWidth: barcodeOutlineWidth, 
    borderTopLeftRadius: 20
  },

  grid_bl: {
    height: 50, 
    width: 50, 
    borderColor: "white", 
    borderBottomWidth: barcodeOutlineWidth, 
    borderLeftWidth: barcodeOutlineWidth, 
    borderBottomLeftRadius: 20
  },

  grid_tr: {
    height: 50, 
    width: 50, 
    borderColor: "white", 
    borderTopWidth: barcodeOutlineWidth, 
    borderRightWidth: barcodeOutlineWidth, 
    borderTopRightRadius: 20
  },

  grid_br: {
    height: 50, 
    width: 50, 
    borderColor: "white", 
    borderBottomWidth: barcodeOutlineWidth, 
    borderRightWidth: barcodeOutlineWidth, 
    borderBottomRightRadius: 20
  },

});
