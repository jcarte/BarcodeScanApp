import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../core/CustomText';
import CustomButton from '../core/CustomButton';

export interface AboutYouComponentProps {
    onKnowButtonClick(): void
    onDontKnowButtonClick(): void
}

export function AboutYouComponent({ onKnowButtonClick, onDontKnowButtonClick }: AboutYouComponentProps) {

    return (
        <View>
            <CustomText variant="paragraph" weight='bold'>First, let’s get to know you a bit better...</CustomText>

            <CustomText variant="paragraph">Our research tells us that people fall into one of two groups: those who know what ingredients trigger their condition; and those who do not yet know.</CustomText>

            <CustomText variant="paragraph" weight='bold'>Which are you?</CustomText>

            <CustomButton style={{ marginTop: 20 }} title='I know my triggers' onPress={() => onKnowButtonClick?.()} />

            <CustomButton style={{ marginTop: 40 }} title="I don't yet know" onPress={() => onDontKnowButtonClick?.()} />
        </View>
    )
}