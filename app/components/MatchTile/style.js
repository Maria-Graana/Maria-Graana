import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  noImage: {
    width: 110,
    height: 110,
    borderRadius: 5,
  },
  tileContainer: { 
    flex: 1, 
    backgroundColor: 'white', 
    marginVertical: 10, 
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