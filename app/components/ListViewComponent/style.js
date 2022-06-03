/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  listView: {
    padding: 20,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 10,
    fontFamily: AppStyles.fonts.defaultFont,
    fontWeight: '900',
  },
  listElement: {
    fontSize: 16,
    paddingVertical: 10,
    fontFamily: AppStyles.fonts.defaultFont,
    fontWeight: '300',
  },
  listButton: {
    justifyContent: 'center',
  },
  listStyle: {
    marginBottom: 20,
    marginLeft: 10,
  },
  listborder: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
})
