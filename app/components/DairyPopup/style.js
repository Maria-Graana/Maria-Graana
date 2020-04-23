import { Platform, StyleSheet } from 'react-native';

import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
    viewContainer: {
        backgroundColor:'white',
        marginLeft: 25,
        marginRight: 25,
        paddingTop:10
    },
    closeStyle: {
        position: 'absolute',
        right: 15,
        top: Platform.OS == 'android' ? 10 : 40,
        paddingVertical: 5
    },
    lead: {
        fontFamily: AppStyles.fonts.boldFont,
        width: '25%',
        textAlign: 'center',
        alignSelf:'center',
        fontSize: AppStyles.noramlSize.fontSize,
        padding: 3,
        color: AppStyles.colors.textColor,
        borderRadius: 12,
        borderColor: AppStyles.colors.textColor,
        borderWidth: 0.5
    },
    leadText: {
        fontSize: 10,
        fontFamily: AppStyles.fonts.semiBoldFont,
        color: AppStyles.colors.textColor,
        textAlign: 'center',
    },
    btnWrap: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 15, 
        marginTop:10,
        justifyContent:'space-around'
    },
    disabledBtnStyle: {
        justifyContent: 'center',
        minHeight: 55,
        borderRadius: 4,
        padding: 15,
        opacity: 0.5,
        width:150,
    },

    disabledBtnText: {
        color: '#999',
        fontFamily:AppStyles.fonts.semiBoldFont
    },

    textStyle:{
        fontFamily: AppStyles.fonts.defaultFont,
        fontSize:AppStyles.fontSize.medium,
        marginVertical:5
    },
    horizontalWrapStyle:{
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingHorizontal: 15, 
    },
    statusText: {
        fontFamily: AppStyles.fonts.boldFont,
        width: '30%',
        textAlign: 'center',
        alignSelf:'center',
        fontSize: AppStyles.noramlSize.fontSize,
        padding: 3,
        color: AppStyles.colors.primaryColor,
        borderRadius: 12,
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 0.5
    },
    underLine: {
        height: 1,
        width: "100%",
        marginVertical:15,
        backgroundColor: "lightgrey",
    }
     
});