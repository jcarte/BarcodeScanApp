
import { Button, Text, View } from "react-native";

export function OnboardingTwoScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Onboarding Screen!</Text>
      <Button
        title="Go to home tabs"
        onPress={() => navigation.navigate('HomeNav')}
      />
    </View>
  );
}