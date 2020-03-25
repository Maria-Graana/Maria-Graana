import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: 'white',
        marginLeft: 15, 
        marginRight: 15,
        paddingHorizontal: 15, 
        paddingTop: 10,
        zIndex:5,
        elevation:5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        borderRadius: 20,
        
    },
    closeStyle: {
        position: 'absolute',
        right: 15,
        top: Platform.OS == 'android' ? 10 : 40,
        paddingVertical: 5
    },
    btnWrap: {
        flexDirection: 'row',
        paddingVertical: 15,
        alignSelf:'flex-end',
    },
    markBtn: {
        backgroundColor: '#ffffff',
        height: 50,
        justifyContent: 'center',
        borderRadius: 5,
        width: 100,
        marginHorizontal: 10
    },
    disabledBtnStyle: {
        opacity: 0.3,
        height: 50,
        justifyContent: 'center',
        borderRadius: 5,
        width: 100,
        marginHorizontal: 10
    },

    disabledBtnText: {
        color: '#333',
        fontSize: 14,
    },

    textStyle:{
        fontFamily: AppStyles.fonts.defaultFont,
        fontSize:AppStyles.fontSize.large,
        marginVertical:5
    },
    horizontalWrapStyle:{
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    statusText: {
        fontFamily: AppStyles.fonts.boldFont,
        width: '25%',
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