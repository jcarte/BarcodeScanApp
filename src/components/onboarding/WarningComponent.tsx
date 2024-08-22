import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export interface OnboardWarningComponentProps {
    onButtonClick(): void
}

export function OnboardWarningComponent({onButtonClick} : OnboardWarningComponentProps) {

    return (
        <View>
            <Text style={styles.boldPara}>pom is not a medical device!</Text>

            <Text style={styles.para}>pom lets you see what ingredients are in food that you’ve scanned, and match that with what you’ve told us about your health. </Text>

            <Text style={styles.para}>No-one knows your body like you do, so it’s up to you how you use this information.</Text>

            <Text style={styles.para}>Ingredients are held on a publicly-available database, and while we strive to ensure that our results are as accurate as possible, pom is not responsible for the quality of results.</Text>

            <Text style={styles.para}>pom is not liable for your health as a result of using this app.</Text>

            <Text style={styles.boldPara}>If in doubt, always consult your GP, dietician or other clinical practitioner.</Text>

            <Button title='Swipe to continue' color="red" onPress={() => onButtonClick?.()}/>
        </View>
    )
}

const PARAGRAPH_PADDING = 15

const styles = StyleSheet.create({
    
    para: {
        marginBottom: PARAGRAPH_PADDING
    },
    boldPara: {
        marginBottom: PARAGRAPH_PADDING,
        fontWeight: "bold"
    },
    

})