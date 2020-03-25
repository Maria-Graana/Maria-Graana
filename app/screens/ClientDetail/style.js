import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    headingText: {
        fontSize: 16, 
        padding: 5,
        paddingBottom: 0,
        fontFamily: AppStyles.fonts.defaultFont
    },
    labelText: {
        fontSize: 20, 
        padding: 5,
        fontFamily: AppStyles.fonts.semiBoldFont
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
    }
});