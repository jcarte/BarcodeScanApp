import React, { useRef } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

import * as ImageManipulator from 'expo-image-manipulator';
import { BarcodeScanningResult, CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera'

import { BarcodeBoxGuideComponent } from './BarcodeBoxGuideComponent';



interface BarcodeScannerComponentProps {
  onBarCodeScanned?: (barcode: string, imageUri: string) => void
  refreshIntervalMS?: number
  timeoutAfterScanMS?: number
}

export function BarcodeScannerComponent({
  refreshIntervalMS = 1000,
  timeoutAfterScanMS = 1000,
  onBarCodeScanned = () => { } }: BarcodeScannerComponentProps) {

  const lastAttemptScan = useRef(new Date('0001-01-01T00:00:00Z'))//start at min time - last time the BCS found a BC and we assessed it
  const lastSuccessScan = useRef(new Date('0001-01-01T00:00:00Z'))//start at min time - last time found a BC and raised the barcode scanned event
  const [permission, requestPermission] = useCameraPermissions();

  const [isProcessingBarcode, setIsProcessingBarcode] = React.useState<boolean>(false)//so multiple barcodes don't interfere with each other

  console.log("BCS: Start")

  const cameraRef = useRef<CameraView>(null);

  async function handleBarCodeScannedAsync(result: BarcodeScanningResult): Promise<void> {

    //Check if it's time to check barcode again - timeout after each attempt
    if ((new Date().getTime() - lastAttemptScan.current.getTime()) < refreshIntervalMS)
      return

    lastAttemptScan.current = (new Date())//update last attempt time (as this is now an attempt)

    if (isProcessingBarcode) { //don't do another while processing old one
      // console.log("BCS: Is processing barcode, cancelling")
      return
    }

    //check if it's been long enough after the last successful barcode detected
    if ((new Date().getTime() - lastSuccessScan.current.getTime()) < timeoutAfterScanMS)
      return

    const barcode = result.data


    setIsProcessingBarcode(true)//is now working on barcode
    console.log("BCS: Found barcode", barcode)


    ////////CHECK BARCODE IS BIG ENOUGH - DOESNT WORK ON IOS
    // const screenWidth = useMemo(() => Dimensions.get('window').width, [])
    // const screenHeight = useMemo(() => Dimensions.get('window').height, [])

    // const sizePercentThreshold = 0.20
    // const deadzonePercent = 0.2

    // console.log(result)

    // //Run barcode size checks, only works on android as ios returns rubbish (width: 0.002)
    // if (Platform.OS == "android") {
    //   const minX = Math.min(result.cornerPoints[0].x, result.cornerPoints[1].x, result.cornerPoints[2].x, result.cornerPoints[3].x)
    //   const maxX = Math.max(result.cornerPoints[0].x, result.cornerPoints[1].x, result.cornerPoints[2].x, result.cornerPoints[3].x)
    //   const minY = Math.min(result.cornerPoints[0].y, result.cornerPoints[1].y, result.cornerPoints[2].y, result.cornerPoints[3].y)
    //   const maxY = Math.max(result.cornerPoints[0].y, result.cornerPoints[1].y, result.cornerPoints[2].y, result.cornerPoints[3].y)

    //   const width = maxX - minX
    //   const height = maxY - minY

    //   // setBB({origin:{x: minX, y:minY}, size:{height: height, width:width}})

    //   //Check barcode is big enough, small if both the height% and width% are below the thresold
    //   if ((width / screenWidth) < sizePercentThreshold && (height / screenHeight) < sizePercentThreshold) {
    //     console.log(`BCS: barcode is too small: width%=${width / screenWidth}, height%=${height / screenHeight}, width=${width}, screenWidth=${screenWidth}, height=${height}, screenHeight=${screenHeight}`)
    //     return
    //   }

    //   //Check if too close to the bottom or top, if highest Y is in top threshold or lowest Y is in bottom threshold 
    //   if (minY < (deadzonePercent * screenHeight) || maxY > ((1 - deadzonePercent) * screenHeight)) {
    //     console.log(`BCS: barcode is in the deadzone: width%=${width / screenWidth}, height%=${height / screenHeight}, width=${width}, screenWidth=${screenWidth}, height=${height}, screenHeight=${screenHeight}`)
    //     return
    //   }
    // }
    ////////

    //check is only numbers
    if (barcode.match(/^[0-9]+$/) == null) {
      console.log("BCS: barcode found in wrong format: ", barcode)
      setIsProcessingBarcode(false)
      return
    }

    const b64Image: string = await takePictureAsync()

    //Tell parent, found a barcode
    onBarCodeScanned?.(barcode, b64Image)

    lastSuccessScan.current = new Date()
    setIsProcessingBarcode(false)//finished processing

  }

  async function takePictureAsync(): Promise<string> {

    if (!cameraRef?.current) {
      console.log("BCS: No camera reference, can't take pic")
      return ""
    }

    try {
      console.log("BCS: Taking picture")
      //Take picture for not founds
      const picture: CameraCapturedPicture = await cameraRef.current.takePictureAsync({
        base64: true,
        exif: false,
        // imageType: 'png',
        quality: 0,//high compression, low quality
      })

      console.log("BCS: Resizing picture")

      const RESIZED_WIDTH = 300
      const image: ImageManipulator.ImageResult = await ImageManipulator.manipulateAsync(
        picture.uri,
        [{ resize: { width: RESIZED_WIDTH } }],
        { base64: true, compress: 0, format: ImageManipulator.SaveFormat.PNG })

      // console.log("IMAGE SIZE BEFORE: ", picture.base64.length)
      // console.log("IMAGE SIZE AFTER: ", image.base64.length)
      const b64Image = "data:image/png;base64," + image.base64.replaceAll(" ", "+")

      return b64Image

    } catch (error) {
      console.log("BCS: Taking picture errored: ", error)
      return ""
    }
  }



  // //Permission
  // console.log("BCS: Has Permission: ", permission)

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, borderWidth: 0, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ textAlign: 'center' }}>Please give permission to access the camera</Text>
          <View style={{ height: 15 }}></View>
          <Button onPress={requestPermission} title="Grant Permission" color="blue" />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      <CameraView
        barcodeScannerSettings={{
          // Barcode Types List: https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/#supported-formats
          barcodeTypes: [
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
          ],

        }}
        onBarcodeScanned={(e) => handleBarCodeScannedAsync(e)}
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
      />
      <BarcodeBoxGuideComponent />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
