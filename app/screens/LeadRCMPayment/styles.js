import { StyleSheet, Platform } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  viewButtonStyle: {
    backgroundColor: '#fff',
        height: 30,
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: "center",
        alignItems: "center"
  },
  buttonTextStyle: {
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor,
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
    width: '32%',
    borderRadius: 4,
  },
  dateText: {
    width: '20%',
    minHeight: 30,
    alignSelf:'center',
    fontSize: 10,
  },
  sideBtnInput: {
    width: '30%',
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
  addPaymentBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#006ff1',
    borderRadius: 4,
    borderWidth: 1,
    color: '#006ff1',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    marginTop: 15,
  },
  addPaymentBtnImg: {
    resizeMode: 'contain',
    width: 15,
    marginRight: 5,
    height: 15,
    position: 'relative',
    top: 3,
  },
  addPaymentBtnText: {
    color: '#006ff1',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});