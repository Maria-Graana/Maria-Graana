import AppStyles from '../../AppStyles';
import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    headingText: {
        fontSize: 12,
        paddingLeft: 5,
        paddingBottom: 0,
        fontFamily: AppStyles.fonts.lightFont
    },
    padLeft: {
        paddingBottom: 2
    },
    labelText: {
        fontSize: 18,
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
        paddingVertical: 10,
        paddingHorizontal:15,
    },
    pad: {
        padding: 10
    },
    underLine: {
        height: 1,
        width: "100%",
        backgroundColor: "#ddd",
        marginVertical: 10,
        marginHorizontal: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leadTypeHeading: {
        flex: 1,
    },
    statusView: {
        borderColor: AppStyles.colors.primaryColor,
        height: 25,
        borderWidth: 1,
        borderRadius: 32,
        justifyContent: "center",
        paddingHorizontal: 10,
        alignItems: "center"
    },
    roundButtonView: {
        backgroundColor: AppStyles.colors.primaryColor,
        borderRadius: 32,
        justifyContent: "center",
        alignSelf:'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
        alignItems: "center"
    },
    textStyle: {
        fontSize: 12,
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.primaryColor
    },
    assignButtonView: {
        marginTop: 5,
        marginBottom: 5
    }
});