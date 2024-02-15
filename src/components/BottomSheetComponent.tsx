import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';

export function BottomSheetComponent(props) {

  const[index, setIndex] = useState(props.index)

  // console.log(props)

    function getHeight ():any
  {
    return index === 0 ?  props.collapsedHeight : props.expandedHeight
  }

  function onTouchHandle ():void
  {
    console.log("PRESS")
    // console.log(getHeight())
    let newIndex: number
    index === 0 ? newIndex=1 : newIndex=0
    setIndex(newIndex)
    props.onChange(newIndex)
  }

  return (
      <View style={styles.bottom_sheet_container}>
          <View style={[styles.bottom_sheet, {height: getHeight()}]}>
              <View style={styles.bottom_sheet_handle}>
                <TouchableOpacity onPress={()=>onTouchHandle()} style={{width:"100%", alignItems: "center"}}>
                  <Text>{index===0 ? "Show More" : "Show Less"}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bottom_sheet_content}>
                  {props.children}
              </View>
          </View>
      </View>
  )

}

const styles = StyleSheet.create({
  
    bottom_sheet_container: {
      //flex: 1,
      width: "100%",
      height: "100%",
      position: "absolute",
      justifyContent: "flex-end",
      borderWidth: 0,
    },
  
    bottom_sheet: {
      width: "100%",
      // height: "25%",
      backgroundColor: "white",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    },
  
    bottom_sheet_handle: {
      //borderWidth: 1,
      alignItems: "center",
      marginTop: 5,
    },
  
    bottom_sheet_content: {
      //borderWidth: 1,
      width: "100%",
      height: "100%",
    },
  
  });