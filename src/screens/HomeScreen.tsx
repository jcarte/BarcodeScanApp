import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { FetchProduct } from '../api/ProductHandler'

import { FullResultsComponent } from '../components/FullResultsComponent.js';
import { BarcodeScannerComponent } from '../components/BarcodeScannerComponent.js';
import { MessageComponent } from '../components/MessageComponent.js';

import BottomSheetComponent from '../components/BottomSheetComponent';


import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

export function HomeScreen() {

  console.log("Home: Start")

  const[isResultsExpanded, setIsResultsExpanded] = useState(false)
  const[status, setStatus] = useState("init")
  const[product, setProduct] = useState(null)

  const sheetRef = useRef(null);


  //For Gorhom bottom sheet
  // const sheetRef = useRef<BottomSheetModal>(null);
  // const snapPoints = useMemo(() => [240,"90%"], []);

  const handleBarCode = async (bc) : Promise<void> =>
  {
    console.log('Home: Handle barcode:', bc)
    console.log('Home: handleBarCode: is results expanded?:', isResultsExpanded)

    //show modal
    //sheetRef.current?.present();

    //show modal
    sheetRef.current?.open();

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

      //console.log("Home: Fetched Product:",p)

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


  
//   return (
//     <BottomSheetModalProvider>
//       <View style={styles.container}>
//         <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} scanInterval = {3000}/>
            
//         <BottomSheetModal
//           ref={sheetRef}
//           index={0}
//           snapPoints={snapPoints}
//           onChange={handleSheetChanges}
//           animateOnMount={false}
//           enablePanDownToClose={false}
//         >
//           <BottomSheetView style={StyleSheet.absoluteFillObject}>
//             <View style={styles.contentContainer}>
//               {status !== 'ok' && <MessageComponent messageText={getMessageText()}/>}
//               {product && <FullResultsComponent product={product}/>}
//             </View>
//           </BottomSheetView>
//         </BottomSheetModal>
//       </View>
//     </BottomSheetModalProvider>
//   )
// }

   return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} scanInterval = {3000}  />
      </View>
      
      <BottomSheetComponent
        collapsedHeight={240}
        expandedHeight={"90%"}
        index={0}
        onChange={handleSheetChanges}
        ref={sheetRef}
      >
        {status !== 'ok' && <MessageComponent messageText={getMessageText()}/>}
        {product && <FullResultsComponent product={product}/>}
      </BottomSheetComponent>
      
    </View>
   )
}

/*

*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },


  contentContainer: {
    flex: 1,
  },
});

