import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';



export function HomeScreen({ route, navigation }) {

  const {barcode} = route.params;

  //https://world.openfoodfacts.org/api/v2/product/01041859.json
  //json.product.product_name
  //json.product.brands

  // type Product = {
  //   name: string;
  //   brand: string;
  // }

  
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

 

  return (
    <View style={ (product ? (product.hasIrritants? styles.containerR : styles.containerG ) : styles.containerW) }>
      
      {barcode != '' && <Text>Barcode: {barcode}</Text>}
      {product && <Text>Product: {product.brand} {product.name}</Text>}
      <Button 
        title='Scan Barcode'
        onPress={() => navigation.navigate('Scanner')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerW: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  containerR: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f00'
  },
  containerG: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#0f0'
  }
});
