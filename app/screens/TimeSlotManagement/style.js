/** @format */

import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  timePageBtn: {
    justifyContent: 'center',
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
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourCol: {
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourRow: {
    minWidth: 50,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.6,
    borderColor: 'grey',
  },
  viewHourCol: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 50,
  },
  viewMinCol: {
    flexDirection: 'row',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  timeText: {
    fontSize: 10,
  },
  taskLengthView: {
    backgroundColor: '#D3D3D3',
    borderRadius: 100,
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 3,
    paddingBottom: 3,
  },
})
