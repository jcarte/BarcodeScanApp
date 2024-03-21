import React, {  } from 'react';
import { Text, View, StyleSheet, } from 'react-native';

export function MessageComponent({ messageText }) {
    
    return (
      <View style = {styles.container}>
        <Text style = {styles.text}>{messageText}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignContent: "center",
        //justifyContent: "center",
        //borderWidth:1,
        //alignItems: "center",
        marginTop: 60,
        padding: 20,
         //height: 100,
        //backgroundColor: "#ddd",
    },
    text: {
        textAlign: 'center',
        //alignSelf: "center",
        //borderWidth:1,
        //color: '#242424',//off black
        fontWeight: "bold",
        fontSize: 16,

    }

});

