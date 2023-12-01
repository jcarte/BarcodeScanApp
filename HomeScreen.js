import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';



export function HomeScreen({ route, navigation }) {

  const {barcode} = route.params;

  //https://world.openfoodfacts.org/api/v2/product/01041859.json
  
  const[product, setProduct] = useState(null)

  const fetchData= async (id) => {
    try 
    {
        console.log(id)
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${id}`)
        const json = await response.json();
        //console.log(json)


        const irrList= ["acesulfame", "alcohol", "apple", "apricot", "artichoke", "asparagus", "aspartame", "barley", "bean", "bitter gourd", "bitter melon", "blackberry", "cabbage", "caffeine", "cauliflower", 
          "cherry", "chickpea", "chips", "chocolate", "cocoa", "coffee", "condensed milk", "crisps", "custard apple (cherimoya)", "ethanol", "garlic", "gluten", "goat's milk", "grapefruit", "green pea", 
          "high fructose corn syrup", "honey", "kefir", "kidney bean", "lentil", "maltitol", "mango", "milk", "miso", "mung bean", "mushroom", "nectarine", "onion", "pear", "peas", "plum", "rice cakes", 
          "rye", "saccharin", "saki", "shallot", "snap pea", "snow pea", "sorbitol", "soy sauce", "soybean", "spam", "split pea", "sucralose", "sweetcorn", "tea", "triticale", "watermelon", "wheat", "wheat flour", 
          "xylitol", "yoghurt"]

        let p = {
          name: json.product.product_name,
          brand: json.product.brands,
          imgUrl: json.product.image_url,
          ingredients: json.product.ingredients.map((i) => 
          ({
            name: i.text,
            isIrritant: (irrList.indexOf(i.text.toLowerCase()) > -1 )
          })),
          hasIrritants : false
        }

        p.hasIrritants = p.ingredients.some((i) => i.isIrritant)
        console.log(p)

        setProduct(p)
    } catch(error) {
        console.log(error)
    }
  }

  useEffect(() => {
    console.log('Use Effect')
    if(barcode !='')
    {
      fetchData(barcode);
    }
  },[barcode])

  const prodImageSize = Dimensions.get('window').width*.6
  const thumbImageSize = Dimensions.get('window').width*.3
//<View style={ (product ? (product.hasIrritants? styles.containerR : styles.containerG ) : styles.containerW) }>
  return (
    <View style={styles.container}>
      
      <View style= {{flex:2, justifyContent: 'flex-end', alignItems: 'center'}}>
        {product && <Image style={[styles.thumb_image, {height: thumbImageSize, width: thumbImageSize}]} source={product.hasIrritants ? require('./Images/thumbs_down.png') : require('./Images/thumbs_up.png')} resizeMode='cover'  />}
        {product && <Text style={styles.thumb_text}> {(product.hasIrritants ? 'Irritants Found' : 'No Irritants Found')} </Text>}
      </View>
      <View style= {{flex:2, justifyContent: 'center', alignItems: 'center'}}>
      {product && <Image style={[styles.prod_image, {height: prodImageSize, width: prodImageSize}]} source={{uri:product.imgUrl}} resizeMode='cover'  />}
      {product && <Text style={styles.product_text}>{product.brand} {product.name}</Text>}
      </View>
      <View style= {{flex:1, flexDirection:'column', justifyItems: 'center', alignItems: 'center', borderWidth: 0, alignSelf:'stretch', padding: 15}}>
        <Button 
          title='Scan Barcode'
          onPress={() => navigation.navigate('Scanner')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff',
    fontFamily: 'sans-serif'
  },
  prod_image: {
    borderColor: '#000',
    borderWidth: 2,
  },
  thumb_image: {
    borderColor: '#000',
    borderWidth: 0,
  },
  thumb_text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  product_text: {
    fontSize: 18,
    textTransform: 'capitalize',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
  },
  
});
