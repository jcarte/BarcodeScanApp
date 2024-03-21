import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Product, Ingredient, FodmapStatus}  from '../api/ProductHandler'

export function ProductHeaderComponent({product}) {
   
    console.log("PHC: Start")
    
    

    const GetStatusWording = () =>
    {
        const unknownIngsSum = product.ingredients.filter(function(ing:Ingredient){
            return ing.fodmapStatus == FodmapStatus.Unknown
        }).reduce((partialSum, a) => partialSum + a.percent, 0);

        //High level of unknown check
        if(unknownIngsSum >= 5 && product.fodmapStatus < FodmapStatus.Medium)
            return (<Text><FontAwesome name="exclamation-triangle" size={16} color="orange" /> More than 5% of the ingredients in this are unknown</Text>)

        const firstIng:Ingredient = product.ingredients.sort(function (a, b) {
            return b.fodmapStatus - a.fodmapStatus || b.percent - a.percent;
          })[0]

        const roundPercent = firstIng.percent > 1 ? 
            Math.round(firstIng.percent) : 
            parseFloat(firstIng.percent.toPrecision(1))

        switch (product.fodmapStatus) {
            case FodmapStatus.High:
                return (<Text><FontAwesome name="exclamation-circle" size={16} color="#EF5350" /> This has {roundPercent}% {firstIng.name} - please try to find an alternative</Text>)
            case FodmapStatus.Medium:
                if(firstIng.percent >= 5)
                    return (<Text><FontAwesome name="exclamation-triangle" size={16} color="orange" /> This contains more than 5% {firstIng.name} - consume at your own risk</Text>)
                return (<Text><FontAwesome name="exclamation-triangle" size={16} color="orange" /> This has below 5% of any significant ingredients - consume at your own risk</Text>)
            case FodmapStatus.Low:
                return (<Text><FontAwesome name="check-circle" size={16} color="#26BD65" /> This has no significant ingredients</Text>)
            case FodmapStatus.Unknown:
            default:
                return (<Text><FontAwesome name="question-circle" size={16} color="lightgrey" /> Sorry, we don't have any info about this product</Text>)
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
        margin: 20,
        alignSelf: "stretch",
    },
    prod_image: {
        
        width: "100%",
        height: "100%",

        borderColor: '#000',
        //borderWidth: 2,
    },
    text_container: {
        paddingTop: 15,
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

  