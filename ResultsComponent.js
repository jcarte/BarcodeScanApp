import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';

export function ResultsComponent({product}) {
    
    console.log("product:", product)

    // const prodImageWidth = Dimensions.get('window').width*.3
    // const prodImageHeight = Dimensions.get('window').width*.4
   
    const GetStatusWording = () =>
    {
        switch (product.fodmapStatus) {
            case 'high':
                return 'Avoid'
            case 'medium':
                return 'Caution'
            case 'low':
                return 'Ok'
            case 'unknown':
            default:
                return 'Unkown'
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.column, {flex:1}]}>
                <View style={[styles.image_container]}>
                    <Image style={[styles.prod_image,]} source={{uri:product.imgUrl}} resizeMode='cover'  />
                </View>
            </View>
            
            <View style={[styles.column, {flex:2}]}>
                <View style={[styles.text_container]}>
                    <Text>BOB {product.name}</Text>
                    <Text>BILL {product.brand}</Text>
                    <Text>BUB {GetStatusWording()}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      flexDirection: "row",
      alignSelf: "stretch",
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f',
      fontFamily: 'sans-serif'
    },
    column: {
        
        alignItems: 'center', 
        justifyContent: 'center',
        alignSelf: "stretch",
        borderColor: "#000",
        borderWidth: 1,
    },
    image_container: {
        margin: 10,
        alignSelf: "stretch",
    },
    text_container: {
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        alignSelf: "stretch",
    },
    prod_image: {
        
        width: "100%",
        height: "100%",

        borderColor: '#000',
        borderWidth: 2,
      },
});


// circle: {
//     position: 'absolute',
//     width: 44,
//     height: 44,
//     borderRadius: 44,
//     backgroundColor: "red",
//     margin: '7%',
    
//     right: 0,
//     top: 0,
//  },
//   
//   thumb_image: {
//     borderColor: '#000',
//     borderWidth: 0,
//   },
//   thumb_text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     margin: 10,
//   },
//   product_text: {
//     fontSize: 18,
//     textTransform: 'capitalize',
//     marginTop: 10,
//     marginBottom: 20,
//     marginLeft: 20,
//     marginRight: 20,
//     textAlign: 'center',
//   },
  