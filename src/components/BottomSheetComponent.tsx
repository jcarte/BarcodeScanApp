import React, { useState, useImperativeHandle, forwardRef  } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

const BottomSheetComponent = (props, ref) => {

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



  const getHeight = (index: number):number  => {
    const val: any = index ===0 ? props.collapsedHeight : props.expandedHeight 

    //console.log(`val:${val}, type: ${typeof val}, last char: ${typeof val === 'string' ? val.slice(-1): "bob"}, parse: ${parseFloat(val)}, window: ${Dimensions.get('window').height}`)
    if (typeof val === 'number') return val
    else if (typeof val === 'string' && val.slice(-1) == "%")
    {
      return (parseFloat(val ) / 100.0) * Dimensions.get('window').height
    }
    else return null
  }

  const collapsedHeight = getHeight(0)
  const expandedHeight = getHeight(1)

  // console.log(`BS: collapsed height: ${getHeight(0)}`)
  // console.log(`BS: expanded height: ${getHeight(1)}`)

  const height = useSharedValue(collapsedHeight);


  const drag = Gesture.Pan()
  .onChange((event) => {//move BS in line with where the finger is
    if((height.value-event.changeY) < expandedHeight && (height.value-event.changeY) > collapsedHeight)
      height.value += -event.changeY;
  })
  .onEnd((event)=> {
    //console.log("BS:EndDrag:",event)

    const speedThreshold = 750 //speed beyond which to snap

    if(event.velocityY < -speedThreshold)//is moving up fast?
    {
      height.value = expandedHeight  
    }
    else if(event.velocityY > speedThreshold)//is moving down fast?
    {
      height.value = collapsedHeight  
    }
    else if(height.value > ((expandedHeight - collapsedHeight)*0.5 + collapsedHeight)) 
    {//is below speed but has ended on top half
      height.value = expandedHeight
    }
    else 
    {//must be moving slow and finished in bottom half
      height.value = collapsedHeight 
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(height.value, //https://docs.swmansion.com/react-native-reanimated/docs/2.x/api/animations/withSpring
        {
          damping: 5, //How hard the animation decelerates.
          stiffness: 100, //How bouncy the animation is.
          overshootClamping: true //Whether the animation can bounce over the specified value.
        })
    };
  });


  if(isOpen)
  {
    return (
      
        <View style={styles.bottom_sheet_container}>
            <Animated.View style={[styles.bottom_sheet, containerStyle]}>
                <GestureDetector gesture={drag}>
                  <View>
                    <View style={[styles.bottom_sheet_handle]}>
                      <Feather name="minus" size={35} color="#969696" />
                    </View>
                    <View style={{height: collapsedHeight - 25}}>
                      {props.headerComponent()}
                    </View>
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
      //borderWidth: 1,
      alignItems: "center",
      height: 25,
    },
  
    bottom_sheet_content: {
      //borderWidth: 1,
      width: "100%",
      height: "100%",
    },
  
  });