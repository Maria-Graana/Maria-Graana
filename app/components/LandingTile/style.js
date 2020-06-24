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
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    squareContainer: {
        flex: 1,
        height: 160,
        borderRadius: 20,
        justifyContent: "space-around",
    },
    headingText: {
        fontSize: 16,
        fontFamily: AppStyles.fonts.defaultFont
    },
});