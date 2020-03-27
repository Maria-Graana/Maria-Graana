import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
    mainInputWrap: {
        position: 'relative',
        marginBottom: 10,
        marginTop: 10,
    },
    inputWrap: {
        position: 'relative',
    },
    formControl: {
        backgroundColor: '#fff',
        borderRadius: 4,
        fontSize: 14,
        borderWidth: 0,
        height: 45,
    },
    inputPadLeft: {
        paddingLeft: 10,
    },
    uploadImg: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#5297F4',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingBottom: 50,
        borderRadius: 4,
    },
    uploadImageText: {
        color: '#5297F4'
    },
    addInvenBtn: {
        marginBottom: 40,
    },
    radioComponentStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 15
    },
    countPrice: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#fff',
        fontSize: AppStyles.noramlSize.fontSize,
        fontFamily: AppStyles.fonts.defaultFont,
        height: '100%',
        width: '14%',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        backgroundColor: '#fafafa',
        borderColor: '#EAEEF1',
    }
})