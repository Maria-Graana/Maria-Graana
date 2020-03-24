import { StyleSheet } from 'react-native'
export default styles = StyleSheet.create({
  mainInventoryTile: {
    paddingTop: 15,
  },
  filterMainWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 15,
    minHeight: 20,
    backgroundColor: '#fff',
  },
  borderRightFilter: {
    borderRightWidth: 1,
    borderColor: '#ddd',
    width: '35%'
  },
  InputWrapSearch: {
    width: '65%'
  },
  inputFilterStyle: {
    minHeight: 40,
    paddingLeft: 10,
    fontSize: 16,
  },
  inputFilterselect: {
  },
  searchIcon:{
    position: 'absolute',
    right: 10,
    top: 9,
  },
  mainDropFeb: {
    position: 'absolute',
    bottom: '110%',
    backgroundColor: '#fff',
    padding: 25,
    width: 150,
    right:0,
    borderRadius: 5,
    zIndex:5,
    elevation:5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#3333333b',
    shadowOpacity: 1,
  }
});