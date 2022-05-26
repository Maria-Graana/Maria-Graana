/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  dateView: {
    padding: 20,
    justifyContent: 'center',
  },
  dateElement: {
    fontSize: 18,
    padding: 15,
    fontWeight: '500',
    color: 'white',
  },
  dateButton: {
    backgroundColor: AppStyles.colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
})
