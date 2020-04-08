import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  mainTileWrap: {
    height: 87,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#F6F6F6'
  },
  removeHeight: {
    height: 'auto'
  },
  tileInline: {
    flexDirection: 'row',
    padding: 10,
  },
  avatarMain: {
    width: '20%',
  },
  avatarImg: {
    width: 65,
    height: 65,
    borderRadius: 50
  },
  contentMain: {
    paddingTop: 10,
    width: '50%',
  },
  name: {
    fontSize: 16,
    color: '#333',
    marginBottom: 7,
  },
  position: {
    fontSize: 12,
    color: '#9E9EA1'
  },
  priceView: {
    width: '30%',
    paddingTop: 12,
    paddingLeft: 10,
  },
  targetText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1173EE'
  },
  inputTarget: {
    margin: 15,
    position: 'relative',
  },
  formControl: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ebebeb',
    paddingLeft: 10,
    borderRadius: 4,
  },
  boxShadow: {
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    borderWidth: 1,
    borderColor: '#ebebeb'
  },
  arrowIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  arrowImgWidth: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
});