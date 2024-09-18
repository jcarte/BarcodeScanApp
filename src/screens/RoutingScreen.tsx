import React from 'react';
import { View, ActivityIndicator } from "react-native";
import { getHasCompletedOnboardingAsync } from "../lib/LocalStorage";
import GlobalStyles from '../lib/GlobalStyles';

/** 
 * Gets flag if onboarding has been done already, if has routes to  
 * to main scanning page else goes through onboarding, shows loading
 * animation
 * */
export function RoutingScreen({ navigation }) {

  React.useEffect(() => {
    async function fetchOnboarding() {
      console.log("RS: fetchOnboarding")
      try {
        const hasOnboarded = await getHasCompletedOnboardingAsync()
        if (hasOnboarded)
          navigation.navigate("HomeNav")
        else
          navigation.navigate("OnboardingNav")
      } catch (error) {
        navigation.navigate("OnboardingNav")
      }

    }
    fetchOnboarding()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', }}>
      <ActivityIndicator size="large" color={GlobalStyles.colours.darkRed} />
    </View>
  );
}