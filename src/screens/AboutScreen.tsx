
import { Text, View, Button } from "react-native";

export function AboutScreen({navigation}) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>About Screen!</Text>
        <Button
        title="Go to Onboarding"
        onPress={() => navigation.navigate('Onboarding')}
      />
      </View>
    );
  }