import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
    viewContainer: {
        marginLeft: 25,
        marginRight: 25,
        borderRadius:4,
        justifyContent: 'center',
        elevation: 10,
        paddingHorizontal:15,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        backgroundColor: '#ffffff',
    },
    closeStyle: {
        position: 'absolute',
        right: 15,
        top: Platform.OS == 'android' ? 10 : 40,
        paddingVertical: 5
    },
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppStyles.whiteColor.color,
        borderColor: AppStyles.colors.textColor
    },
    innerCircle: {
        height: 13,
        width: 13,
        borderRadius: 6,
        backgroundColor: AppStyles.colors.primaryColor
    },
    underLine: {
        height: 1,
        width: "100%",
        backgroundColor: "lightgrey",
    }
});