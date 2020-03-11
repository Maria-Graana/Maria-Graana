import React from 'react';
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: AppStyles.standardPadding.padding
    },
    heading: {
        color: AppStyles.colors.primary,
        fontWeight: '600',
        fontSize: AppStyles.fontSize.large
    },
    calenderIconContainer: {
        alignSelf: 'center',
        height: 70,
        width: 70,
        backgroundColor: AppStyles.colors.primary,
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