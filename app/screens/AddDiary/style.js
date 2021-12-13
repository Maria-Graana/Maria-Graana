/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  arrowIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    zIndex: 2,
  },
  checkBoxRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkBoxText: {
    marginHorizontal: 15,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontSize: 14,
    paddingVertical: 5,
    paddingBottom: 0,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  labelText: {
    fontSize: 14,
    paddingVertical: 5,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  taskResponse: {
    paddingHorizontal: 10,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 14,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#FFC61B',
  },
  editViewContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 4,
    marginVertical: 10,
  },
})
