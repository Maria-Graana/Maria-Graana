import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileMainWrap: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom: 10,
  },
  leftimgView: {
    width: '40%',
    padding: 5,
  },
  rightContentView: {
    width: '60%',
    padding: 5,
  },
  propertyImg: {
    width: '100%',
    borderRadius: 4,
    height: 140,
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
  contentMainWrap: {
    position: 'relative',
  },
  tokenLabel: {
    borderWidth: 1,
    borderColor: '#2A7EF0',
    overflow: 'hidden',
    borderRadius: 12,
    color: '#2A7EF0',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 12,
  },
  fireIcon: {
    width: 18,
    height: 18,
  },
  verticalIcon: {
    position: 'relative',
    top: -5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600'
  },
  priceColor: {
    color: '#2A7EF0',
  },
  selectedInventory: {
    borderColor: '#2A7EF0',
    borderWidth: 1,
  },
});