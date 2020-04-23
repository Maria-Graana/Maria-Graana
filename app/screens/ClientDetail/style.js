import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles';

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
    labelText: {
        fontSize: 18, 
        paddingBottom: 5,
        paddingLeft: 5,
        textAlign: 'left',
        fontFamily: AppStyles.fonts.defaultFont
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