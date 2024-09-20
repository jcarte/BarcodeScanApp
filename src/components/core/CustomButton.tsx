import React from "react";
import { GestureResponderEvent, Pressable, ViewStyle, StyleSheet, View } from 'react-native'
import GlobalStyles from "../../lib/GlobalStyles";
import CustomText from "./CustomText";

interface CustomButtonProps {
    title: string
    onPress?: (event: GestureResponderEvent) => void
    style?: ViewStyle
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
}

export default function CustomButton(props: CustomButtonProps): React.JSX.Element {
    const {
        onPress,
        title = '',
        style = {},
        startIcon = <></>,
        endIcon = <></>
    } = props;

    const mStyle = { ...styles.button, ...style }

    return (
        <Pressable style={mStyle} onPress={onPress}>
            <View style={{ flexDirection: "row" }}>
                {startIcon}
                <CustomText style={{ flexGrow: 1, alignSelf: "center" }} weight="bold" color="light" textAlign="center">
                    {title}
                </CustomText>
                {endIcon}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: GlobalStyles.colours.blue,
    },

});
