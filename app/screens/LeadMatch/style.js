import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    headingText: {
        fontSize: 16, 
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 0,
        fontFamily: AppStyles.fonts.defaultFont
    },
    padLeft: {
        marginRight: 15,
        paddingBottom: 2
    },
    labelText: {
        fontSize: 20, 
        paddingBottom: 5,
        paddingLeft: 5,
        fontFamily: AppStyles.fonts.semiBoldFont
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
});