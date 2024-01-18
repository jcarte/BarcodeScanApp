import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from './ProductHandler.js'
import { ResultsSummaryComponent } from './ResultsSummaryComponent.js';
import { FullResultsScreen } from './FullResultsScreen.js';
import { BarcodeScannerComponent } from './BarcodeScannerComponent.js';

export function HomeScreen({ route, navigation }) {

  console.log("Home: start")
  const ph = new ProductHandler()
  
  const[product, setProduct] = useState(null)

  const [allowScanning, setAllowScanning] = useState(true);

  

  const handleBarCode = async (bc) => {
    console.log('Home: Handle barcode:', bc)

    try 
    {
        console.log("Home: stop allowing scanning")
        setAllowScanning(false)

        console.log("Home: barcode fetch:",bc)
        
        const p = await ph.FetchProduct(bc)

        setProduct(p)

        console.log("Home: allow scanning in 3 secs")

        setTimeout(()=> {setAllowScanning(true)}, 3000)

        
    } catch(error) {
        console.log(error)
    }

  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} allowScanning ={allowScanning}/>
      <View elevation={0} style={[styles.results_summary_container  ]}>
          {product && <ResultsSummaryComponent product={product}/>}
      </View>
    </View>
  );
}

/*
    <View style={styles.container}>
      <FullResultsScreen product={product}/>
    </View>
*/

const styles = StyleSheet.create({

  results_summary_container:{
    position: "absolute",
    flex:1,
    bottom:0,
    height: 200,
    width: "100%",
  },
  
});
