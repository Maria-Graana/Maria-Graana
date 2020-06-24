import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default styles = StyleSheet.create({
    headView: {
        justifyContent: "center",
        paddingHorizontal: 15
    },
    totalText: {
        fontSize: 25,
        fontFamily: AppStyles.fonts.semiBoldFont
    },
    containerImg: {
        marginHorizontal: 15,
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    squareContainer: {
        height: 100,
        width: (windowWidth / 2) - 20,
        borderRadius: 10,
        backgroundColor: 'white', 
        margin: 10,
        justifyContent: "space-around",
    },
    headingText: {
        fontSize: 16,
        fontFamily: AppStyles.fonts.boldFont
    },
    badgeText: {
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.primaryColor
    },
    badgeView: {
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 1,
        borderRadius: 15,
        height: 25,
        width: 25,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    tileView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});