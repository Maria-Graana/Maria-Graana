import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#E8EDF0',
    borderRadius: 10,
    padding: 15,
    paddingTop: 50,
    paddingBottom: 50,
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
    top: 15,
  },
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});