import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import CustomText from '../core/CustomText';
import Checkbox from 'expo-checkbox';

export interface SelectTriggerRowComponentProps {
    label: string
    value: boolean
    onValueChange(): void
    colour?: string
}

export function SelectTriggerRowComponent({ label, value, onValueChange, colour = "" }: SelectTriggerRowComponentProps) {

    return (

        <Pressable onPress={() => { onValueChange?.() }}>
            <View style={styles.container}>
                <View style={styles.label}>
                    <CustomText weight='bold'>{label}</CustomText>
                </View>
                <View style={styles.check}>
                    <Checkbox
                        value={value}
                        onValueChange={onValueChange}
                        color={colour}
                    />
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderWidth: 0,
        paddingVertical: 20,
        alignItems: "center"
    },
    label: {
        flexBasis: 0,
        flexGrow: 1,
        borderWidth: 0
    },
    check: {
        flexBasis: "auto",
        paddingLeft: 10,
        borderWidth: 0,
    }
});