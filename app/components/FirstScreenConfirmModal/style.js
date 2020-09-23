import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#fff',
    // borderRadius: 10,
    padding: 15,
    paddingTop: 30,
    paddingBottom: 50,
    borderRadius: 4,
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  timesBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  MainTileView: {
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingTop: 15,
    paddingBottom: 15,
  },
  smallText: {
    color: '#1F2029',
    fontSize: 14,
    marginBottom: 3,
    textTransform: 'capitalize',
  },
  largeText: {
    color: '#1F2029',
    fontSize: 20,
  },
  noBorder: {
    borderBottomWidth: 0
  },
  topTextMain: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  noramlText: {
    fontSize: 16,
    marginBottom: 10,
  },
  mainTextLarge: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  confirmBtnView: {
    flexDirection: 'row',
    marginTop: 15,
  },
  confirmBtn: {
    marginRight: 10,
  },
  activeBtn: {
    backgroundColor: '#0070f1',
    color: '#fff'
  },
  textCenter: {
    color: '#0070f1',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: '#fff',
    borderColor: '#0070f1',
    borderWidth: 1,
    borderRadius: 4,
  },
});