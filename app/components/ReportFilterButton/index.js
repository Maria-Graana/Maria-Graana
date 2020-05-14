import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';


class ReportFilterButton extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { buttonStyle, textPropStyle, label } = this.props
        return (
            <TouchableOpacity style={[styles.container, buttonStyle]} onPress={() => this.props.selectedFilterButton(label)}>
                <Text style={[styles.textStyle, textPropStyle]}>{label}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 3,
        paddingHorizontal: 7,
        borderColor: AppStyles.colors.subTextColor,
    },
    textStyle: {
        color: AppStyles.colors.textColor,
        padding: 1,
        fontFamily: AppStyles.fonts.defaultFont
    }
})

export default ReportFilterButton;