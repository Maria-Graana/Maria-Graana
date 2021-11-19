/** @format */

import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  timePageBtn: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonInputWrap: {
    marginTop: 15,
    justifyContent: 'flex-end',
  },
  minCol: {
    minWidth: '4%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourCol: {
    minWidth: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourRow: {
    minWidth: '5%',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 23,
    paddingBottom: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 0.6,
    borderColor: 'grey',
  },
  viewHourCol: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 60,
  },
  viewMinCol: {
    flexDirection: 'row',
  },
})
