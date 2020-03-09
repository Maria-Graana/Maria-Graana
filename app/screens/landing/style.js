import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    minHeight: '100%',
    paddingRight: 15,
    paddingLeft: 15,
  },
  buttonWrap: {
    marginBottom: 50,
  },
  mainbutton: {
    borderWidth: 1,
    borderColor:'#696969',
    alignItems: 'center',
    minHeight: 150,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '300'
  }
});