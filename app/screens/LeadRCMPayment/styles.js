import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  viewButtonStyle: {
    backgroundColor: 'white',
    height: 40,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTextStyle: {
    fontFamily: AppStyles.fonts.boldFont,
    color: AppStyles.colors.primaryColor,
    letterSpacing: 0.7
  },
  mainBlackWrap: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    padding:5,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  blackInputWrap: {
    width: '50%',
    padding: 5,
  },
  fullWidth: {
    width: '100%',
  },
  blackInputText: {
    color: '#000',
    marginBottom: 2,
    marginLeft: 3,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  blackInput: {
    minHeight: 30,
    fontSize: 14,
    marginLeft: 3,
    fontWeight: 'bold',
    color: '#0F74EE',
  },
  blackInputdate: {
    width: '20%',
    borderRadius: 4,
  },
  dateText: {
    width: '20%',
    minHeight: 30,
    alignSelf:'center',
    letterSpacing: 2,
    fontSize: 10,
  },
  sideBtnInput: {
    width: '20%',
    borderRadius: 4,
  },
  addBtnColorLeft: {
    backgroundColor: '#0D73EE'
  },
  addBtnColorRight: {
    backgroundColor: 'transparent'
  },
  addImg: {
    width: 30,
    height: 30,
    marginTop: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});