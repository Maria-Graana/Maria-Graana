/** @format */

import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

export default StyleSheet.create({
  map: { flex: 1 },
  mapModalContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#0F73EE',
    alignSelf: 'center',
  },
  whiteArrow: { width: 15, height: 15, resizeMode: 'contain' },
  coordinatesText: { color: '#fff', fontSize: 18, marginTop: 10 },
  whiteCheck: { width: 30, height: 30, resizeMode: 'contain', marginLeft: 10 },
  markLocationText: { color: '#fff', fontSize: 16 },
  markLocationBtnContainer: {
    width: wp('90%'),
    borderRadius: 10,
    backgroundColor: '#0F73EE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 15,
  },
  coordinatesContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    zIndex: 1000,
    width: wp('100%'),
    shadowOpacity: 0.1,
    elevation: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
})
