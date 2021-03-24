import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const StatisticsTile = ({value, title}) => {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.value}>{value ? value : 'No Data'}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

export default StatisticsTile

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 16,
        padding: 15,
        marginBottom: 25,
    },
    value: {
        fontSize: 28,
        fontFamily: AppStyles.fonts.boldFont,
        color: AppStyles.colors.textColor
    },
    title: {
        color: AppStyles.colors.primaryColor,
        fontFamily: AppStyles.fonts.boldFont,
    }
})
