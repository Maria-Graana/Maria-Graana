import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

class listItem extends React.Component {
    constructor (props) {
        super(props)
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={.7}>
                <View style={styles.listItem}>
                    <Text>{this.props.placeName}</Text>
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
        padding: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    underLine: {
        height: 1, 
        width: "100%",
        backgroundColor: "#f5f5f6",
    }
});

export default listItem;
