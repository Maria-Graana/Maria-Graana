import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
    viewButtonStyle: {
        backgroundColor: AppStyles.colors.primaryColor,
        height: 30,
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    propsureVerificationTextStyle: {
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.primaryColor,
    }
});