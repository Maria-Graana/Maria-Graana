import { StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen';
export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal:0,
    },
    contentContainerStyle: {
        paddingHorizontal: widthPercentageToDP('2%')
    }

});