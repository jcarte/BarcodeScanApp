import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export function IngredientListComponent({  product }) {


    const GetStatusWording = (fodmapStatus) =>
    {
        switch (fodmapStatus) {
            case 'high':
              return (<Text>Avoid <FontAwesome name="circle" size={16} color="red" /></Text>)
            case 'medium':
              return (<Text>Caution <FontAwesome name="circle" size={16} color="orange" /></Text>)
            case 'low':
              return (<Text>OK <FontAwesome name="circle" size={16} color="green" /></Text>)
            case 'unknown':
            default:
              return (<Text>Unknown <FontAwesome name="circle" size={16} color="lightgrey" /></Text>)
        }
    }

    const GetStatusSortOrder = (fodmapStatus) =>
    {
        switch (fodmapStatus) {
            case 'high':
                return 1
            case 'medium':
                return 2
            case 'low':
                return 3
            case 'unknown':
            default:
                return 4
        }
    }

    ings = product.ingredients.map(function (i) {
        return {
            key: i.name,
            name: i.name.replaceAll('-',' '), 
            fodmapStatusText: GetStatusWording(i.fodmapStatus),
            sortOrder: GetStatusSortOrder(i.fodmapStatus)
            
        }
    })
    
    ings.sort((a,b) => a.sortOrder - b.sortOrder)

    return (
      <FlatList 
          data={ings}
          keyExtractor={(i) => i.name}
          renderItem={({item}) =>
              <View style={styles.item_container}>
                  <View style={styles.item_name}>
                      <Text style={styles.text_name}>{item.name}</Text>
                  </View>
                  <View style={styles.item_status}>
                      <Text style={styles.text_status}>{item.fodmapStatusText}</Text>
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