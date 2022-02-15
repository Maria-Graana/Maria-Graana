/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  safeView: { flex: 0, backgroundColor: AppStyles.colors.backgroundColor },
  flexView: { backgroundColor: AppStyles.colors.backgroundColor, flex: 1 },
  barView: {
    height: 50,
    backgroundColor: AppStyles.colors.primaryColor,
    justifyContent: 'center',
  },
  barText: {
    color: 'white',
    marginHorizontal: 15,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
  },
  topHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
  },
  headerText: {
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    color: AppStyles.colors.primaryColor,
  },
  padLeft: {
    paddingLeft: 15,
  },
  detailText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    color: AppStyles.colors.primaryColor,
  },
  kfiBTN: {
    marginHorizontal: 15,
    backgroundColor: AppStyles.colors.backgroundColor,
    marginTop: 30,
  },
  btnStyle: {
    backgroundColor: AppStyles.colors.backgroundColor,
  },
  commentStyle: { flex: 1, justifyContent: 'space-between' },
})
