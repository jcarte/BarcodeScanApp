import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';

export function ProductHeaderComponent({product}) {
    
    //console.log("product from res sum:", product)

    // const prodImageWidth = Dimensions.get('window').width*.3
    // const prodImageHeight = Dimensions.get('window').width*.4
   
    const GetStatusWording = () =>
    {
        switch (product.fodmapStatus) {
            case 'high':
                return '🔴 Avoid'
            case 'medium':
                return '🟡 Caution'
            case 'low':
                return '🟢 Ok'
            case 'unknown':
            default:
                return '⚪ Unknown'
        }
    }

    if(product !== null)
    {
        return (
            <View style={styles.top_container}>
                <View style={styles.container}>
                    <View style={[styles.column, {flex:2}]}>
                        <View style={[styles.image_container]}>
                            <Image style={[styles.prod_image,]} source={{uri:product.imgUrl}} resizeMode='cover'  />
                        </View>
                    </View>
                    
                    <View style={[styles.column, {flex:3}]}>
                        <View style={[styles.text_container]}>
                            <View style={[styles.text_top]}>
                                <Text style={[styles.text_name]}>{product.name}</Text>
                                <Text style={[styles.text_brand]}>{product.brand}</Text>
                            </View>
                            <View style={[styles.text_bottom]}>
                                <Text style={[styles.text_status]}>{GetStatusWording()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    else return (null)
}

const styles = StyleSheet.create({
    top_container: {
        flex: 1,
        height: 220,
        borderColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderTopWidth: 0,
    },
    container: {
        flex: 1, 
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fff',
        //borderWidth: 1,
    },
    column: {
        
        alignItems: 'center', 
        justifyContent: 'center',
        alignSelf: "stretch",
        //borderWidth: 1,
    },
    image_container: {
        margin: 25,
        alignSelf: "stretch",
    },
    prod_image: {
        
        width: "100%",
        height: "100%",

        borderColor: '#000',
        //borderWidth: 2,
    },
    text_container: {
        paddingTop: 25,
        paddingRight: 25,
        paddingBottom: 25,
        alignSelf: "stretch",
        width: "100%",
        height: "100%",
    },
    text_top: {
        flex:1,
    },
    text_bottom: {
        flex:1,
        justifyContent: 'center',
    },
    text_name:{
        //borderWidth: 1,
        color: '#242424',//off black
        fontWeight: "bold",
        fontSize: 18,
        
    },
    text_brand:{
        //borderWidth: 1,
        color: '#969696',//grey
        fontSize: 14,
    },
    text_status:{
        //borderWidth: 1,
        color: '#242424',//off black
        fontWeight: "bold",
        fontSize: 16,
    },

});

  