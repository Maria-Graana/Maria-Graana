import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  noImage: {
    width: 110,
    height: 110,
    borderRadius: 5,
  },
  underLine: {
      borderLeftWidth: 1,
      borderLeftColor: '#f5f5f6',
      // marginRight: 5,
      height: 90,
      marginVertical: 20,
      padding: 10
  },
  agentText: {
    fontFamily: AppStyles.fonts.lightFont,
    fontSize: 12
  },
  labelText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 16,
    paddingBottom: 5
  },
  tileContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginVertical: 2,
    borderRadius: 5,
    height: 120,
    flexDirection: 'row'
  },
  pad5: {
    padding: 5
  },
  currencyText: {
    fontSize: 12,
    fontFamily: AppStyles.fonts.lightFont,
    padding: 1
  },
  priceText: {
    fontSize: 18,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor
  },
  marlaText: {
    fontSize: 14,
    fontFamily: AppStyles.fonts.defaultFont,
    padding: 1
  },
  addressText: {
    fontSize: 14,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.subTextColor,
    padding: 1
  },
  iconContainer: {
    flexDirection: 'row',
    paddingTop: 7
  },
  iconInner: {
    flexDirection: 'row',
    padding: 5
  },
  phoneIcon: {
    justifyContent: "flex-end",
    padding: 10,
    marginLeft: 10
  }
});