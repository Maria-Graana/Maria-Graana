import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 10,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        borderRadius: 4,
        marginVertical: hp('1%%'),
        paddingHorizontal: wp('2%'),
        paddingBottom: wp('3%'),
        marginHorizontal: wp('1%'),
    },
    buttonStyle:{
        marginVertical:hp('3%')
    }
});