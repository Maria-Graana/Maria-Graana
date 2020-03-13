import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
class InputField extends Component {

    returnData(text) {
        this.props.sendData(text)
    }

    render() {
        const {
            placeholder,
            keyboardType,
            textContentType,
            autoCompleteType,
            secureTextEntry,
            container,
            selectedValue,
            editable
        } = this.props;
        const placeholderlabel = placeholder || 'Please Input Text';
        const keyboardTypeLabel = keyboardType || 'default';
        const textContentTypeLabel = textContentType || 'none';
        const secureTextEntryLabel = secureTextEntry || false;
        const autoCompleteTypeLabel = autoCompleteType || 'off';
        const containerWrap = container || styles.container
        const selectedVal = selectedValue || '';
        return (
            <View style={containerWrap}>
                <TextInput
                    defaultValue={selectedVal.toString()}
                    placeholder={placeholderlabel}
                    keyboardType={keyboardTypeLabel}
                    textContentType={textContentTypeLabel}
                    autoCompleteType={autoCompleteTypeLabel}
                    secureTextEntry={secureTextEntryLabel}
                    onChangeText={(text) => this.returnData(text)}
                    style={styles.textWrap}
                    editable={editable}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        justifyContent: 'center',
        marginVertical: 10,
        backgroundColor: 'white',
        height: 60,
        borderColor: 'gray',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        borderRadius: 5,
    },
    textWrap: {
        fontSize: 16
    }
});
export default InputField;