import React from 'react';
import { View, ActivityIndicator } from "react-native";
import GlobalStyles from '../../lib/GlobalStyles';

/** Simple infinite loading animation */
export function LoadingComponent() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', }}>
      <ActivityIndicator size="large" color={GlobalStyles.colours.darkRed} />
    </View>
  );
}