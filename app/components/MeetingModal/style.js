import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#E8EDF0',
    borderRadius: 10,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
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
  mainViewBtn: {
    marginTop: 15,
    flexDirection: 'row'
  },
  mainBtnAction:{
    padding: 8,
    marginRight: 10,
    backgroundColor: '#0f73ee',
    borderRadius: 4,
    paddingLeft: 15,
    paddingRight: 15,
  },
  whiteColor: {
    color: '#fff'
  },
});