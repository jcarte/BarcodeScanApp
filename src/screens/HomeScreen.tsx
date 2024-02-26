import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { FetchProduct } from '../api/ProductHandler'

import { IngredientListComponent } from '../components/IngredientListComponent.js';
import { BarcodeScannerComponent } from '../components/BarcodeScannerComponent';
import { MessageComponent } from '../components/MessageComponent.js';

import BottomSheetComponent from '../components/BottomSheetComponent';


import { ProductHeaderComponent } from '../components/ProductHeaderComponent';

export function HomeScreen() {

  console.log("Home: Start")

  const isResultsExpanded = useRef(false)
  const[status, setStatus] = useState("init")
  const[product, setProduct] = useState(null)

  const sheetRef = useRef(null);


  const handleBarCode = async (bc) : Promise<void> =>
  {
    console.log('Home: Handle barcode:', bc)
    //console.log('Home: handleBarCode: is results expanded?:', isResultsExpanded.current)

    if(isResultsExpanded.current)//if results are up then abandon
    {
      console.log('Home: handleBarCode: abandoning as results are up')
    }
    else if(bc === product?.barcode)
    {
      console.log("Home: same barcode detected, skipping fetch")
    }
    else
    {
      //show modal
      sheetRef.current?.open();

      console.log("Home: barcode fetch:",bc)
      const p = await FetchProduct(bc)

      //console.log("Home: Fetched Product:",p)

      setStatus(p.status)
      setProduct(p.product)

      //if error then reduce size of BS to display message
      if(p.status !== "ok")
        sheetRef.current?.collapse()
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
      isResultsExpanded.current = true
    }
    else
    {
      isResultsExpanded.current = false
    }
      
  }, [])

   return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <BarcodeScannerComponent 
          onBarCodeScanned ={handleBarCode} 
          refreshIntervalMS = {750}  
          timeoutAfterScanMS = {3000}  
          />
      </View>
      
      <BottomSheetComponent
        collapsedHeight={240}
        expandedHeight={"95%"}
        onChange={handleSheetChanges}
        ref={sheetRef}
        startsOpen={false}
        isDragEnabled={status === "ok"}
        headerComponent={()=>
          <View style={{flex:1}}>
              {status === "ok" && <ProductHeaderComponent product={product}/>}
              {status !== "ok" && <MessageComponent messageText={getMessageText()}/>}
          </View>
        }
      >
        {product && <IngredientListComponent product={product}/>}
      </BottomSheetComponent>
      
    </View>
   )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

