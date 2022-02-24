/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7ecf0',
  },
  filterRow: {
    backgroundColor: '#fff',
    paddingTop: 10,
    flexDirection: 'row',
    paddingBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  pickerMain: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ebebeb',
    overflow: 'hidden',
  },
  pickerStyle: {
    height: 40,
  },
  customIconStyle: {
    fontSize: 24,
  },
  searchTextContainerStyle: {
    flexDirection: 'row',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#ebebeb',
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  searchAreaInput: {
    width: '70%',
    paddingVertical: Platform.OS === 'android' ? 5 : 10,
    paddingHorizontal: 10,
  },
})
