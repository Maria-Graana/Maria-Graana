import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Loader from '../loader';
import AppStyles from '../../AppStyles';

const TouchableButton = ({ label = '',
    loading = false,
    onPress,
    containerStyle,
    containerBackgroundColor = AppStyles.colors.primaryColor,
    textColor = 'white',
    fontSize = 18,
    disabled=false,
    fontFamily = AppStyles.fonts.semiBoldFont,
    loaderColor = 'white' }) => {
    return (
        <TouchableOpacity disabled={loading || disabled} activeOpacity={.7} style={[containerStyle, { backgroundColor: containerBackgroundColor }]}
            onPress={onPress}>
            {
                loading == true ?
                    <Loader loading={loading} color={loaderColor} />
                    :
                    <Text style={{
                        color: textColor,
                        fontSize: fontSize,
                        fontFamily: fontFamily,
                        textAlign: 'center'
                    }}>
                        {label}
                    </Text>
            }
        </TouchableOpacity>
    );
}
export default TouchableButton