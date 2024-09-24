
import { Text, StyleSheet, Button, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/core/CustomText";
import CustomButton from "../components/core/CustomButton";

export function AboutScreen({ navigation }) {
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
        onPress={() => { navigation.navigate("UpdateTriggers") }}
        title="Update your triggers"
        variant="Primary"
      />
      <CustomButton
        style={styles.button}
        onPress={() => Linking.openURL(`mailto:info@mypom.app?subject=App-Feedback`)}
        title="Send us your feedback"
        variant="Primary"
      />
      <CustomButton
        style={styles.button}
        onPress={() => navigation.navigate('OnboardingNav')}
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