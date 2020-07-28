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
        height: 90,
        width: (windowWidth / 2) - 20,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 10,
        paddingVertical: 10,
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    headingText: {
        fontSize: 16,
        fontFamily: AppStyles.fonts.boldFont
    },
    badgeText: {
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.primaryColor,
        fontSize: 12
    },
    badgeView: {
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 1,
        borderRadius: 15,
        height: 25,
        width: 25,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 2
    },
    tileView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});