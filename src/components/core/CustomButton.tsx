import React from "react";
import { Text, StyleProp, TextStyle, GestureResponderEvent, Pressable, ViewStyle, StyleSheet } from 'react-native'
import GlobalStyles from "../../lib/GlobalStyles";
import CustomText from "./CustomText";

interface CustomButtonProps {
    title: string
    onPress?: (event: GestureResponderEvent) => void
    style?: ViewStyle
}

export default function CustomButton(props: CustomButtonProps): React.JSX.Element {
    const { onPress, title = '', style = {} } = props;

    const mStyle = {...styles.button, ...style}

    return (
        <Pressable style={mStyle} onPress={onPress}>
            <CustomText weight="bold" color="light">{title}</CustomText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: GlobalStyles.colours.red,
    },
    
});
