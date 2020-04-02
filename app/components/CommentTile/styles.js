import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        elevation: 10,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        marginVertical: hp('1.5%%'),
        paddingHorizontal: wp('2%'),
        paddingBottom: wp('3%'),
        marginHorizontal: wp('2.5%'),
    },
    closeButtonStyle: {
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    horizontalContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headingStyle: {
        fontSize: AppStyles.noramlSize.fontSize,
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.textColor,
        marginVertical: 10,
    },
    subHeadingStyle: {
        fontSize: AppStyles.noramlSize.fontSize,
        fontFamily: AppStyles.fonts.boldFont,
        color: AppStyles.colors.primaryColor
    },
    dateTimeStyle: {
        alignSelf:'flex-end',
        fontSize: AppStyles.noramlSize.fontSize,
        fontFamily: AppStyles.fonts.defaultFont,
        letterSpacing:0.7,
        color: AppStyles.colors.subTextColor
    }

})