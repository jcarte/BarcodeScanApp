import React, { useState, useImperativeHandle, forwardRef  } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


const BottomSheetComponent = (props, ref) => {

  const[index, setIndex] = useState(props.index)
  const[isOpen, setIsOpen] = useState(props.startsOpen)


  useImperativeHandle(ref, () => ({
    //link ref methods to these internal methods
    open: () => 
    { 
      console.log("BS: Open")
      setIsOpen(true) 
    },
    close: () => 
    { 
      console.log("BS: Close")
      setIsOpen(false) 
    }
  }))


  const height = useSharedValue(props.collapsedHeight);


  const drag = Gesture.Pan()
  .onChange((event) => {//move BS in line with where the finger is
    if((height.value-event.changeY) < props.expandedHeight && (height.value-event.changeY) > props.collapsedHeight)
      height.value += -event.changeY;
  })
  .onEnd((event)=> {
    console.log("BS:EndDrag:",event)

    const speedThreshold = 1000 //speed beyond which to snap

    if(event.velocityY < -speedThreshold)//is moving up fast?
    {
      height.value = props.expandedHeight  
    }
    else if(event.velocityY > speedThreshold)//is moving down fast?
    {
      height.value = props.collapsedHeight  
    }
    else if(height.value > ((props.expandedHeight - props.collapsedHeight)*0.5 + props.collapsedHeight)) 
    {//is below speed but has ended on top half
      height.value = props.expandedHeight
    }
    else 
    {//must be moving slow and finished in bottom half
      height.value = props.collapsedHeight 
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: height.value
    };
  });


  if(isOpen)
  {
    return (
      
        <View style={styles.bottom_sheet_container}>
            <Animated.View style={[styles.bottom_sheet, containerStyle]}>
                <GestureDetector gesture={drag}>
                    <View style={styles.bottom_sheet_handle}>
                        <Text style={styles.bottom_sheet_handle_text}>{"—"}</Text>
                    </View>
                </GestureDetector>
                <View style={styles.bottom_sheet_content}>
                    {props.children}
                </View>
            </Animated.View>
        </View>
      
    )
  }
  else return null;
}
export default forwardRef(BottomSheetComponent)


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
      borderWidth: 1,
      alignItems: "center",
    },

    bottom_sheet_handle_text: {
      fontSize: 30,
      marginTop: 0,
    },
  
    bottom_sheet_content: {
      //borderWidth: 1,
      width: "100%",
      height: "100%",
    },
  
  });