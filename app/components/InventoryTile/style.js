import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileMainWrap: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
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
});