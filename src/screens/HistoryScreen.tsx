
import { Button, Text, View } from "react-native";

export function HistoryScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>History Screen!</Text>
      <Button
        title="Go to onboarding"
        onPress={() => navigation.navigate('Onboarding')}
      />
    </View>
  );
}