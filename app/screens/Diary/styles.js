import React from 'react';
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
       
    },
    heading: {
        color: AppStyles.colors.primaryColor,
        fontWeight: '600',
        fontSize: AppStyles.fontSize.large,
        padding: AppStyles.standardPadding.padding
    },
    calenderIconContainer: {
        flexDirection:'row',
        paddingVertical:5,
        alignSelf: 'center',
        width: '100%',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    calenderIcon: {
        fontSize: 40,
        color: AppStyles.colors.iconColor
    },
    calendarText:{
        paddingLeft: 10, 
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.textColor
    },
    underLine: {
        height: 1, 
        width: "100%",
        backgroundColor: "#f5f5f6",
    }
})