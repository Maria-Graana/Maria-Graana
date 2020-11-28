import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 30,
    paddingBottom: 50,
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    borderRadius: 10,
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
    borderTopWidth: 1,
    borderColor: '#ECECEC',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 15,
  },
  smallText: {
    color: '#1F2029',
    fontSize: 16,
    marginBottom: 3,
    textTransform: 'capitalize',
  },
  smallestText: {
    fontSize: 12,
  },
  largeText: {
    color: '#1F2029',
    fontSize: 18,
  },
  noBorder: {
    borderTopWidth: 0
  },
});