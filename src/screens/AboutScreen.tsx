import * as React from 'react'
import { StyleSheet, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/core/CustomText";
import CustomButton from "../components/core/CustomButton";
import { Analytics } from '../lib/Analytics';

export function AboutScreen({ navigation }) {

  const analytics = new Analytics()

  React.useEffect(()=>{
    analytics.logAboutPageView()//only logs once
  })

  function handleUpdateTriggersClick() {
    analytics.logAboutPageClickUpdateTriggers()
    navigation.navigate("UpdateTriggers") 
  }

  function handleSendFeedbackClick() {
    analytics.logAboutPageClickSendFeedback()
    Linking.openURL(`mailto:info@mypom.app?subject=App-Feedback`)
  }

  function handleReplayOnboardingClick() {
    analytics.logAboutPageClickReplayOnboarding()
    navigation.navigate('OnboardingNav')
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomText variant="heading">About pom</CustomText>
      <CustomText variant="paragraph">For people with IBS, Crohn's, Coeliac or other gastrointestinal conditions.</CustomText>
      <CustomText variant="paragraph">Scan food to see if it contains ingredients that may trigger your GI condition.</CustomText>
      <CustomText variant="paragraph">The team behind pom formed at Sync The City 2023 in Norwich, UK. It currently consists of Vanya, James and Philip.</CustomText>
      <View>

      </View>
      <CustomButton
        style={styles.button}
        onPress={handleUpdateTriggersClick}
        title="Update your triggers"
        variant="Primary"
      />
      <CustomButton
        style={styles.button}
        onPress={handleSendFeedbackClick}
        title="Send us your feedback"
        variant="Primary"
      />
      <CustomButton
        style={styles.button}
        onPress={handleReplayOnboardingClick}
        title="Replay onboarding"
        variant="Secondary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 40,
  },

  button: {
    marginTop: 30,
    flexShrink:0
  }

});