
import { Button, Text, View } from "react-native";

export function OnboardingOneScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Onboarding ONE Screen!</Text>
      <Button
        title="Go to Onboard 2"
        onPress={() => navigation.navigate('OnboardingTwo')}
      />
    </View>
  );
}