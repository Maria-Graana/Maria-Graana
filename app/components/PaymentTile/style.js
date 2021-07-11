/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileTopWrap: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 6,
    padding: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  upperLayer: {
    position: 'relative',
    marginBottom: 5,
    paddingTop: 5,
  },
  paymnetHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tileStatus: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    paddingTop: 3,
    paddingBottom: 2,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    overflow: 'hidden',
  },
  statusRed: {
    borderColor: '#b38f8d',
    backgroundColor: '#ecc8c4',
    color: '#615643',
  },
  statusYellow: {
    borderColor: '#d1d0a1',
    backgroundColor: '#f9f4d5',
    color: '#615743',
  },
  statusGreen: {
    borderColor: '#c0ccb7',
    backgroundColor: '#ddf3d4',
    color: '#4c6143',
  },
  bottomLayer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 1,
    paddingTop: 10,
  },
  formatPrice: {
    // width: '40%',
    flex: 0.9,
    color: '#0070f2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  totalPrice: {
    // width: '30%',
    flex: 0.9,
    color: '#0070f2',
    fontWeight: 'bold',
    paddingTop: 2,
    fontSize: 16,
  },
  priceDate: {
    // width: '30%',
    flex: 1,
    color: '#1d1d27',
    fontSize: 12,
    textAlign: 'right',
    paddingTop: 4,
  },
  phoneView: {
    // flex: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: 40,
  },
  callImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
})
