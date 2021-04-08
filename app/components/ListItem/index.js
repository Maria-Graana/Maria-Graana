import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";
import { Textarea } from 'native-base'
import AppStyles from '../../AppStyles';

class listItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { time, showTask, selectedTime, showAddTask } = this.props;
        return (
            <TouchableOpacity onPress={()=>showAddTask(true, time)} activeOpacity={.7}>
                <View style={styles.listItem}>
                    <Text style={styles.textFont}>{time}</Text>
                </View>
                {
                    showTask && time === selectedTime &&
                    <Textarea
                        autoFocus
                        bordered
                        placeholderTextColor={'#a8a8aa'}
                        returnKeyType={'done'}
                        style={[
                            AppStyles.formControl,
                            Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                            AppStyles.formFontSettings,
                            styles.taskBox,
                        ]}
                        rowSpan={5}
                        placeholder="Description"
                        onChangeText={(text) => console.log(text)}
                    />
                }
                <View style={styles.underLine}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    textFont: {
        fontFamily: AppStyles.fonts.defaultFont
    },
    underLine: {
        height: 1,
        width: "100%",
        backgroundColor: "#f5f5f6",
    },
    taskBox: {
        height: 55,
        padding: 10,
        alignSelf:'center',
        width: '75%',
        borderColor: AppStyles.colors.primaryColor,
        // borderWidth: 1,
        marginVertical:-20,
    }
});

export default listItem;
