import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../core/CustomText';
import CustomButton from '../core/CustomButton';
import assets from '../../../assets/AssetManager';
import { Image } from 'expo-image';
import { useCameraPermissions } from 'expo-camera'

export interface PermissionsComponentProps {
    onButtonClick(): void
}

export function PermissionsComponent({ onButtonClick }: PermissionsComponentProps) {

    const [permission, requestPermission] = useCameraPermissions();

    async function HandleButtonPress() {
        await requestPermission()
        onButtonClick?.()
    }

    return (
        <View>
            <CustomText variant="paragraph">Finally, pom needs camera permissions to scan barcodes.</CustomText>

            <CustomText variant="paragraph">Swipe or tap “Finish” to trigger the permissions request and get scanning!</CustomText>

            <Image style={styles.image} source={assets.images.cameraIcon} contentFit="contain" />

            <CustomButton style={{ marginTop: 20 }} title='Finish' onPress={HandleButtonPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 175,
        marginBottom: 20,
        marginTop: 10,
    }
});