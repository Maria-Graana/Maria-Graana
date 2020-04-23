import { StyleSheet } from 'react-native'
export default styles = StyleSheet.create({
  mainTopTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 1,
  },
  CustomContainer: {
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: '#e7ecf0'
  },
  mainTabs: {
    width: '33.3%',
  },
  mainInventoryTile: {
    marginTop: 15,
  },
  tabBtnStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  activeTab: {
    borderBottomColor: '#5497F3'
  },
  minHeight: {
    minHeight: '85%',
  },
  // padBottom:{
  //   paddingBottom: 200,
  // },
  mainFilter: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  pickerMain: {
    width: 170,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ebebeb',
    overflow: 'hidden'
  },
  pickerStyle: {
    height: 40,
  },
  customIconStyle: {
    top: 14,
    fontSize: 15,
  },
  sortBtn: {
    flexDirection: 'row',
  },
  sortImg: {
    resizeMode: 'contain',
    width: 20,
  },
  sortText: {
    paddingTop: 10,
    marginLeft: 5,
    fontSize: 16,
    color: '#393939'
  },
  stylesMainSort: {
    marginLeft: 15,
  },
});
