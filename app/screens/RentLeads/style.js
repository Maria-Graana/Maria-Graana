/** @format */

import { StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
  filterRow: {
    backgroundColor: '#fff',
    paddingTop: 10,
    flexDirection: 'row',
    paddingBottom: 10,
    width: '100%',
  },
  emptyViewWidth: {
    width: '75%',
  },
  pickerMain: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ebebeb',
    overflow: 'hidden',
  },
  idPicker: {
    width: '25%',
    marginLeft: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ebebeb',
    overflow: 'hidden',
  },
  pickerStyle: {
    height: 40,
  },
  customIconStyle: {
    fontSize: 24,
  },
  sortBtn: {
    flexDirection: 'row',
  },
  sortImg: {
    resizeMode: 'contain',
    width: 20,
  },
  sortText: {
    paddingTop: 10,
    marginLeft: 5,
    fontSize: 16,
    color: '#393939',
  },
  stylesMainSort: {
    marginHorizontal: 15,
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paddingHorizontal: {
    paddingHorizontal: widthPercentageToDP('2.5%'),
  },
  roundButtonView: {
    backgroundColor: AppStyles.colors.primaryColor,
    borderRadius: 32,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    width: '20%',
  },
})
