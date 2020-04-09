import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  mainTileView: {
    backgroundColor: '#fff',
    padding: 15,
    position: 'relative',
    marginBottom: 15,
    zIndex: 5,
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  contentView: {
    position: 'relative',
    paddingRight: 15,
    zIndex: 20,
  },
  fontBold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  meetingCon: {
    fontSize: 14,
    color: '#0D73EE'
  },
  border: {
    width: '99%',
    flexDirection: 'row'
  },
  dotsWrap: {
    // position: 'absolute',
    zIndex: 22,
    // right: 0,
    // top: 1,
  },
  dotsImg: {
    width: 10,
    height: 20,
    resizeMode: 'contain'
  },
  doneText: {
    borderWidth: 1,
    borderColor: '#2A7EF0',
    overflow: 'hidden',
    borderRadius: 12,
    color: '#2A7EF0',
    position: 'relative',
    top: -4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 12,
  },
  dropDownMain: {
    position: 'absolute',
    right: 15,
    top: '100%',
    width: 190,
    backgroundColor: '#fff',
    zIndex: 20,
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4,
    padding: 10,
  },
  doneBtnBottom: {
    paddingTop: 0,
    paddingLeft: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  blueColor: {
    color: '#333',
  },
});