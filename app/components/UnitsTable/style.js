/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  flexView: { backgroundColor: 'white', flex: 1 },
  topHeader: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  backImg: {
    width: 30,
    height: 30,
    marginTop: 5,
    marginLeft: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
  },
  headerText: {
    paddingRight: 30,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
  },
  mainView: {
    backgroundColor: AppStyles.colors.backgroundColor,
    flex: 1,
  },
  headerText: {
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    color: AppStyles.colors.primaryColor,
  },
  detailText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    color: AppStyles.colors.primaryColor,
  },
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
  tableView: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  safeView: { flex: 0, backgroundColor: AppStyles.colors.backgroundColor },
  tableMainBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 20,
  },
  mainBarText: {
    flex: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 14,
  },
  mainBarAmountText: {
    flex: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 14,
    textAlign: 'center',
  },
  amountText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    textAlign: 'center',
  },
  paymentText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    textAlign: 'left',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderColor: AppStyles.colors.primaryColor,
  },
  headerTable: {
    height: 50,
    backgroundColor: '#f1f8ff',
    borderColor: AppStyles.colors.primaryColor,
  },
  headerTextStyle: {
    textAlign: 'left',
    fontFamily: AppStyles.fonts.defaultFont,
    paddingLeft: 5,
    color: AppStyles.colors.primaryColor,
  },
  text: { textAlign: 'left', fontFamily: AppStyles.fonts.defaultFont, paddingLeft: 5 },
  dataWrapper: { marginTop: 0 },
  row: {
    height: 40,
    backgroundColor: '#ffffff',
    borderColor: AppStyles.colors.primaryColor,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: AppStyles.colors.primaryColor,
  },
})
