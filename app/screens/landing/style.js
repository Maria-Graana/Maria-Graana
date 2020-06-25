import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: 50,
  },
  mainbutton: {
    borderWidth: 1,
    borderColor: '#696969',
    alignItems: 'center',
    minHeight: 150,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 28,
  },
  containerImg: {
    margin: 5,
    width: 12,
    height: 12,
    resizeMode: 'contain'
  },
  btnStyle: {
    borderColor: '#ffffff',
    marginHorizontal: 5,
    flexDirection: "row",
    borderRadius: 20,
    height: 35,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignItems: "center",
    padding: 6,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  font: {
    fontFamily: AppStyles.fonts.boldFont
  },
  btnView: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    flexDirection: "row",
    marginHorizontal: 10
  }
});