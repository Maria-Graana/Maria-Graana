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
    rowStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        marginVertical: hp('1.5%%'),
    },
    packageNameStyle: {
        fontSize: AppStyles.fontSize.medium,
        marginHorizontal: 10,
        letterSpacing: 2,
        fontFamily: AppStyles.fonts.semiBoldFont
    },
    tickImageStyle: {
        width: 16,
        height: 16,
        marginTop: 3,
        resizeMode: 'contain'
    }
});