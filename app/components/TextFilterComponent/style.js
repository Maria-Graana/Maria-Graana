/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  textView: {
    padding: 20,
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  textElement: {
    fontSize: 18,
    fontWeight: '500',
    padding: 15,
    color: 'white',
  },
  textButton: {
    backgroundColor: AppStyles.colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 5,
  },
  textBackground: {
    backgroundColor: 'white',
  },
})