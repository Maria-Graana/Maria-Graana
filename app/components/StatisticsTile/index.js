import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppStyles from '../../AppStyles'


const displayValue = (value) => {
    if (value === 0)
        return '0';
    else if (value === null || value === undefined)
        return '-';
    else return value;
}

const StatisticsTile = ({ value, title }) => {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{displayValue(value)}</Text>
        </View>
    )
}

export default StatisticsTile

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    value: {
        fontSize: AppStyles.fontSize.medium,
        fontFamily: AppStyles.fonts.semiBoldFont,
        color: AppStyles.colors.textColor,
        textAlign: 'left',
    },
    title: {
        color: AppStyles.colors.textColor,
        fontFamily: AppStyles.fonts.semiBoldFont,
        fontSize: AppStyles.fontSize.medium,
    }
})
