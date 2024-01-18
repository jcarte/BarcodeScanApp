import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from './ProductHandler.js'
import { ResultsSummaryComponent } from './ResultsSummaryComponent.js';
import { FullResultsComponent } from './FullResultsComponent.js';
import { BarcodeScannerComponent } from './BarcodeScannerComponent.js';
import BottomSheet from '@gorhom/bottom-sheet';

export function HomeScreen({ route, navigation }) {

  console.log("Home: start")
  const ph = new ProductHandler()
  
  const[product, setProduct] = useState(null)

  const [allowScanning, setAllowScanning] = useState(true);

  const handleBarCode = async (bc) => {
    console.log('Home: Handle barcode:', bc)

    console.log("Home: stop allowing scanning")
    setAllowScanning(false)

    if(bc === product?.barcode)
    {
      console.log("Home: same barcode detected, skipping fetch")
    }
    else
    {
      try 
      {
        console.log("Home: barcode fetch:",bc)
        const p = await ph.FetchProduct(bc)
        setProduct(p)
      } catch(error) {
        console.log(error)
      }
    }
    
    console.log("Home: allow scanning in 3 secs")
    setTimeout(() => { setAllowScanning(true); }, 3000)
  }




  // ref
  const sheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => [240, '90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);



  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={()=>
          <View style={StyleSheet.absoluteFillObject}>
            <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} allowScanning ={allowScanning}/>
          </View>
        }
      >
        {product && <FullResultsComponent product={product}/>}
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
