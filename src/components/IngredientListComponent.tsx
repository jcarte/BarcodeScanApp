import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { Ingredient, FodmapStatus}  from '../api/ProductHandler'

export function IngredientListComponent({  product  }) {

  console.log("ILC: Start")

  const GetStatusWording = (ingredient: Ingredient) =>
  {
    //console.log(ingredient.name, " - ", ingredient.percent)
    const roundPercent = ingredient.percent > 1 ? 
      Math.round(ingredient.percent) : "<1"
      //parseFloat(ingredient.percent.toPrecision(1))

    switch (ingredient.fodmapStatus) {
        case FodmapStatus.High:
            return (<Text>{roundPercent}% <FontAwesome name="exclamation-circle" size={16} color="#EF5350" /></Text>)
        case FodmapStatus.Medium:
            return (<Text>{roundPercent}% <FontAwesome name="exclamation-triangle" size={16} color="orange" /></Text>)
        case FodmapStatus.Low:
            return (<Text>{roundPercent}% <FontAwesome name="check-circle" size={16} color="#26BD65" /></Text>)
        case FodmapStatus.Unknown:
        default:
            return (<Text>{roundPercent}% <FontAwesome name="question-circle" size={16} color="lightgrey" /></Text>)
      }
  }

  product.ingredients.sort(function (a, b) {
    return b.fodmapStatus - a.fodmapStatus || b.percent - a.percent;
  })
  
  return (
    <FlatList 
        data={product.ingredients}
        keyExtractor={(i) => i.id}
        renderItem={({item}) =>
            <View style={styles.item_container}>
                <View style={styles.item_name}>
                    <Text style={styles.text_name}>{item.name}</Text>
                </View>
                <View style={styles.item_status}>
                    <Text style={styles.text_status}>{GetStatusWording(item)}</Text>
                </View>
            </View>
        }
        ListHeaderComponent={()=>
            <View style={styles.header_container}>
                
                <View style={styles.header_bottom_container}>
                    <Text style={styles.header_text}>Ingredients</Text>
                </View>
            </View>
        }
        ListFooterComponent={()=>
          <View style={styles.footer_container}></View>
        }
    />
  );
}


const styles = StyleSheet.create({

    
    //HEADER
    header_container: {
        flex: 1,
        //borderBottomWidth: 1,
        //marginTop: 35,
    },
    footer_container: {
      height:50, // empty padding
    },

    header_bottom_container:{
        flex: 1,
        marginLeft: 25,
        marginTop: 25,
        marginBottom: 10,
        //borderBottomWidth: 1,
    },
 
    header_text:{
        //borderWidth: 1,
        color: '#242424',//off black
        fontWeight: "bold",
        fontSize: 18,

    },





    //ITEMS
    item_container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        height: 60,
        paddingLeft: 25,
        paddingRight: 25,
        
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        
    },
    item_name:{
        flexShrink: 1,
        justifyContent: "center",
        
        // borderWidth: 1,
    },
    item_status:{
        justifyContent: "center",
        // borderWidth: 1,
        paddingLeft: 20,
    },
    
    text_name:{
        color: '#242424',//off black
        fontSize: 16,
        textTransform: "capitalize",
        
    },
    text_status:{
        color: '#969696',//grey
        fontSize: 16,
    },

});







/*
const product = {
        name: "Cheese Onion Flavour Potato Crisps",
        brand: "Walkers",
        fodmapStatus: "high",
        imgUrl: "https://images.openfoodfacts.org/images/products/51000005/front_en.34.400.jpg",
        ingredients: [
          {
            fodmapStatus: "unknown",
            name: "cheese-and-onion-flavour-potato-crisps-ingredients"
          },
          {
            fodmapStatus: "low",
            name: "sunflower-oil"
          },
          {
            fodmapStatus: "low",
            name: "rapeseed-oil"
          },
          {
            fodmapStatus: "unknown",
            name: "cheese-and-onion-seasoning"
          },
          {
            fodmapStatus: "high",
            name: "dehydrated-onion"
          },
          {
            fodmapStatus: "unknown",
            name: "sait"
          },
          {
            fodmapStatus: "high",
            name: "whey"
          },
          {
            fodmapStatus: "high",
            name: "lactose"
          },
          {
            fodmapStatus: "high",
            name: "milk"
          },
          {
            fodmapStatus: "low",
            name: "sugar"
          },
          {
            fodmapStatus: "medium",
            name: "flavouring"
          },
          {
            fodmapStatus: "unknown",
            name: "contains-mik"
          },
          {
            fodmapStatus: "high",
            name: "cheese"
          },
          {
            fodmapStatus: "high",
            name: "milk"
          },
          {
            fodmapStatus: "low",
            name: "yeast"
          },
          {
            fodmapStatus: "low",
            name: "acid"
          },
          {
            fodmapStatus: "medium",
            name: "whey-protein"
          },
          {
            fodmapStatus: "unknown",
            name: "dried-garlic-colours"
          },
          {
            fodmapStatus: "unknown",
            name: "antioxidant"
          }
        ],
        
      }
*/