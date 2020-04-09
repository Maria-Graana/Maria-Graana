import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';

export default styles = StyleSheet.create({
  mainTileWrap: {
    height: 87,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F6F6F6',
    marginRight:15,
    marginLeft:15
  },
  removeHeight: {
    height: 'auto'
  },
  tileInline: {
    flexDirection: 'row',
    padding: 10,
  },
  avatarMain: {
    justifyContent: 'center',
    width:'20%'
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
    alignItems:'flex-end'
  },
  targetText: {
    fontSize: 12,
    color: '#000',
    fontFamily:AppStyles.fonts.semiBoldFont,

  },
  priceText: {
    fontSize: AppStyles.fontSize.large,
    color: '#1173EE',
    fontFamily:AppStyles.fonts.boldFont,
  },
  inputTarget: {
    margin: 15,
    position: 'relative',
  },
  formControl: {
    height: 50,
    paddingLeft: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    zIndex: 5,
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  boxShadow: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    zIndex: 5,
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  arrowIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10,
    elevation: 10,
  },
  arrowImgWidth: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
});