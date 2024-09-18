import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../core/CustomText';
import CustomButton from '../core/CustomButton';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SelectTriggerRowComponent } from './SelectTriggerRowComponent';
import GlobalStyles from '../../lib/GlobalStyles';
import { TriggerData } from '../../types/TriggerData';
import { getTriggerIngredientsAsync } from '../../lib/LocalStorage';

export interface TriggerSelectComponentProps {
    onButtonClick(triggers: TriggerData[]): void
}

export function TriggerSelectComponent({ onButtonClick }: TriggerSelectComponentProps) {

    const [triggers, setTriggers] = React.useState<TriggerData[]>([])

    React.useEffect(() => {
        async function fetchTriggers() {
            console.log("TSC: Getting triggers")
            const triggers = await getTriggerIngredientsAsync()
            triggers.sort((a, b) => a.name.localeCompare(b.name))
            setTriggers(triggers)
        }
        fetchTriggers()
    }, [])


    const checkCol = GlobalStyles.colours.darkGreen

    function ToggleValue(name: string) {
        const row = triggers.find(d => d.name === name)

        if (!row)
            throw new Error("Couldn't find item: " + name)

        row.selected = !row.selected

        const newData = [...triggers.filter(d => d.name != name), row]
        newData.sort((a, b) => a.name.localeCompare(b.name))

        setTriggers(newData)
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <CustomText weight='bold' variant='paragraph'>Select your triggers from the list, and we’ll tell you if they’re in anything you scan.</CustomText>
            </View>

            <View style={styles.listContainer}>
                <FlatList
                    data={triggers}
                    renderItem={({ item }) =>
                        <View style={styles.listRow}>
                            <SelectTriggerRowComponent
                                label={item.name}
                                colour={checkCol}
                                value={item.selected}
                                onValueChange={() => { ToggleValue(item.name) }}
                            />
                        </View>}
                />
            </View>

            <View style={styles.footer}>
                <CustomButton
                    onPress={() => onButtonClick?.(triggers)}
                    style={{ marginTop: 20 }}
                    title='Save and continue'
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flexGrow: 1
    },
    header: {
        flexBasis: "auto"
    },
    listContainer: {
        flexGrow: 1,
        flexBasis: 0
    },
    listRow: {
        paddingHorizontal: 10,
    },
    footer: {
        flexBasis: "auto",
        borderWidth: 0,
    },
});