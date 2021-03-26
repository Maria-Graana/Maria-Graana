import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: 50,
  },
  mainbutton: {
    borderWidth: 1,
    borderColor: '#696969',
    alignItems: 'center',
    minHeight: 150,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 28,
  },
  containerImg: {
    margin: 5,
    width: 12,
    height: 12,
    resizeMode: 'contain'
  },
  btnStyle: {
    zIndex: 10,
    borderColor: '#ffffff',
    marginHorizontal: 5,
    flexDirection: "row",
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignItems: "center",
    padding: 6,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18
  },
  font: {
    fontFamily: AppStyles.fonts.boldFont,
    marginRight: 5
  },
  btnView: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    flexDirection: "row",
    marginHorizontal: 5
  },
  kpiContainer:{
    backgroundColor: 'white',
    width: wp('45%'),
    position: 'absolute',
    minHeight: hp('15%'),
    bottom: hp('20%'),
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    left: 0,
    shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18
  },
  kpiText:{
    fontSize: AppStyles.fontSize.medium, 
    fontFamily: AppStyles.fonts.boldFont
  },
});