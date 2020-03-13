import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AppStyles from '../../AppStyles';

class listItem extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={.7}>
                <View style={styles.listItem}>
                    <Text style={styles.textFont}>{this.props.placeName}</Text>
                </View>
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
        paddingVertical: 10,
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
    }
});

export default listItem;
