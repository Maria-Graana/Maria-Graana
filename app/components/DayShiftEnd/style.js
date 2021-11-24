/** @format */

import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    backgroundColor: '#efefef',
  },
  topView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    right: '4%',
    top: '6.5%',
  },
  cardView: {
    backgroundColor: 'white',
    marginRight: '5%',
    marginLeft: '5%',
    marginTop: '5%',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardInnerSpace: {
    marginTop: 10,
  },
  card: {
    padding: 20,
  },
  endPageBtn: {
    justifyContent: 'center',
    minHeight: 55,
    padding: 15,
  },
  buttonEndView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  bigLabelBoxText1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  bigLabelBoxText2: {
    fontWeight: 'bold',
    color: 'black',
  },
  bigBoxViewInner: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginLeft: '5%',
    borderRadius: 10,
  },
  bigBoxViewOuterLeft: {
    backgroundColor: '#0f73ee',
    borderRadius: 10,
    minWidth: '43%',
  },
  bigBoxViewOuterRight: {
    backgroundColor: '#0f73ee',
    borderRadius: 10,
    minWidth: '43%',
    marginLeft: '3%',
  },
  containerRow: {
    flexDirection: 'row',
    marginRight: '5%',
    marginLeft: '5%',
    marginTop: '5%',
  },
  OverDueBox: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginLeft: '3%',
    minWidth: '43%',
  },
  TotalLabel1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  TotalLabel2: {
    fontWeight: 'bold',
    color: 'white',
  },
  TotalBox: {
    padding: 20,
    backgroundColor: '#0f73ee',
    borderRadius: 10,
    minWidth: '43%',
  },
})
