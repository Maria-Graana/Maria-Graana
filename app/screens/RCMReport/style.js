import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
    buttonsContainer: {
        padding: 10
    },
    squareContainer: {
        flex: 1,
        borderWidth: 1,
        height: 160,
        borderRadius: 20,
        borderColor: AppStyles.colors.primaryColor
    },
    headingText: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: AppStyles.fonts.defaultFont
    },
    sqaureView: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        marginVertical: 5,
        marginHorizontal: 10,
    },
    reactangle: {
        // justifyContent: 'space-between',
        flex: 1,
        borderWidth: 1,
        height: 160,
        borderRadius: 20,
        marginVertical: 5,
        flexDirection: "row",
        borderColor: AppStyles.colors.primaryColor
    },
    containerImg: {
        marginHorizontal: 15,
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    squareRight: {
        marginRight: 10,
    },
    scrollContainer: {

    },
    selectedBtn: {
        backgroundColor: AppStyles.colors.primaryColor,
        borderColor: AppStyles.colors.primaryColor
    },
    btnView: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    inputView: {
        flexDirection: "row",
        height: 50,
        padding: 10,
        zIndex: 15,
        marginVertical: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        elevation: 10,
        backgroundColor: 'white'
    },
    regionStyle: {
        flex: 1.5,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 5,
        borderColor: AppStyles.colors.subTextColor,
        flexDirection: "row"
    },
    textView: {
        flex: 1,
        padding: 5,
        borderRightWidth: 0.5,
        borderColor: AppStyles.colors.subTextColor
    },
    regionImg: {
        resizeMode: 'contain',
        width: 14,
        height: 14,
        marginVertical: 6
    },
    inputBtn: {
        paddingHorizontal: 10
    },
    textStyle: {
        fontSize: 12,
        fontFamily: AppStyles.fonts.defaultFont
    },
    dateView: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: AppStyles.colors.subTextColor,
        flexDirection: "row"
    },
    calendarImg: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
        marginVertical: 3
    },
    graphContainer: {
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 10,
        borderColor: AppStyles.colors.subTextColor,
        marginVertical: 5,
        paddingRight: 10
    },
    labelStyle: {
        marginHorizontal: 10,
        fontFamily: AppStyles.fonts.semiBoldFont,
        fontSize: 16,
        paddingTop: 5
    }
});