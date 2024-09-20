import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import CustomText from '../core/CustomText';
import CustomButton from '../core/CustomButton';
import Entypo from '@expo/vector-icons/Entypo';

export interface OnboardWarningComponentProps {
    onButtonClick(): void
}

export function OnboardWarningComponent({ onButtonClick }: OnboardWarningComponentProps) {

    return (
        <View>
            <CustomText variant="paragraph" weight='bold'>pom is not a medical device!</CustomText>

            <CustomText variant="paragraph">pom lets you see what ingredients are in food that you’ve scanned, and match that with what you’ve told us about your health. </CustomText>

            <CustomText variant="paragraph">No-one knows your body like you do, so it’s up to you how you use this information.</CustomText>

            <CustomText variant="paragraph">Ingredients are held on a publicly-available database, and while we strive to ensure that our results are as accurate as possible, pom is not responsible for the quality of results.</CustomText>

            <CustomText variant="paragraph">pom is not liable for your health as a result of using this app.</CustomText>

            <CustomText variant="paragraph" weight='bold'>If in doubt, always consult your GP, dietician or other clinical practitioner.</CustomText>

            <CustomButton
                style={{ marginTop: 20 }}
                title='Swipe to continue'
                endIcon={(<View style={{ flexDirection: "row" }}>
                    <Entypo name="chevron-right" size={24} color="white" />
                </View>)}
                onPress={() => onButtonClick?.()} />
        </View>
    )
}