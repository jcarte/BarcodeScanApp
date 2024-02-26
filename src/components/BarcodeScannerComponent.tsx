import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BarCodeScanningResult, Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

export function BarcodeScannerComponent(props) {
  const [lastScan, setLastScan] = useState(new Date('0001-01-01T00:00:00Z'))//start at min time
  const [hasPermission, requestPermissions] = Camera.useCameraPermissions();

  const [bb, setBB] = useState(null)

  useEffect(() => {
    // console.log("BCS: use effect")
    // console.log("BCS has permission:", hasPermission)
    if (!hasPermission?.granted) {
      //console.log("BCS: requesting permissions")
      requestPermissions();
    }
  }, [hasPermission]);

  const screenWidth =  Dimensions.get('window').width
  const screenHeight =  Dimensions.get('window').height

  const sizePercentThreshold = 0.20
  const deadzonePercent = 0.2

  const handleBarCodeScanned = (result : any): void => {

    if ((new Date().getTime() - lastScan.getTime()) > props.scanInterval)//only scan at least every interval (specified in props)
    {
      //console.log(result)

      const minX = Math.min(result.cornerPoints[0].x,result.cornerPoints[1].x,result.cornerPoints[2].x,result.cornerPoints[3].x)
      const maxX = Math.max(result.cornerPoints[0].x,result.cornerPoints[1].x,result.cornerPoints[2].x,result.cornerPoints[3].x)
      const minY = Math.min(result.cornerPoints[0].y,result.cornerPoints[1].y,result.cornerPoints[2].y,result.cornerPoints[3].y)
      const maxY = Math.max(result.cornerPoints[0].y,result.cornerPoints[1].y,result.cornerPoints[2].y,result.cornerPoints[3].y)

      const width = maxX - minX
      const height = maxY - minY

      setBB({origin:{x: minX, y:minY}, size:{height: height, width:width}})

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
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
            BarCodeScanner.Constants.BarCodeType.upc_a,
            BarCodeScanner.Constants.BarCodeType.upc_e,
            BarCodeScanner.Constants.BarCodeType.upc_ean,
          ],
          interval: 30000
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


      {/* <View style={styles.grid_container}>
        <View style={{ width:bb?.size.width, height:bb?.size.height, borderWidth: 1, borderColor: "red", left: bb?.origin.x, top: bb?.origin.y}}/>
      </View> */}

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
