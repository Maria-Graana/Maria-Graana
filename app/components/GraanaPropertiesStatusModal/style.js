import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#e7ecf0',
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  timesBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
  },
  timesImg: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  MainTileView: {
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    padding: 15,
    // paddingTop: 15,
    // paddingBottom: 15,
  },

  topHeader: {
    backgroundColor: '#006ff1',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  headingText: {
    color: '#fff',
    fontSize: 18,
  },
  statusButtons: {
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    borderColor: '#0f73ee',
    backgroundColor: '#fff',
  },
  statusBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f73ee',
  },
  mainFormView: {
    // backgroundColor: '#fff',
    borderRadius: 4,
  },
});