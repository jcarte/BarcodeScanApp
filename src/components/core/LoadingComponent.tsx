import React from 'react';
import { View, ActivityIndicator, ViewStyle } from "react-native";
import GlobalStyles from '../../lib/GlobalStyles';

interface LoadingComponentProps {
  style?: ViewStyle
}
/** Simple infinite loading animation */
export function LoadingComponent({ style = {} }: LoadingComponentProps): React.ReactNode {
  style.flex = style.flex ?? 1
  style.justifyContent = style.justifyContent ?? "center"

  return (
    <View style={style}>
      <ActivityIndicator size="large" color={GlobalStyles.colours.darkRed} />
    </View>
  );
}