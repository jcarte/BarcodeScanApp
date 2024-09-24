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
    variant?: "Primary" | "Secondary"
    autoFillWidth? :boolean
}

export default function CustomButton(props: CustomButtonProps): React.JSX.Element {
    const {
        onPress,
        title = '',
        style = {},
        startIcon = <></>,
        endIcon = <></>,
        variant = "Primary",
        autoFillWidth = false
    } = props;

    const mStyle = { ...styles.button, ...style }

    let textColour: "gray" | "light" | "dark" | "blue" = "dark"
    let buttonColour = ""
    if (variant === "Primary") {
        textColour = "light"
        buttonColour = GlobalStyles.colours.blue
    }
    else if (variant === "Secondary") {
        textColour = "blue"
        buttonColour = GlobalStyles.colours.lightGray
    }

    return (
        <Pressable style={[mStyle, {backgroundColor: buttonColour}]} onPress={onPress}>
            <View style={{ flexDirection: "row" }}>
                {startIcon}
                <CustomText style={{ flexGrow: autoFillWidth ? 1 : 0, alignSelf: "center" }} weight="regular" color={textColour} textAlign="center">
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
        
    },

});
