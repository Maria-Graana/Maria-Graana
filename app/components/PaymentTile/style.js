import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileTopWrap: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 6,
    padding: 5,
    marginBottom: 5,
    backgroundColor: '#fff'
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
    textTransform: 'uppercase'
  },
  tileStatus: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    paddingTop: 3,
    paddingBottom: 2,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    marginTop: 1,
  },
  formatPrice: {
    width: '40%',
    color: '#0070f2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  totalPrice: {
    width: '30%',
    color: '#0070f2',
    fontWeight: 'bold',
    paddingTop: 2,
    fontSize: 16,
  },
  priceDate: {
    width: '30%',
    color: '#1d1d27',
    fontSize: 12,
    textAlign: 'right',
    paddingTop: 4,
  },
});
