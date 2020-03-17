import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: 35,
    overflow: 'hidden',
  },
  mainbutton: {
    borderWidth: 0,
    padding: 15,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'relative',
    alignItems: 'center',
    borderRadius: 7,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 28,
    fontFamily: 'OpenSans_bold'
  },
  buttonImg: {
    width: 400,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain'
  },
});