import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
    btn1: {
        marginBottom: 40,
    },
    backImg: {
        width: 30,
        height: 30,
        marginTop: 5,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    headerView: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: Platform.OS === 'android' ? 15 : 0
    },
    headerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    headerText: {
        paddingRight: 30,
        fontFamily: AppStyles.fonts.semiBoldFont,
        fontSize: 16
    },
    pad5: {
        padding: 15
    },
    btnWrap: {
        padding: 15,
        paddingBottom: 0
    }
});