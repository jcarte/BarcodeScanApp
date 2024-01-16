import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from './ProductHandler.js'
import { ResultsComponent } from './ResultsComponent.js';

export function HomeScreen({ route, navigation }) {

  const {barcode} = route.params;

  const ph = new ProductHandler()
  
  const[product, setProduct] = useState({
    brand: "Walkers",
    fodmapStatus: "high",
    imgUrl: "https://images.openfoodfacts.org/images/products/51000005/front_en.34.400.jpg",
    name: "Cheese Onion Flavour Potato Crisps"
  })
  

  //



  const fetchData= async (id) => {
    try 
    {
        console.log(id)
        
        //const p = await ph.FetchProduct(id)

        //setProduct(p)
    } catch(error) {
        console.log(error)
    }
  }

  useEffect(() => {
    console.log('Use Effect')

    // if (!product)
    // {
      console.log("set initial fake product")
      //REMOVE
      const p = {
        brand: "Walkers",
        fodmapStatus: "high",
        imgUrl: "https://images.openfoodfacts.org/images/products/51000005/front_en.34.400.jpg",
        name: "Cheese Onion Flavour Potato Crisps"
      }
      setProduct(p)
    // }




    if(barcode !='')
    {
      fetchData(barcode);
    }
  },[barcode])


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
*/


  return (
    <View style={styles.container}>
      <View style= {[styles.row, {flex:3}]}>
        <Button 
          title='Scan Barcode'
          onPress={() => navigation.navigate('Scanner')}
        />
      </View>
      <View style= {[styles.row, {flex:1}]}>
        <ResultsComponent product={product}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignSelf: "stretch",
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff',
    fontFamily: 'sans-serif'
  },

  row: {
    flex:1, 
    
    flexDirection:'column', 
    justifyItems: 'center', 
    alignItems: 'center', 
    alignSelf:'stretch', 
    
  }
  
});
