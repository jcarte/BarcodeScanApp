import * as React from 'react'
import { Button, Text, View } from "react-native";
import CustomText from "../components/core/CustomText";
import CustomButton from "../components/core/CustomButton";
import { Analytics } from '../lib/Analytics';

export function HistoryScreen({ navigation }) {

  const analytics = new Analytics()

  React.useEffect(()=>{
    analytics.logHistoryPageView()//only logs once
  })

  return (
    <View style={{ padding:40, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" }}>
      <CustomText variant='heading'>Coming soon</CustomText>
      <CustomText textAlign='center' variant='paragraph'>We're still working on the results history screen, watch out for it in future versions!</CustomText>
      
    </View>
  );
}