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
        marginVertical: 5
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
        marginHorizontal: 10
    },
    selectedBtn: {
        backgroundColor: AppStyles.colors.primaryColor,
        borderColor: AppStyles.colors.primaryColor
    },
    btnView: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});