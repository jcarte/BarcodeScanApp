import React from "react";
import { Text, TextStyle } from 'react-native'
import GlobalStyles from "../../lib/GlobalStyles";

interface CustomTextProps {
    variant?: "default" | "paragraph" | "heading" | "subheading"
    weight?: "regular" | "bold"
    color?: "light" | "dark" | "gray"
    style?: TextStyle
    fontSize?: number
    children: React.ReactNode
}

export default function CustomText(props: CustomTextProps): React.JSX.Element {

    const { variant = "default", weight = "regular", color = "dark", children } = props
    let style: TextStyle = { ...props.style } ?? {}

    style.color = style.color ??
        (color === "dark" ? GlobalStyles.colours.darkText :
            (color === "gray" ? GlobalStyles.colours.gray : GlobalStyles.colours.lightText))

    style.marginBottom = style.marginBottom ??
        (variant === "paragraph" || variant === "heading") ? 15 : 0

    style.fontWeight = style.fontWeight ??
        (variant === "heading" || variant === "subheading" || weight == "bold") ? "bold" : "normal"

    style.fontSize = (style.fontSize ?? props.fontSize) 
        ? (style.fontSize ?? props.fontSize) 
        : ((variant === "heading") 
            ? 24 
            : (variant === "subheading" 
                ? 19 : 14))

    return (
        <Text style={style}>{children}</Text>
    )
}
