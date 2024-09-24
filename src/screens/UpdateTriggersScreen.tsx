
import * as React from "react"
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/core/CustomText";
import { TriggerSelectComponent } from "../components/onboarding/TriggerSelectComponent";
import { TriggerData } from "../types/TriggerData";
import { getTriggerIngredientsAsync, setTriggerIngredientsAsync } from "../lib/LocalStorage";
import AssetManager from "../../assets/AssetManager";
import { Image } from 'expo-image';
import { LoadingComponent } from "../components/core/LoadingComponent";

export function UpdateTriggersScreen({ navigation }) {

  const [triggers, setTriggers] = React.useState<TriggerData[]>([])

  React.useEffect(() => {
    async function fetchTriggers() {
      const trigs = await getTriggerIngredientsAsync()
      setTriggers(trigs)
    }
    fetchTriggers()
  }, [])

  //Show loading if not in yet
  if(triggers.length === 0) return (<LoadingComponent />)

  return (
    <SafeAreaView style={styles.container}>

      {/* Header on every page with logo and title */}
      <View style={styles.pageHeader}>
        <Image style={styles.logoImage} source={AssetManager.images.logo} contentFit="cover" />
        <CustomText
          style={styles.pageHeadingText}
          variant="heading">Update your triggers</CustomText>
      </View>

      <TriggerSelectComponent
        initialTriggers={triggers}
        onButtonClick={async (tr: TriggerData[]) => {
          await setTriggerIngredientsAsync(tr)//save triggers to storage
          navigation.navigate("About")
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 40,
    //borderWidth:1,
  },

  button: {
    marginTop: 30,
    flexShrink: 0
  },
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