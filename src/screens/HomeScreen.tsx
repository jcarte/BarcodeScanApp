import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from '../api/ProductHandler.js'

import { FullResultsComponent } from '../components/FullResultsComponent.js';
import { BarcodeScannerComponent } from '../components/BarcodeScannerComponent.js';
import { MessageComponent } from '../components/MessageComponent.js';

import BottomSheet from '@gorhom/bottom-sheet';

export function HomeScreen() {

  console.log("Home: Start")

  const[isResultsExpanded, setIsResultsExpanded] = useState(false)
  const[status, setStatus] = useState("init")
  const[product, setProduct] = useState(null)

  //For bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [240,"90%"], []);


  // useMemo(() => {
  //   this.snapPoints = results.status==='ok'? [240,"90%"]: [240]
  // }, []);


  const handleBarCode = async (bc) : Promise<void> =>
  {
    console.log('Home: Handle barcode:', bc)
    console.log('Home: handleBarCode: is results expanded?:', isResultsExpanded)

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
      const p = await ProductHandler(bc)

      setStatus(p.status)
      setProduct(p.product)
    }
  }

  const getMessageText = () : string =>
  {
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
  const handleSheetChanges = useCallback( index => {
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
      <View style={StyleSheet.absoluteFillObject}>
        <BottomSheet
          ref={sheetRef}
          index={0}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          handleIndicatorStyle={!product && {opacity: 0, height: 0}}//only show resize handle if can resize
          backdropComponent={()=>
            <View style={StyleSheet.absoluteFillObject}>
              <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} scanInterval = {3000}/>
            </View>
          }
        >
          <View style={styles.container}>
            {status !== 'ok' && <MessageComponent messageText={getMessageText()}/>}
            {product && <FullResultsComponent product={product}/>}
          </View>
        </BottomSheet>
      </View>
    )
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  
});
