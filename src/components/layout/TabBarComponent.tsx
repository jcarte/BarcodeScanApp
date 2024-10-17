import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import GlobalStyles from '../../lib/GlobalStyles';
import CustomText from '../core/CustomText';

/** Navigation buttons at bottom of main screen */
export function TabBarComponent({ state, descriptors, navigation }): React.ReactNode {

    const screenHeight = Dimensions.get('window').height //745 on my phone
    const barHeight = screenHeight / 10 //75
    const fontSize = screenHeight / 68 //11
    const iconSize = screenHeight / 30 //25
    return (
        <View style={{ flexDirection: 'row', height: barHeight, backgroundColor: GlobalStyles.colours.lightGray }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const colour = isFocused ? GlobalStyles.colours.blue : GlobalStyles.colours.gray

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <View
                        key={label}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 0
                        }}
                    >
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{alignContent: "center"}}

                        >
                            
                            <View style={{ borderWidth: 0, width: "auto", alignItems: "center", padding: 0 }}>
                                {route.name === 'History' && <MaterialIcons name="history" size={iconSize} color={colour} />}
                                {route.name === 'Scan' && <MaterialCommunityIcons name="barcode-scan" size={iconSize} color={colour} />}
                                {route.name === 'About' && <MaterialIcons name="info-outline" size={iconSize} color={colour} />}
                            </View>
                            <CustomText fontSize={fontSize} color={isFocused? "blue" : "gray"}>{label}</CustomText>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
}