import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
    underLine: {
        height: 1, 
        width: "100%",
        backgroundColor: "#f5f5f6",
        marginVertical: 10
    },
    scrollContainer: {
        paddingHorizontal: 20, 
        marginTop: Platform.OS == 'android'? 50: 50
    },
    textContainer: {
        flexDirection: 'column', 
        justifyContent:'center',
        paddingLeft: 10
    },
    nameText: {
        fontSize: 15, 
        marginBottom: Platform.OS == 'android'? 2: 6
    },
    emailText: {
        fontSize: 11, 
        color: AppStyles.colors.subTextColor
    }
})
