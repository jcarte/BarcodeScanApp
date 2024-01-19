import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from './ProductHandler.js'

import { FullResultsComponent } from './FullResultsComponent.js';
import { BarcodeScannerComponent } from './BarcodeScannerComponent.js';
import { MessageComponent } from './MessageComponent.js';

import BottomSheet from '@gorhom/bottom-sheet';

export function HomeScreen({ route, navigation }) {

  console.log("Home: start")
  const ph = new ProductHandler()
  
  const[results, setResults] = useState({status: "init", product: null})

  const [allowScanning, setAllowScanning] = useState(true);

  const handleBarCode = async (bc) => {
    console.log('Home: Handle barcode:', bc)

    console.log("Home: stop allowing scanning")
    setAllowScanning(false)

    if(bc === results.product?.barcode)
    {
      console.log("Home: same barcode detected, skipping fetch")
    }
    else
    {
      console.log("Home: barcode fetch:",bc)
      const p = await ph.FetchProduct(bc)
      setResults(p)
    }
    
    console.log("Home: allow scanning in 3 secs")
    setTimeout(() => { setAllowScanning(true); }, 3000)
  }

  const getMessageText = () =>
  {
    switch (results.status) {
      case "init":
        return "Scan a product barcode to start"
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


  // ref
  const sheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => {return results.status==='ok'? [240,"90%"]: [240]});

  //DOESN'T WORK
  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('Home: handleSheetChanges', index)

    //if maximising results stop scanning
    if(index === 1)
      setAllowScanning(false)
    else
      setAllowScanning(true);
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BottomSheet
        ref={sheetRef}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        handleIndicatorStyle={!results.product && {opacity: 0, height: 0}}//only show resize handle if can resize
        backdropComponent={()=>
          <View style={StyleSheet.absoluteFillObject}>
            <BarcodeScannerComponent onBarCodeScanned ={allowScanning? handleBarCode : undefined} allowScanning ={allowScanning}/>
          </View>
        }
      >
        {results.status !== 'ok' && <MessageComponent messageText={getMessageText()}  style={StyleSheet.absoluteFillObject}/>}
        {results.product && <FullResultsComponent product={results.product}/>}
      </BottomSheet>
    </View>
  )

  


}

/*


      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={useMemo(() => ['25%', '40%'], [])}
        onChange={handleSheetChanges}
        backdropComponent={()=>
          <View style={StyleSheet.absoluteFillObject}>
            <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} allowScanning ={allowScanning}/>
          </View>
        }
      >
        
          <FullResultsScreen product={pro}/>
      
      </BottomSheet>



---
<View elevation={0} style={[styles.results_summary_container  ]}>
</View>
----
    <View style={styles.container}>

    </View>
      <View elevation={0} style={[styles.results_summary_container  ]}>
          {product && <ResultsSummaryComponent product={product}/>}
      </View>

    <View style={styles.container}>
      <FullResultsScreen product={product}/>
    </View>
*/

const styles = StyleSheet.create({

  results_summary_container:{
    //position: "absolute",
    flex:1,
    //bottom:0,
    height: 200,
    width: "100%",
  },


  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
});
