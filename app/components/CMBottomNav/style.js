import { StyleSheet } from 'react-native'
export default styles = StyleSheet.create({
  bottomNavMain: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: 15,
    paddingTop: 15,
    marginTop: 15,
    elevation: -3,
    shadowOffset: { width: -1, height: -1 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  bottomNavBtn: {
    width: '20%',
    alignItems: 'center'
  },
  bottomNavImg: {
    resizeMode: 'contain',
    width: 20,
    height: 20
  },
  bottomNavBtnText: {
    marginTop: 5,
    color: '#4E4E4E',
    fontSize: 12,
  },
});
