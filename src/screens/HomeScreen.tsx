import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from '../api/ProductHandler.js'

import { FullResultsComponent } from '../components/FullResultsComponent.js';
import { BarcodeScannerComponent } from '../components/BarcodeScannerComponent.js';
import { MessageComponent } from '../components/MessageComponent.js';

import BottomSheet from '@gorhom/bottom-sheet';

export function HomeScreen() {

  console.log("Home: Start")

  //const[allowScanning, setAllowScanning] = useState(true)
  const[isResultsExpanded, setIsResultsExpanded] = useState(false)

  const[status, setStatus] = useState("init")

  const[product, setProduct] = useState(null)
  // const[state, setState] = useState(
  //   {
  //     results: {
  //       status: "init",
  //       product: null
  //     },
  //   })

  //const ph = new ProductHandler()

  
    //For bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [240,"90%"], []);


  // useMemo(() => {
  //   this.snapPoints = results.status==='ok'? [240,"90%"]: [240]
  // }, []);


  //console.log("Home: start, allow scanning:", allowScanning)
  // const ph = new ProductHandler()
  
  //const[results, setResults] = useState({status: "init", product: null})

  //const [allowScanning, setAllowScanning] = useState(true);

  const handleBarCode = async (bc) : Promise<void> =>
  {
    console.log('Home: Handle barcode:', bc)

    //console.log('Home: handleBarCode: allow scanning?:', allowScanning)
    console.log('Home: handleBarCode: is results expanded?:', isResultsExpanded)

    
    

    console.log("Home: stop allowing scanning")
    //setAllowScanning(false)
    // setState({
    //   allowScanning: false,
    //   results: state.results,
    //   isResultsExpanded: state.isResultsExpanded,
    // })

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

      //setResults(p)
      // setState({
      //   results: p,
      // })
      setStatus(p.status)
      setProduct(p.product)
    }
    
    //console.log("Home: allow scanning in 3 secs")
    //setTimeout(() => { setAllowScanning(true); }, 3000)
    // setTimeout(() => { setState({
    //   allowScanning: true,
    //   results: state.results,
    //   isResultsExpanded: state.isResultsExpanded,
    // }); }, 3000)
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
  const handleSheetChanges = (index: number): void => {
    console.log('Home: handleSheetChanges', index)

    //if maximising results stop scanning
    if(index === 1)
    {
      setIsResultsExpanded(true)
      // setState({
      //   results: state.results,
      //   isResultsExpanded: true,
      // })
    }
    else
    {
      setIsResultsExpanded(false)
      // setState({
      //   results: state.results,
      //   isResultsExpanded: false,
      // })
    }
      
  }

  
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

/*
<BarcodeScannerComponent onBarCodeScanned ={allowScanning? handleBarCode : undefined} allowScanning ={allowScanning}/>


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

  // results_summary_container:{
  //   //position: "absolute",
  //   flex:1,
  //   //bottom:0,
  //   height: 200,
  //   width: "100%",
  // },

  container: {
    flex: 1,
    //padding: 24,
    //backgroundColor: 'grey',
  },
  // contentContainer: {
  //   flex: 1,
  //   alignItems: 'center',
  // },
  
});
