import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default styles = StyleSheet.create({
  mainbutton: {
    height: hp('25%'),
    marginBottom: wp('5%'),
    borderWidth: 0,
    zIndex: 5,
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 28,
    fontFamily: AppStyles.fonts.boldFont,
  },
  buttonImg: {
    width: 400,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain'
  },
});