import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
    viewButtonStyle: {
        backgroundColor: 'white',
        height: 40,
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    propsureVerificationTextStyle:{
        fontFamily:AppStyles.fonts.boldFont,
        color:AppStyles.colors.primaryColor,
        letterSpacing:0.7
    }
});