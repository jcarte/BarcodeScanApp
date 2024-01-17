import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from './ProductHandler.js'
import { ResultsSummaryComponent } from './ResultsSummaryComponent.js';
import { FullResultsScreen } from './FullResultsScreen.js';
import { BarcodeScannerComponent } from './BarcodeScannerComponent.js';

export function HomeScreen({ route, navigation }) {

  //const {barcode} = "";
  console.log("we're home")
  const ph = new ProductHandler()
  
  const[product, setProduct] = useState(null)

  // const[product, setProduct] = useState({
  //   brand: "Walkers",
  //   fodmapStatus: "high",
  //   imgUrl: "https://images.openfoodfacts.org/images/products/51000005/front_en.34.400.jpg",
  //   name: "Cheese Onion Flavour Potato Crisps"
  // })
  

  const handleBarCode = async (bc) => {
    console.log('Handle barcode home:', bc)
    //fetchData(bc)

    try 
    {
        console.log("home barcode fetch:",bc)
        
        const p = await ph.FetchProduct(bc)

        //console.log(p)
        setProduct(p)

        //navigation.navigate("Results", {product: p})

    } catch(error) {
        console.log(error)
    }

  };



  // const fetchData= async (id) => {
  //   try 
  //   {
  //       console.log("home barcode fetch:",id)
        
  //       const p = await ph.FetchProduct(id)

  //       //console.log(p)
  //       //setProduct(p)

  //       navigation.navigate("Results", {product: p})

  //   } catch(error) {
  //       console.log(error)
  //   }
  // }

   useEffect(() => {
     console.log('Use Effect')

  //   // if (!product)
  //   // {
  //     // console.log("set initial fake product")
  //     // //REMOVE
  //     // const p = {
  //     //   brand: "Walkers",
  //     //   fodmapStatus: "high",
  //     //   imgUrl: "https://images.openfoodfacts.org/images/products/51000005/front_en.34.400.jpg",
  //     //   name: "Cheese Onion Flavour Potato Crisps"
  //     // }
  //     // setProduct(p)
   })




  //   // if(barcode !='')
  //   // {
  //   //   fetchData(barcode);
  //   // }
  // },[barcode])


//<View style={ (product ? (product.hasIrritants? styles.containerR : styles.containerG ) : styles.containerW) }>

/* 
<View style={styles.container}>
  <View style={styles.circle} />
  <View style= {{flex:2, justifyContent: 'flex-end', alignItems: 'center'}}>
    {product && <Image style={[styles.thumb_image, {height: thumbImageSize, width: thumbImageSize}]} source={product.hasIrritants ? require('./Images/thumbs_down.png') : require('./Images/thumbs_up.png')} resizeMode='cover'  />}
    {product && <Text style={styles.thumb_text}> {(product.hasIrritants ? 'Irritants Found' : 'No Irritants Found')} </Text>}
  </View>
  <View style= {{flex:2, justifyContent: 'center', alignItems: 'center'}}>
  {product && <Image style={[styles.prod_image, {height: prodImageSize, width: prodImageSize}]} source={{uri:product.imgUrl}} resizeMode='cover'  />}
  {product && <Text style={styles.product_text}>{product.brand} {product.name}</Text>}
  </View>
  
</View> 
---
<View style= {[styles.row, {flex:3}]}>
        <Button 
          title='Scan Barcode'
          onPress={() => navigation.navigate('Scanner')}
        />
      </View>
      <View style= {[styles.row, {flex:1}]}>
        <ResultsSummaryComponent product={product}/>
      </View>
*/

const trayHeight = Dimensions.get('window').height*.3


//,{height: {trayHeight}}


  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BarcodeScannerComponent onBarCodeScanned ={handleBarCode}/>
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
  }

  // container: {
  //   flex: 1, 
  //   alignSelf: "stretch",
  //   alignItems: 'center', 
  //   justifyContent: 'center',
  //   backgroundColor: '#fff',
  //   fontFamily: 'sans-serif'
  // },

  // row: {
  //   flex:1, 
    
  //   flexDirection:'column', 
  //   justifyItems: 'center', 
  //   alignItems: 'center', 
  //   alignSelf:'stretch', 
    
  // }
  
});
