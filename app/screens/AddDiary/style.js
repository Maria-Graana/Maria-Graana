import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
    safeAreaViewcontainer: {
        flex: 1,
        backgroundColor: AppStyles.colors.backgroundColor,
    },
    innerViewStyle: {
        paddingVertical: AppStyles.standardPaddingVertical.paddingVertical,
    },
    itemWrap: {
        backgroundColor: '#ffffff',
        borderRadius: 4,
        marginVertical: AppStyles.standardMarginVertical.marginVertical,
        minHeight: 60,
        borderColor: '#f0f0f0',
        marginHorizontal: 16,
        paddingHorizontal: Platform.OS === 'android' ? 4 : 0
        // flex:1
    },
})