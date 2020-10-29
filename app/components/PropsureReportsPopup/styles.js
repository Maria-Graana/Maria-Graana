import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
    viewContainer: {
        marginLeft: 25,
        marginRight: 25,
    },
    closeStyle: {
        position: 'absolute',
        right: 15,
        top: Platform.OS == 'android' ? 10 : 40,
        paddingVertical: 5
    },
    buttonExtraStyle: {
        marginHorizontal: 15,
        position: 'absolute',
        bottom: 70,
        width: '90%'
    },
    reportRow: {
        flexDirection: 'row',
        paddingVertical: 20,
        alignItems: 'center'
    },
    reportName: {
        marginLeft: 15,
        color: AppStyles.colors.textColor,
        fontFamily: AppStyles.fonts.defaultFont,
        fontSize: AppStyles.fontSize.large,
    }

});