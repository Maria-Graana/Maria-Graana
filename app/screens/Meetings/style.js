import { StyleSheet } from 'react-native'
export default styles = StyleSheet.create({
  meetingConteiner: {
    marginTop: 0,
    padding: 15,
    paddingBottom: 15,
  },
  openLeadHeight: {
    minHeight: '79%',
    maxHeight: '79%',
  },
  closeLeadHeight: {
    minHeight: '100%',
    maxHeight: '100%',
  },
  mainWrapCon: {
    minHeight: '100%',
  },
  paddBottom: {
    // paddingBottom: 250,
  },
  callMeetingBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    position: 'absolute',
    bottom: 70,
    right: 10,
  },
  // btnsMainWrap: {
  //   width: '50%',
  // },
  alignCenter: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  actionBtn: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    marginRight: 1,
    borderRadius: 30,
    marginRight: 10,
    elevation: -3,
    shadowOffset: { width: -1, height: -1 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  meetingLine: {
    width: '50%',
  },
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
