import React from "react";
import { Dimensions, Text, TextStyle } from 'react-native'
import GlobalStyles from "../../lib/GlobalStyles";

interface CustomTextProps {
    variant?: "default" | "paragraph" | "heading" | "subheading"
    weight?: "regular" | "bold"
    color?: "light" | "dark" | "gray" | "blue"
    textAlign?: "left" | "center" | "right"
    style?: TextStyle
    fontSize?: number
    children: React.ReactNode
}

export default function CustomText(props: CustomTextProps): React.JSX.Element {

    const screenHeight = React.useMemo(() => Dimensions.get('window').height, []) //745 on my phone

    const {
        variant = "default",
        weight = "regular",
        color = "dark",
        textAlign = "left",
        children
    } = props

    let style: TextStyle = { ...props.style } ?? {}

    style.textAlign = textAlign//always use given or default

    style.color = style.color ??
        (color === "dark"
            ? GlobalStyles.colours.darkText
            : (
                color === "gray"
                    ? GlobalStyles.colours.gray
                    : (
                        color === "blue"
                            ? GlobalStyles.colours.blue
                            : GlobalStyles.colours.lightText
                    )
            )
        )

    style.marginBottom = style.marginBottom ??
        (variant === "paragraph" || variant === "heading") ? (15/745)*screenHeight : 0

    style.fontWeight = style.fontWeight ??
        (variant === "heading" || variant === "subheading" || weight == "bold") ? "bold" : "normal"

    style.fontSize = (style.fontSize ?? props.fontSize)
        ? (style.fontSize ?? props.fontSize)
        : ((variant === "heading")
            ? (24/745)*screenHeight
            : (variant === "subheading"
                ? (19/745)*screenHeight : (14/745)*screenHeight))

    return (
        <Text style={style}>{children}</Text>
    )
}
