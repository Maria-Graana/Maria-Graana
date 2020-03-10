import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loader from '../loader';

class TouchableButton extends Component {

    onPress = () => {
        this.props.onPress()
    }

    render() {
        const {
            label,
            loading,
            style
        } = this.props;
        const title = label || 'Button';
        const disabled = loading || false;
        return (
            <View style = {{...style,...styles.container }}>
                <TouchableOpacity activeOpacity={.7} style = {styles.buttonContainer} onPress={this.onPress}>
                    {
                        disabled == true ?
                        <Loader loading={loading}/>
                        :
                        <Text style = {styles.buttonText}>
                            {title}
                        </Text>
                    }
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    },
    buttonContainer: {
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        marginBottom: 12,
        paddingVertical: 12,
        borderRadius: 25,
        borderColor: "rgba(255, 255, 255, 0.7)",
        alignSelf: "center",
        padding: 10,
        height: 50
    },
    buttonText: {
        color: "black",
        fontSize : 18,
        textAlign: "center"
    }
});
export default TouchableButton;