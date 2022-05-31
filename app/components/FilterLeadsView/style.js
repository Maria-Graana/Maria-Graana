/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  filterPressable: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
  },
  filterPressableForContacts: {
    borderRadius: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  filterMainView: {
    marginBottom: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  filterScroll: {
    padding: 10,
  },
  clearText: {
    color: AppStyles.colors.primaryColor,
  },
  clearPressable: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5,
  },
  sortImg: {
    resizeMode: 'contain',
    width: 20,
  },
})
