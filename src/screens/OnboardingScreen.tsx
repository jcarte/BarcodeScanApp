
import React, { useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";

import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image';

import AssetManager from "../../assets/AssetManager";
import { OnboardWarningComponent } from "../components/onboarding/WarningComponent";
import CustomText from "../components/core/CustomText";
import { WelcomeComponent } from "../components/onboarding/WelcomeComponent";
import { AboutYouComponent } from "../components/onboarding/AboutYouComponent";
import { PermissionsComponent } from "../components/onboarding/PermissionsComponent";
import { TriggerSelectComponent } from "../components/onboarding/TriggerSelectComponent";
import { TriggerAutoMessageComponent } from "../components/onboarding/TriggerAutoMessageComponent";
import CarouselComponent, { PageData } from "../components/core/CarouselComponent";
import { TriggerData } from "../types/TriggerData";
import { setHasCompletedOnboardingAsync, setTriggerIngredientsAsync } from "../lib/LocalStorage";


export function OnboardingScreen({ navigation }) {

  //used to toggle show between the "I know my triggers" and "I don't know yet" screens
  const [showSelectTriggers, setShowSelectTriggers] = React.useState<boolean>(true);

  const caurouselRef = useRef(null);

  //wrapper around next slide function
  const next = () => caurouselRef.current.next()

  const saveTriggers = async (triggers: TriggerData[]) => await setTriggerIngredientsAsync(triggers)
  
  const [triggers, setTriggers] = React.useState<TriggerData[]>([])

  //Get default triggers from file, load into state
  React.useEffect(() => {
    const defaultCats: { categoryName: string, highFodmap: boolean }[] = AssetManager.data.categoryList

    const defaultData: TriggerData[] = defaultCats.map(c => {
        const td: TriggerData = { name: c.categoryName, selected: c.highFodmap }
        return td
    })

    setTriggers(defaultData)

  }, [])

  const setOnboardingDone = async () => await setHasCompletedOnboardingAsync(true)

  // Wraps each page in a header component before feeding to carousel
  function getSlidePageComponent(title: string, child: React.ReactNode): React.ReactNode {
    return (
      <View style={styles.page}>

        {/* Header on every page with logo and title */}
        <View style={styles.pageHeader}>
          <Image style={styles.logoImage} source={AssetManager.images.logo} contentFit="cover" />
          <CustomText
            style={styles.pageHeadingText}
            variant="heading">{title}</CustomText>
        </View>

        {/* Actual page component below header */}
        {child}

      </View>
    )
  }

  // Descibes every page, feeds into carousel
  const pages: PageData[] = [
    {
      component: getSlidePageComponent("Welcome to pom",
        <WelcomeComponent onButtonClick={() => { next() }} />),
      isSwipeEnabled: true,
    },
    {
      component: getSlidePageComponent("About you",
        <AboutYouComponent
          onDontKnowButtonClick={() => {
            setShowSelectTriggers(false)
            next()
          }}
          onKnowButtonClick={() => {
            setShowSelectTriggers(true)
            next()
          }}
        />),
      isSwipeEnabled: false,
    },
    {
      component: getSlidePageComponent(showSelectTriggers ? "Your triggers" : "How it works",
        showSelectTriggers
          ? <TriggerSelectComponent
            initialTriggers={triggers}
            onButtonClick={async (tr: TriggerData[]) => {
              setTriggers(tr)//update local state
              await saveTriggers(tr)//save triggers to storage
              next()
            }}
          />
          : <TriggerAutoMessageComponent onButtonClick={async () => {
            await saveTriggers(triggers)//save default triggers already loaded (FODMAP)
            next()
          }} />),
      isSwipeEnabled: false,
    },
    {
      component: getSlidePageComponent("Warning",
        <OnboardWarningComponent onButtonClick={() => { next() }} />),
      isSwipeEnabled: true,
    },
    {
      component: getSlidePageComponent("Permissions",
        <PermissionsComponent onButtonClick={async () => {
          await setOnboardingDone()
          navigation.navigate("HomeNav")

        }} />),
      isSwipeEnabled: true,
    },
  ]


  return (
    <SafeAreaView style={styles.container}>

      <CarouselComponent
        pages={pages}
        ref={caurouselRef}
      />

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
    // alignContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    marginBottom: 15,
    marginLeft: -20//compensate for alpha in logo
  },
  pageHeadingText: {
    marginLeft: 0,
    marginBottom: 0,
    // borderWidth:1,
  },
  logoImage: {
    height: 75,
    width: 75,
    // borderWidth: 1,
  }

});