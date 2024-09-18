import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../core/CustomText';
import CustomButton from '../core/CustomButton';

export interface TriggerAutoMessageComponentProps {
    onButtonClick(): void
}

export function TriggerAutoMessageComponent({ onButtonClick }: TriggerAutoMessageComponentProps) {

    return (
        <View>
            <CustomText variant="paragraph" weight='bold'>For now, we’ll match your scans with a general profile of common food triggers.</CustomText>

            <CustomText variant="paragraph">This profile has been developed by a leading university, and focuses on six types of sugars, known collectively as FODMAPs.</CustomText>
            <CustomText variant="paragraph">FODMAPs are mainly relevant to people with IBS, a common gastrointestinal condition. </CustomText>
            <CustomText variant="paragraph">As you use the app and get to know more about what ingredients trigger your condition, you can update these in settings to get more relevant results.</CustomText>

            <CustomButton style={{ marginTop: 20 }} title='Save and continue' onPress={() => onButtonClick?.()} />
        </View>
    )
}
