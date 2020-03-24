import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: 35,
  },
  mainbutton: {
    borderWidth: 0,
    zIndex:5,
    elevation:5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    padding: 15,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'relative',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 28,
    fontFamily: AppStyles.fonts.boldFont,
  },
  buttonImg: {
    width: 400,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain'
  },
});