import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { FetchProduct}  from '../api/ProductHandler'

import { IngredientListComponent } from '../components/IngredientListComponent';
import { BarcodeScannerComponent } from '../components/BarcodeScannerComponent';
import { MessageComponent } from '../components/MessageComponent.js';
import BottomSheetComponent from '../components/BottomSheetComponent';
import { ProductHeaderComponent } from '../components/ProductHeaderComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePostHog} from 'posthog-react-native'



export function HomeScreen() {

  console.log("Home: Start: Is Dev: " + __DEV__)

  const analytics = usePostHog()//setup posthog analytics

  const isResultsExpanded = useRef(false)
  const[status, setStatus] = useState("init")
  const[product, setProduct] = useState(null)
  const[errorMessage, setErrorMessage] = useState("")

  const[lastBarcode, setLastBarcode] = useState(null)

  const sheetRef = useRef(null);

  const handleBarCode = async (bc) : Promise<void> =>
  {
    
    console.log('Home: Handle barcode:', bc)
    //console.log('Home: handleBarCode: is results expanded?:', isResultsExpanded.current)

    if(isResultsExpanded.current)//if results are up then abandon
    {
      console.log('Home: handleBarCode: abandoning as results are up')
    }
    else if(bc === lastBarcode)
    {
      console.log("Home: same barcode detected, skipping fetch")
    }
    else
    {

      setLastBarcode(bc)

      //show modal
      sheetRef.current?.open();

      console.log("Home: barcode fetch:",bc)
      const p = await FetchProduct(bc)
      setStatus(p.status)
      setProduct(p.product)
      setErrorMessage(p.errorMessage)

      analytics.capture('bsa_scan_barcode', {
        barcode: bc,
        status: p.status,
        product: p.product
      })

      analytics.capture('bsa_scan_status_'+p.status)
      //console.log("Home: Fetched Product:",p)

      if(p.product != null)
        analytics.capture('bsa_scan_result_rag_'+p.product.fodmapStatus)

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
        return "There was a problem looking up this product, please try again"
      case "notFound":
        return `Sorry, we don't have any info about this product (${lastBarcode})`
      case "incomplete":
        return `Sorry, we don't have enough info about this product (${lastBarcode})`
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
      analytics.capture('bsa_bottom_sheet_maximise')
    }
    else
    {
      isResultsExpanded.current = false
      analytics.capture('bsa_bottom_sheet_minimise')
    }
      
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
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
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

