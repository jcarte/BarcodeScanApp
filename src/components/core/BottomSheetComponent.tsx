import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import GlobalStyles from '../../lib/GlobalStyles';

interface BottomSheetComponentProps {
  collapsedHeight: number | string
  expandedHeight: number | string
  headerComponent: () => React.JSX.Element
  children: React.ReactNode
  isDragEnabled?: boolean
  onChange?: (index: number) => void
  startsOpen?: boolean
}


const BottomSheetComponent = ({
  collapsedHeight,
  expandedHeight,
  headerComponent,
  children,
  isDragEnabled=true,
  onChange=undefined,
  startsOpen=true,
}: BottomSheetComponentProps, ref) => {

  console.log("BS: Start")
  const [isOpen, setIsOpen] = useState(startsOpen)

  const getHeight = (index: number): number => {
    const val: any = index === 0 ? collapsedHeight : expandedHeight

    //console.log(`val:${val}, type: ${typeof val}, last char: ${typeof val === 'string' ? val.slice(-1): "bob"}, parse: ${parseFloat(val)}, window: ${Dimensions.get('window').height}`)
    if (typeof val === 'number') return val
    else if (typeof val === 'string' && val.slice(-1) == "%") {
      return (parseFloat(val) / 100.0) * Dimensions.get('window').height
    }
    else return null
  }

  const _collapsedHeight = getHeight(0)
  const _expandedHeight = getHeight(1)

  // console.log(`BS: collapsed height: ${getHeight(0)}`)
  // console.log(`BS: expanded height: ${getHeight(1)}`)

  const height = useSharedValue(_collapsedHeight);

  useImperativeHandle(ref, () => ({
    //link ref methods to these internal methods
    open: () => {
      console.log("BS: Open")
      setIsOpen(true)
    },
    close: () => {
      console.log("BS: Close")
      setIsOpen(false)
    },
    expand: () => {
      console.log("BS: Expand")
      expandSheet()
    },
    collapse: () => {
      console.log("BS: Collapse")
      collapseSheet()
    }
  }))

  function expandSheet(): void {
    //console.log(`BS: Expanding to height: ${expandedHeight}`)
    height.value = _expandedHeight
    onChange?.(1)//trigger change event to parent
  }

  function collapseSheet(): void {
    //console.log(`BS: Collapsing to height: ${collapsedHeight}`)
    height.value = _collapsedHeight
    onChange?.(0)//trigger change event to parent
  }

  const noDrag = Gesture.Pan()//bit of a bodge to disable panning

  const drag = Gesture.Pan()
    .onChange((event) => {//move BS in line with where the finger is
      if ((height.value - event.changeY) < _expandedHeight && (height.value - event.changeY) > _collapsedHeight)
        height.value += -event.changeY;
    })
    .onEnd((event) => {
      //console.log("BS:EndDrag:",event)
      const speedThreshold = 500 //speed beyond which to snap

      if (event.velocityY < -speedThreshold)//is moving up fast?
      {
        //console.log("BS: fast move up, expanding")
        runOnJS(expandSheet)()//gesture runs on UI thread, crashes unless pass to JS thread
      }
      else if (event.velocityY > speedThreshold)//is moving down fast?
      {
        //console.log("BS: fast move down, collapsing")
        runOnJS(collapseSheet)()
      }
      else if (height.value > ((_expandedHeight - _collapsedHeight) * 0.5 + _collapsedHeight)) {//is below speed but has ended on top half
        //console.log("BS: slow move, ended in top half, expanding")
        runOnJS(expandSheet)()
      }
      else {//must be moving slow and finished in bottom half
        //console.log("BS: slow move, ended in bottom half, collapsing")
        runOnJS(collapseSheet)()
      }
    })

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(height.value, //https://docs.swmansion.com/react-native-reanimated/docs/2.x/api/animations/withSpring
        {
          mass: 1, //The weight of the spring. Reducing this value makes the animation faster.
          damping: 5, //How hard the animation decelerates.
          stiffness: 100, //How bouncy the animation is.
          overshootClamping: true, //Whether the animation can bounce over the specified value.
        })
    };
  });


  if (isOpen) {
    return (

      <View style={styles.bottom_sheet_container}>
        <Animated.View style={[styles.bottom_sheet, containerStyle]}>
          <GestureDetector gesture={isDragEnabled ? drag : noDrag}>
            <View style={{ flex: 1 }}>
              <View style={[styles.bottom_sheet_handle]}>
                {isDragEnabled && <View style={{width:50, height: 5, borderRadius:5, backgroundColor: GlobalStyles.colours.gray}}/>}
              </View>
              <View style={{ height: _collapsedHeight - 25 }}>
                {headerComponent()}
              </View>
              <View style={styles.bottom_sheet_content}>
                {children}
              </View>
            </View>
          </GestureDetector>
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
    bottom: 0,
    // borderWidth: 3, 
    // borderColor: 'green',
  },

  bottom_sheet: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // borderWidth: 3, 
    // borderColor: 'blue',
  },

  bottom_sheet_handle: {
    borderWidth: 0,
    alignItems: "center",
    height: 25,
    justifyContent: "center",
  },

  bottom_sheet_content: {
    flex: 1,
    flexGrow: 1,
    // borderColor: 'pink',
    //borderWidth: 1,
    width: "100%",
  },

});