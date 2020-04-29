import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
    btn1: {
        marginBottom: 40,
    },
    textCeformControlMultinter: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: 'OpenSans_regular',
        color: '#333'
    },
    formControlMulti: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
        position: 'relative',
        borderRadius: 5,
        minHeight: 45,
        overflow: 'hidden',
        borderBottomWidth: 0,
    },
    backImg: {
        width: 30,
        height: 30,
        marginTop: 5,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});