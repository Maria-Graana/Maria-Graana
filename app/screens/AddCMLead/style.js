import { StyleSheet } from 'react-native';
import  AppStyles  from '../../AppStyles';

export default styles = StyleSheet.create({
    addInvenBtn: {
        marginBottom: 40,
    },
    multiButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    buttonDesign: {
        borderBottomWidth: 2,
        borderColor: '#fff',
        padding: 15,
    },
    activeBtn: {
        borderBottomColor: '#0D73EE',
    },
    textCenter: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: 'OpenSans_regular',
        color: '#333'
    },
    textBold: {
        fontWeight: 'bold',
        color: '#000',
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
})