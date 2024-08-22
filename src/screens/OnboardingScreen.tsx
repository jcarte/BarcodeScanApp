
import React, { useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";

import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image';

import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';

import { OnboardWarningComponent } from "../components/onboarding/WarningComponent";
import assets from "../../assets/AssetManager";

/*
https://github.com/dohooo/react-native-reanimated-carousel/tree/main
https://react-native-reanimated-carousel.vercel.app/

example with pagination (doesn't work):
https://github.com/dohooo/react-native-reanimated-carousel/blob/main/example/app/src/pages/parallax/index.tsx

Pagination add on:
https://www.npmjs.com/package/react-native-animated-dots-carousel
*/

interface PageData {
  title: string,
  component: React.JSX.Element
}

export function OnboardingScreen({ navigation }) {

  const [index, setIndex] = React.useState<number>(0);

  const caroRef = useRef<ICarouselInstance>(null)

  const data: PageData[] = [
    {
      title: "Welcome to pom",
      component: <Text>Welcome Screen</Text>
    },
    {
      title: "About you",
      component: <Text>About you Screen</Text>
    },
    {
      title: "Your triggers",
      component: <Text>Triggers Screen</Text>
    },
    {
      title: "Warning",
      component: <OnboardWarningComponent onButtonClick={() => { caroRef.current.next() }} />
    },
    {
      title: "Permissions",
      component: (
        <><Text>Permissions Screen</Text><Button title="Start" onPress={()=>navigation.navigate("HomeNav")}/></>
      )
    },
  ]

  /*
  -Fix colours to be brand
  -Fix button style
  
  -Add other screens
   */

  const carouselCardItem = ({ item, index }) => {
    const i = item as PageData
    return (
      <View style={styles.page}>

        {/* Header on every page with logo and title */}
        <View style={styles.pageHeader}>
          <Image style={styles.logoImage} source={assets.images.logo} contentFit="cover" />
          <Text style={styles.pageHeadingText}>{i.title}</Text>
        </View>

        {/* Actual page component below header */}
        {i.component}

      </View>
    )
  }

  const FOOTER_HEIGHT_PERCENT = 0.10 //height of dots in footer
  const WIDTH = Dimensions.get('window').width
  const HEIGHT = Dimensions.get('window').height * (1 - FOOTER_HEIGHT_PERCENT)

  const DOT_SIZE = 16

  return (
    <SafeAreaView style={styles.container}>

      {/* Carousel Pages */}
      <View style={{
        width: WIDTH,
        height: HEIGHT,
      }}>
        <Carousel
          ref={caroRef}
          width={WIDTH}
          height={HEIGHT}
          loop={false}
          data={data}
          enabled={true} //toggles gestures
          pagingEnabled={true}
          onProgressChange={(_, absoluteProgress) => {
            setIndex(Math.round(absoluteProgress));
            console.log("current index:", absoluteProgress)
          }}
          renderItem={carouselCardItem}
        />
      </View>

      {/* Dots in footer */}
      <View style={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: DOT_SIZE,
        }}>
          <AnimatedDotsCarousel

            length={data.length}
            currentIndex={index}
            maxIndicators={data.length}
            interpolateOpacityAndColor={true}
            activeIndicatorConfig={{
              color: 'green',//TODO MAKE BRAND COLOR
              margin: 10,
              opacity: 1,
              size: DOT_SIZE,
            }}
            inactiveIndicatorConfig={{
              color: 'lightgray',//TODO MAKE BRAND COLOR
              margin: 10,
              opacity: 1,
              size: DOT_SIZE,
            }}
            decreasingDots={[
              //Don't use these but have to have them
              {
                config: { color: 'blue', margin: 3, opacity: 0.5, size: DOT_SIZE },
                quantity: 0,
              },
              {
                config: { color: 'blue', margin: 3, opacity: 0.5, size: DOT_SIZE },
                quantity: 0,
              },
            ]}
          />
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  page: {
    height: "100%",
    width: "100%",
    flex: 1,
    padding: 40,
  },

  //Header inside page with title and logo
  pageHeader: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    marginBottom: 15
  },
  pageHeadingText: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 30
  },
  logoImage: {
    height: 50,
    width: 50,
    borderWidth: 0,
  }

});