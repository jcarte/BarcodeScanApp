import React, { useState, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, LayoutChangeEvent, Button, GestureResponderEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { AnimatableValue, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
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
  isDragEnabled = true,
  onChange = undefined,
  startsOpen = true,
}: BottomSheetComponentProps, ref) => {

  console.log("BS: Start")
  const [isOpen, setIsOpen] = useState(startsOpen)

  const [maxHeight, setMaxHeight] = React.useState<number | null>(null)//wait to get this from the view when it's loaded

  const screenHeight = useMemo<number>(() => Dimensions.get('window').height, [])

  const getHeight = (index: number): number => {
    const val: string | number = index === 0 ? collapsedHeight : expandedHeight

    //console.log(`val:${val}, type: ${typeof val}, last char: ${typeof val === 'string' ? val.slice(-1): "bob"}, parse: ${parseFloat(val)}, window: ${Dimensions.get('window').height}`)
    if (typeof val === 'number') {
      if (maxHeight) return val > maxHeight ? maxHeight : val //if max height has been set (from rendered height of component), check val isn't bigger
      return val
    }
    else if (typeof val === 'string' && val.slice(-1) == "%") {
      const multipler = (parseFloat(val) / 100.0)
      if (maxHeight) return multipler * maxHeight
      return multipler * screenHeight
    }
    else return null
  }

  const _collapsedHeight = useMemo<number>(() => getHeight(0), [collapsedHeight, expandedHeight, maxHeight, screenHeight])
  const _expandedHeight = useMemo<number>(() => getHeight(1), [collapsedHeight, expandedHeight, maxHeight, screenHeight])

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
    },
    jiggle: () => {
      console.log("BS: Jiggle")
      jiggle()
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
    .onEnd((event) => {//if too fast up or down auto collapse/expand
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

    })

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(height.value, //https://docs.swmansion.com/react-native-reanimated/docs/2.x/api/animations/withSpring
        {
          mass: 1, //The weight of the spring. Reducing this value makes the animation faster.
          damping: 5, //How hard the animation decelerates.
          stiffness: 100, //How bouncy the animation is.
          overshootClamping: true, //Whether the animation can bounce over the specified value.
        }, () => {
          //on finish animate, wherever finish, if not at ends then snap to the closest
          if (height.value !== _expandedHeight || height.value !== _collapsedHeight) {
            if (height.value > ((_expandedHeight - _collapsedHeight) * 0.5 + _collapsedHeight)) {//is below speed but has ended on top half
              height.value = _expandedHeight
            }
            else {//must be moving slow and finished in bottom half
              height.value = _collapsedHeight
            }
          }
        })
    };
  });

  /** Make the tray move up and then will auto snap back down */
  function jiggle(): void {
    height.value = _collapsedHeight * 1.25
  }


  const styles = StyleSheet.create({

    bottom_sheet_container: {
      //flex: 1,
      width: "100%",
      height: "100%",
      position: "absolute",
      justifyContent: "flex-end",
      bottom: 0,
    },

    bottom_sheet: {
      // width: "100%",
      backgroundColor: "white",
      borderTopLeftRadius: (20 / 745) * screenHeight,
      borderTopRightRadius: (20 / 745) * screenHeight,
      // borderWidth: 3, 
      // borderColor: 'blue',
    },

    bottom_sheet_handle_container: {
      position: "relative",
      borderWidth: 0,
      alignItems: "center",
      height: (25 / 745) * screenHeight,
      justifyContent: "center",
    },

    bottom_sheet_handle: {
      width: (50 / 745) * screenHeight, 
      height: (5 / 745) * screenHeight, 
      borderRadius: (5 / 745) * screenHeight, 
      backgroundColor: GlobalStyles.colours.gray
    },

    bottom_sheet_content: {
      flex: 1,
      flexGrow: 1,
      // borderColor: 'pink',
      //borderWidth: 1,
      width: "100%",
    },

  });

  if (isOpen) {


    return (

      <View style={styles.bottom_sheet_container} onLayout={(event: LayoutChangeEvent) => {
        if (!maxHeight)
          setMaxHeight(event.nativeEvent.layout.height)//get height of view, to set max expanded height of BS
      }}>
        <Animated.View style={[styles.bottom_sheet, containerStyle]}>
          <GestureDetector gesture={isDragEnabled ? drag : noDrag}>
            <View style={{ flex: 1 }}>
              <View style={[styles.bottom_sheet_handle_container]}>
                {isDragEnabled && <View style={[styles.bottom_sheet_handle]} />}
              </View>
              <View style={{ height: _collapsedHeight - (25 / 745) * screenHeight }}>
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
