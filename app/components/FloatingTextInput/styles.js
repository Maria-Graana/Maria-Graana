import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default StyleSheet.create({
    itemWrap: {
        borderRadius: 4,
        borderColor:AppStyles.colors.primaryColor,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingBottom:4,
        marginHorizontal: 12
    },
    labelStyle:{
        fontSize:AppStyles.fontSize.medium,
        fontFamily:AppStyles.fonts.defaultFont,
        paddingHorizontal: 16,
    }
})