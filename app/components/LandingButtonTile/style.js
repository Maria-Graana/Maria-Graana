import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: 25,
    overflow: 'hidden',
  },
  mainbutton: {
    borderWidth: 1,
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
    fontWeight: '300',
  },
  buttonImg: {
    width: 400,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  badegesWrap: {
    position: 'absolute',
    right: 15,
    top: 15,
    borderWidth: 1,
    borderColor: '#0f73ee',
    borderRadius: 10,
    fontSize: 12,
    color: '#0f73ee',
    padding: 2,
    width: 40,
    textAlign: 'center'
  },
});