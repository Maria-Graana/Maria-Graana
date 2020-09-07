import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';
import { apps } from 'firebase';

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
    addMoreImg: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#5297F4',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        marginTop: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 4,
        margin: 5,
    },
    extraAddMore: {
        paddingHorizontal: 10,
        width: '50%',
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#5297F4',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    uploadImageText: {
        color: '#5297F4'
    },
    close: {
        top: 4,
        elevation: 5,
        zIndex: 5,
        color: "grey",
        alignSelf: 'flex-end',

    },
    backGroundImg: {
        resizeMode: "contain",
        width: 130,
        height: 130,
        marginHorizontal: 10,
        marginTop: 20,
        marginBottom: 20,
        // marginBottom: 5
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
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        backgroundColor: '#fafafa',
        borderColor: '#EAEEF1',
    },
    additonalViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#EAEEF1',
        borderWidth: 1,
        borderRadius: 4
    },
    additionalInformationText: {
        width: '86%',
        paddingLeft: 15,
        fontSize: AppStyles.fontSize.medium,
        color: AppStyles.colors.textColor,
    },
    additionalDetailsIconView: {
        width: '14%',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderLeftWidth: 1,
        borderColor: '#EAEEF1',
        padding: 10,
    },
    headings: {
        fontSize: AppStyles.fontSize.large,
        fontFamily: AppStyles.fonts.semiBoldFont,
        color: AppStyles.colors.subTextColor,
        marginVertical: 10,
    },
    additionalViewMain: {
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    featureOpacity: {
        flexDirection: "row",
        width: '50%',
        alignItems: 'center',
        padding: 5,
    },
    featureText: {
        fontSize: 12,
        color: AppStyles.colors.textColor,
    },
    buttonWidth: {
        width: '80%'
    },
})