import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BarCodeScanningResult, Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

export function BarcodeScannerComponent(props) {
  const lastAttemptScan = useRef(new Date('0001-01-01T00:00:00Z'))//start at min time - last time the BCS found a BC and we assessed it
  const lastSuccessScan = useRef(new Date('0001-01-01T00:00:00Z'))//start at min time - last time found a BC and raised the barcode scanned event
  const [hasPermission, requestPermissions] = Camera.useCameraPermissions();

  // const [bb, setBB] = useState(null) //for testing where 4 corners of BC are

  console.log("BCS: Start")

  useEffect(() => {
    //console.log("BCS: useeffect")
    if (!hasPermission?.granted) {
      //console.log(`BCS: hasPermission: ${hasPermission}`)
      requestPermissions();
    }
  }, [hasPermission]);

  const screenWidth = useMemo(()=>Dimensions.get('window').width,[])
  const screenHeight = useMemo(()=>Dimensions.get('window').height,[])

  const sizePercentThreshold = 0.20
  const deadzonePercent = 0.2

  const handleBarCodeScanned = (result : any): void => {

    //Check if it's time to check barcode again - timeout after each attempt
    if ((new Date().getTime() - lastAttemptScan.current.getTime()) < props.refreshIntervalMS)
      return

    lastAttemptScan.current = (new Date())//update last attempt time (as this is now an attempt)

    //check if it's been long enough after the last successful barcode detected
    if ((new Date().getTime() - lastSuccessScan.current.getTime()) < props.timeoutAfterScanMS)
      return

    const minX = Math.min(result.cornerPoints[0].x,result.cornerPoints[1].x,result.cornerPoints[2].x,result.cornerPoints[3].x)
    const maxX = Math.max(result.cornerPoints[0].x,result.cornerPoints[1].x,result.cornerPoints[2].x,result.cornerPoints[3].x)
    const minY = Math.min(result.cornerPoints[0].y,result.cornerPoints[1].y,result.cornerPoints[2].y,result.cornerPoints[3].y)
    const maxY = Math.max(result.cornerPoints[0].y,result.cornerPoints[1].y,result.cornerPoints[2].y,result.cornerPoints[3].y)

    const width = maxX - minX
    const height = maxY - minY

    // setBB({origin:{x: minX, y:minY}, size:{height: height, width:width}})

    //Check barcode is big enough, small if both the height% and width% are below the thresold
    if((width / screenWidth) < sizePercentThreshold && (height / screenHeight) < sizePercentThreshold) {
      console.log(`BCS: barcode is too small: width%=${width / screenWidth}, height%=${height / screenHeight}`)
      return
    }

    //Check if too close to the bottom or top, if highest Y is in top threshold or lowest Y is in bottom threshold 
    if(minY < (deadzonePercent*screenHeight) || maxY > ((1-deadzonePercent)*screenHeight)) {
      console.log(`BCS: barcode is in the deadzone`)
      return
    }


    //check is only numbers
    if (result.data.match(/^[0-9]+$/) == null) {
      console.log("BCS: barcode found in wrong format: ", result.data)
      return
    }

    //console.log("BCS: Notify parent")

    //Tell parent, found a barcode
    props.onBarCodeScanned(result.data)

    lastSuccessScan.current = new Date()

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
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
            BarCodeScanner.Constants.BarCodeType.upc_a,
            BarCodeScanner.Constants.BarCodeType.upc_e,
            BarCodeScanner.Constants.BarCodeType.upc_ean,
          ],
          interval: 500//don't think this works
        }}
        onBarCodeScanned={(e)=> handleBarCodeScanned(e)}
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

const outlineThickness = 2
const outlineSize = 30
const outlineColor = "white"
const outlineBorderRadius = 15

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
    height: outlineSize, 
    width: outlineSize, 
    borderColor: outlineColor, 
    borderTopWidth: outlineThickness, 
    borderLeftWidth: outlineThickness, 
    borderTopLeftRadius: outlineBorderRadius
  },

  grid_bl: {
    height: outlineSize, 
    width: outlineSize, 
    borderColor: outlineColor, 
    borderBottomWidth: outlineThickness, 
    borderLeftWidth: outlineThickness, 
    borderBottomLeftRadius: outlineBorderRadius
  },

  grid_tr: {
    height: outlineSize, 
    width: outlineSize, 
    borderColor: outlineColor, 
    borderTopWidth: outlineThickness, 
    borderRightWidth: outlineThickness, 
    borderTopRightRadius: outlineBorderRadius
  },

  grid_br: {
    height: outlineSize, 
    width: outlineSize, 
    borderColor: outlineColor, 
    borderBottomWidth: outlineThickness, 
    borderRightWidth: outlineThickness, 
    borderBottomRightRadius: outlineBorderRadius
  },

});
