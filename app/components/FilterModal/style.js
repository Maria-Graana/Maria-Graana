import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
    btn1: {
        marginBottom: 40,
    },
    container: {
        backgroundColor: '#e7ecf0'
    },
    textCeformControlMultinter: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: 'OpenSans_regular',
        color: '#333'
    },
    formControlMulti: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
        position: 'relative',
        borderRadius: 5,
        minHeight: 45,
        overflow: 'hidden',
        borderBottomWidth: 0,
    },
    priceStyle:{
        width: '45%', 
        textAlign: 'center'
    },
    toText:{
        fontFamily: AppStyles.fonts.defaultFont, 
        color: AppStyles.colors.textColor,
        textAlign:'center',
        width:'10%',
    },
    backImg: {
        width: 30,
        height: 30,
        marginTop: 5,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    topHeader: {
        flexDirection: 'row',
        marginHorizontal: 15
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    headerText: {
        paddingRight: 30,
        fontFamily: AppStyles.fonts.semiBoldFont,
        fontSize: 16
    },
    pickerView: {
        padding: 15
    },
    resetText: {
        color: AppStyles.colors.primaryColor,
        fontSize: 18,
        paddingLeft: 15
    },
    matchBtn: {
        padding: 15,
        paddingBottom: 0
    },
    textView: {
        paddingRight: 10,
        flex: 1,
    },
    textInputView: {
        flexDirection: "row",
        padding: 15
    },
    btnMargin: {
        marginHorizontal: 15
    },
    errorView: {
        flexDirection: "row",
        paddingRight: 15,
        paddingLeft: 15
    }
})