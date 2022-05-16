/** @format */

import AppStyles from '../../AppStyles'
import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    borderColor: AppStyles.colors.subTextColor,
    borderWidth: 0.5,
    borderRadius: 4,
    marginVertical: 10,
    padding: 1,
    elevation: 5,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    backgroundColor: 'white',
  },
  cardItemGrey: {
    backgroundColor: AppStyles.bgcWhite.backgroundColor,
    padding: 10,
  },
  cardItemWhite: {
    backgroundColor: AppStyles.bgcWhite.backgroundColor,
    padding: 10,
  },
  headingText: {
    fontSize: 12,
    paddingLeft: 5,
    fontFamily: AppStyles.fonts.lightFont,
  },
  headingTextTypeTwo: {
    fontSize: 14,
    paddingLeft: 5,
    fontFamily: AppStyles.fonts.lightFont,
    width: '35%',
  },
  labelTextTypeTwo: {
    fontSize: 14,
    paddingLeft: 5,
    fontFamily: AppStyles.fonts.defaultFont,
    width: '65%',
  },
  padLeft: {
    paddingBottom: 2,
  },
  labelText: {
    fontSize: 18,
    paddingLeft: 5,
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  btn1: {
    marginBottom: 40,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainerType2: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusView: {
    borderColor: AppStyles.colors.primaryColor,
    height: 25,
    borderWidth: 1,
    borderRadius: 32,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 5,
    width: '30%',
  },
  roundButtonView: {
    backgroundColor: AppStyles.colors.primaryColor,
    borderRadius: 32,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor,
  },
  assignButtonView: {
    marginTop: 5,
    marginBottom: 5,
  },
  mainDesView: {
    flexDirection: 'row',
  },
  viewOne: {
    width: '90%',
  },
  viewTwo: {
    width: '10%',
    alignItems: 'center',
  },
  editImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  inputDes: {
    color: '#1d1d26',
    height: 40,
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  roundButtonViewTwo: {
    backgroundColor: '#0f73ee',
    marginTop: 5,
    marginBottom: 5,
    width: 100,
    color: '#fff',
    textAlign: 'center',
    padding: 8,
    borderRadius: 4,
  },
})
