import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { FetchProduct } from '../api/ProductHandler'

import { FullResultsComponent } from '../components/FullResultsComponent.js';
import { BarcodeScannerComponent } from '../components/BarcodeScannerComponent.js';
import { MessageComponent } from '../components/MessageComponent.js';

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export function HomeScreen() {

  console.log("Home: Start")

  const[isResultsExpanded, setIsResultsExpanded] = useState(false)
  const[status, setStatus] = useState("init")
  const[product, setProduct] = useState(null)

  //For bottom sheet
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [240,"90%"], []);

  const handleBarCode = async (bc) : Promise<void> =>
  {
    console.log('Home: Handle barcode:', bc)
    console.log('Home: handleBarCode: is results expanded?:', isResultsExpanded)

    //show modal
    sheetRef.current?.present();

    if(isResultsExpanded)//if results are up then abandon
    {
      console.log('Home: handleBarCode: abandoning as results are up?')
    }
    else if(bc === product?.barcode)
    {
      console.log("Home: same barcode detected, skipping fetch")
    }
    else
    {
      console.log("Home: barcode fetch:",bc)
      const p = await FetchProduct(bc)

      setStatus(p.status)
      setProduct(p.product)
    }
  }

  const getMessageText = () : string =>
  {
    if (!status) return "";
    switch (status) {
      case "init":
        return "Scan a product barcode to start..."
      case "error":
        return "There was a problem looking up this product, try again"
      case "notFound":
        return "Product not found"
      case "incomplete":
        return "We couldn't find enough information about this product"
      default:
        return "";
    }
  }

  // callbacks
  const handleSheetChanges = useCallback( (index:number) => {
    console.log('Home: handleSheetChanges', index)

    //if maximising results stop scanning
    if(index === 1)
    {
      setIsResultsExpanded(true)
    }
    else
    {
      setIsResultsExpanded(false)
    }
      
  }, [])


  
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={StyleSheet.absoluteFillObject}>
          <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} scanInterval = {3000}/>
        </View>
        <BottomSheetModal
          ref={sheetRef}
          index={0}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          animateOnMount={false}
          enablePanDownToClose={false}
        >
          <View style={styles.contentContainer}>
            {status !== 'ok' && <MessageComponent messageText={getMessageText()}/>}
            {product && <FullResultsComponent product={product}/>}
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
});

