import { StyleSheet } from 'react-native';
export default styles = StyleSheet.create({
  widthModal:{
    width: '100%',
    marginLeft: 0,
  //   minHeight: '100%'
  },
  modalMain: {
    backgroundColor: '#E8EDF0',
    borderRadius: 10,
    padding: 10,
    paddingTop: 50,
    // minHeight: '60%',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  addInvenBtn: {
    marginTop: 50,
  },
  timesBtn: {
    position: 'absolute',
    right: 15,
    top: 35,
  },
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  mainInputWrap: {
    width: '50%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  mainTopHeader: {
    flexDirection: 'row'
  },
  offerColor: {
    color: '#2b2c34',
    marginBottom: 5,
  },
  inputWrap: {
    backgroundColor: '#fff',
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden'
  },
  formControl: {
    backgroundColor: '#fff',
    height: 50,
    width: '70%',
    paddingLeft: 10,
  },
  sideBtnInput: {
    width: '30%',
    borderRadius: 4,
    overflow: 'hidden'
  },
  addBtnColorLeft: {
    backgroundColor: '#0D73EE'
  },
  addBtnColorRight: {
    backgroundColor: '#1D1C25'
  },
  addImg: {
    width: 40,
    height: 40,
    marginTop: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  chatContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: '75%',
    maxHeight: '75%',
    overflow: 'hidden',
  },

  mainChatWrap: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    maxWidth: '60%',
    minWidth: '60%',
    borderRadius: 4,
    padding: 15,
    paddingLeft: 20,
    position: 'relative',
    elevation: 3,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  caret: {
    position: 'absolute',
    top: 4,
    width: 25,
    height: 25,
    backgroundColor: '#fff',
    zIndex: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
    opacity: 0,
  },
  caretLeft: {
    left: -9,
  },
  caretRight: {
    right: -9,
  },
  priceStyle: {
    letterSpacing: 1.5,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceBlue: {
    color: '#0D73EE'
  },
  priceBlack: {
    color: '#1D1C25'
  },
  dataTime: {
    fontSize: 12,
    color: '#A9A9AA',
    letterSpacing: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
    width: '100%',
    alignContent: 'flex-end'
  },
  textRight: {
    textAlign: 'right'
  },
  offerColorLast: {
    color: '#2b2c34',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 15,
  },
  inputWrapLast: {
    backgroundColor: '#fff',
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden'
  },
  formControlLast: {
    backgroundColor: '#fff',
    height: 50,
    width: '80%',
    color: '#0D73EE',
    paddingLeft: 10,
  },
  sideBtnInputLast: {
    width: '20%',
    borderRadius: 4,
    overflow: 'hidden'
  },
  checkImg: {
    width: 30,
    height: 40,
    marginTop: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});