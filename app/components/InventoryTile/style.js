import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileMainWrap: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    position: 'relative',
    paddingTop: 40,
    marginBottom: 15,
  },
  largeText: {
    fontSize: 18,
  },
  contentMultiMain: {
    flexDirection: 'row',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 15,
    right: 0,
  },
  contentMainWrap: {
    position: 'relative',
    paddingRight: 30,
  },
  tokenLabel: {
    backgroundColor: '#494949',
    overflow: 'hidden',
    borderRadius: 12,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 12,
  },
  phoneWrap: {
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
  phoneIcon: {
    width: 20,
    height: 20,
  },
  fireIcon: {
    width: 15,
    height: 20,
  },
  verticalIcon: {
    position: 'relative',
    top: -5,
  },
});