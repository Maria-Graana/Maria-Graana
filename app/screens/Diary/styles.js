import React from 'react';
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
       
    },
    heading: {
        color: AppStyles.colors.primary,
        fontWeight: '600',
        fontSize: AppStyles.fontSize.large,
        padding: AppStyles.standardPadding.padding
    },
    calenderIconContainer: {
        alignSelf: 'center',
        height: 70,
        width: 70,
        backgroundColor: AppStyles.colors.primary,
        padding: AppStyles.standardPadding.padding,
        borderRadius: 35,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    calenderIcon: {
        fontSize: 40,
        color: AppStyles.colors.iconColor
    }
})