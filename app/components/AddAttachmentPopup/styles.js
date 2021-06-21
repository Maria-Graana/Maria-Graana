/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  viewContainer: {
    marginLeft: 25,
    marginRight: 25,
    justifyContent: 'center',
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
    top: Platform.OS == 'android' ? 10 : 40,
    paddingVertical: 5,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    width: '100%',
    height: 50,
    alignSelf: 'center',
  },
})
