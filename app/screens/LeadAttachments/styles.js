import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
    addAttachmentContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        marginTop:10,
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    listAttachmentTextStyle:{
        paddingHorizontal: 10, 
        fontFamily: AppStyles.fonts.defaultFont,
         fontSize: AppStyles.noramlSize.fontSize
    }
});