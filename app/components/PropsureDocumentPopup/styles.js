import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
    viewContainer: {
        marginLeft: 25,
        marginRight: 25,
        justifyContent: 'center',
    },
    closeStyle: {
        position: 'absolute',
        right: 15,
        top: Platform.OS == 'android' ? 10 : 40,
        paddingVertical: 5
    },
});