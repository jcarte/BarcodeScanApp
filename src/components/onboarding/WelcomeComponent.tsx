import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../core/CustomText';
import CustomButton from '../core/CustomButton';
import assets from '../../../assets/AssetManager';
import { Image } from 'expo-image';
import Entypo from '@expo/vector-icons/Entypo';

export interface WelcomeComponentProps {
    onButtonClick(): void
}

export function WelcomeComponent({ onButtonClick }: WelcomeComponentProps) {

    return (
        <View>
            <CustomText variant="paragraph" weight='bold'>We aim to bring you peace of mind when it comes to what you put into your body!</CustomText>

            <CustomText variant="paragraph">Simply scan food barcodes as you shop, at home or at work.</CustomText>

            <CustomText variant="paragraph">We’ll tell you what’s in each product, and how well it matches with what you tell us about your gut health.</CustomText>

            <Image style={styles.image} source={assets.images.statusExamples} contentFit="contain" />

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

const styles = StyleSheet.create({
    image: {
        height: 175,
        marginBottom: 10,
        marginTop: 10,
    }
});