/** @format */

import { StyleSheet, Dimensions } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('screen')

export default StyleSheet.create({
  toastStyle: {
    backgroundColor: '#656565',
    borderRadius: 25,
    paddingStart: 15,
    paddingEnd: 15,
    padding: 10,
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 36,
    right: 10,
    padding: 15,
    elevation: 2,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  commonPadding: {
    padding: 5,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100,
  },

  markerStyle: {
    height: 20,
    width: 20,
  },

  commonFont: {
    fontSize: 18,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
  centerAlign: {
    alignItems: 'center',
  },
  legalStatusTextStyle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  plotInfoOrientation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  loadingPlotsStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingPlotsTextStyle: {
    color: '#0F73EE',
    fontSize: 18,
  },

  housingSchemeSearchInputStyle: {
    marginTop: 10,
    width: wp('80%'),
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalHeadingView: {
    padding: 10,
    marginTop: 46,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },

  modalHeadingText: {
    fontSize: 24,
    color: '#0F73EE',
  },

  modalLabelStyle: {
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 6,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.88,
    backgroundColor: '#0F73EE',
    padding: 15,
    marginLeft: 16,
    marginTop: 14,
    borderRadius: 12,
  },

  legalStatusStyle: {
    marginRight: 32,

    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    width: 132,
    borderRadius: 32,
  },

  isPanding: {
    marginTop: -64,
  },
  marker: {
    height: 48,
    width: 48,
  },
  inputStyle: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    flexShrink: -1,
    top: -hp('86%'),
    width: '95%',
    borderRadius: 12,
    margin: 12,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  footer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    // backgroundColor: 'rgb(0, 0, 0)',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 250,
    elevation: 10,
    zIndex: 4,
  },
  region: {
    color: '#fff',
    lineHeight: 28,
    marginLeft: 16,
  },
  promptStyle: {
    fontSize: 20,
    color: '#454F64',
    // marginTop: ,
    padding: 5,
  },

  labelStyle: {
    fontSize: 20,
    color: '#000',
    //marginTop: 4,
    fontWeight: 'bold',
    padding: 5,
  },

  plotInfoStyle: {
    color: '#fff',
    marginLeft: 16,
    fontSize: 20,
    fontWeight: '600',
  },

  modalItemStyle: {
    flex: 1,
    padding: 10,
  },
  plotLabelStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    borderRadius: 10,
    borderWidth: 4,
  },

  selectedPlotLabelStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#0F73EE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    padding: 2,
    textAlign: 'center',
  },

  plotLabelViewStyle: {
    borderRadius: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedPlotLabelViewStyle: {
    borderRadius: 14,
    backgroundColor: '#0F73EE',
    marginBottom: 5,
  },

  loaderStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -hp('90%'),
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  crossIcon: { width: 15, height: 15, resizeMode: 'contain' },
  searchInput: { flex: 1, height: 50, fontSize: 16 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWithResultsContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    flexShrink: -1,
    top: 10,
    width: '95%',
    borderRadius: 12,
    margin: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
})
