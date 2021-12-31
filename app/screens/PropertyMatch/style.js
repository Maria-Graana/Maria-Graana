/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  unselectedLabelBtn: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    backgroundColor: '#fff',
    margin: 10,
    flex: 1,
  },
  labelBtn: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: AppStyles.colors.primaryColor,
    borderRadius: 20,
    backgroundColor: AppStyles.colors.primaryColor,
    margin: 10,
    flex: 1,
  },
  tokenLabel: {
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
    alignSelf: 'center',
  },
  tokenLabelBlue: {
    color: '#fff',
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
    alignSelf: 'center',
  },
  headingText: {
    fontSize: 16,
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 0,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  padLeft: {
    marginRight: 15,
    paddingBottom: 2,
  },
  labelText: {
    fontSize: 20,
    paddingBottom: 5,
    paddingLeft: 5,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  btn1: {
    marginBottom: 40,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 15,
    marginBottom: 20,
    flexDirection: 'row',
  },
  innerContainer: {
    flex: 1,
    padding: 10,
  },
  pad: {
    padding: 10,
  },
  underLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#f5f5f6',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  continueBtn: {
    flex: 1,
    position: 'absolute',
    top: 300,
  },
  checkBoxView: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 10,
    elevation: 10,
    zIndex: 10,
    backgroundColor: AppStyles.colors.backgroundColor,
    shadowColor: 'lightgrey',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2,
    shadowRadius: 15,
    elevation: 10,
  },
})
