/** @format */

import { StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  filterRow: {
    backgroundColor: '#fff',
    paddingTop: 10,
    flexDirection: 'row',
    paddingBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  pickerMain: {
    width: '70%',
    borderWidth: 1,
    borderRadius: 4,
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
    width: '30%',
  },
  pageTypeRow: {
    // alignItems: 'center',
    // flexDirection: 'row',
    width: '30%',
    // marginHorizontal: 10,
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: AppStyles.colors.subTextColor,
  },
  iconRow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '3%',
  },
  filterPressable: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
  },
  filterMainView: {
    marginBottom: 15,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  filterScroll: {
    marginVertical: 5,
    padding: 10,
  },
})
