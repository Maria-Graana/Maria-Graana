/** @format */

import { StyleSheet, Platform } from 'react-native'
export default styles = StyleSheet.create({
  countStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f73ee',
    backgroundColor: '#fff',
    width: Platform.OS === 'ios' ? 20 : 20,
    height: Platform.OS === 'ios' ? 20 : 20,
    borderRadius: Platform.OS === 'ios' ? 18 : 50,
    textAlign: 'center',
    paddingTop: 3,
    marginLeft: 5,
  },
 
})
