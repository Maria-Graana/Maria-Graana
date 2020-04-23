import AppStyles from '../../AppStyles';
import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    headingText: {
        fontSize: 12,
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 0,
        fontFamily: AppStyles.fonts.lightFont
    },
    padLeft: {
        paddingBottom: 2
    },
    labelText: {
        fontSize: 18,
        paddingBottom: 5,
        paddingLeft: 5,
        fontFamily: AppStyles.fonts.defaultFont
    },
    btn1: {
        marginBottom: 40,
    },
    outerContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 20,
        flexDirection: 'row'
    },
    innerContainer: {
        flex: 1,
        padding: 10
    },
    pad: {
        padding: 10
    },
    underLine: {
        height: 1,
        width: "100%",
        backgroundColor: "#f5f5f6",
        marginHorizontal: 10,
        marginVertical: 20
    },
    tokenLabel: {
        borderWidth: 1,
        borderColor: '#2A7EF0',
        overflow: 'hidden',
        borderRadius: 12,
        color: '#2A7EF0',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 12,
    },
    mainView: {
        borderColor: AppStyles.colors.primaryColor,
        // height: 20,
        paddingVertical: 5,
        paddingHorizontal: 10, 
        // width: 80,
        borderWidth: 1,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle: {
        fontSize: 12,
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.primaryColor
    }
});