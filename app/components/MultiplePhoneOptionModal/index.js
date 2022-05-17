/** @format */

import React, {  useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Linking, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'
import TouchableButton from '../TouchableButton'

import close from '../../../assets/img/times.png'
import { BottomNavigation, Divider, HelperText } from 'react-native-paper'
import phone from '../../../assets/img/phone2.png'
import whatsapp from '../../../assets/img/whatsapp-02.png'
import { connect, useDispatch } from 'react-redux'
import { getDiaryFeedbacks, setConnectFeedback } from '../../actions/diary'
import helper from '../../helper'
import diaryHelper from '../../screens/Diary/diaryHelper'

const MultiplePhoneOptionModal = ({
  isMultiPhoneModalVisible,
  showMultiPhoneModal,
  modelDataLoading,
  connectFeedback,
  contacts,
  navigation,
  selectedDiary,
}) => {

  const { contactsInformation } = connectFeedback
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(true);


  const callOnSelectedNumber = (item, calledOn, title = 'ARMS') => {
    let url = null
    if (selectedDiary) {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          calledNumber: item.number,
          calledOn,
          id: selectedDiary.id,
        })
      )
      url = calledOn === 'phone' ? 'tel:' + item.number : 'whatsapp://send?phone=' + item.number
      if (url && url != 'tel:null') {
        console.log("Can't handle url: " + url)
        if (contacts) {
          let result = helper.contacts(contactsInformation.phone, contacts)
          if (
            contactsInformation.name &&
            contactsInformation.name !== '' &&
            contactsInformation.name !== ' ' &&
            contactsInformation.phone &&
            contactsInformation.phone !== ''
          )
            if (!result) helper.addContact(contactsInformation, title)
        }
        Linking.openURL(url)
        showMultiPhoneModal(false)

        dispatch(
          getDiaryFeedbacks({
            taskType: selectedDiary.taskType,
            leadType: diaryHelper.getLeadType(selectedDiary),
            actionType: 'Connect',
          })
        )
          .then((res) => {
            navigation.navigate('DiaryFeedback', { actionType: 'Connect' })
          })
          .catch((err) => console.error('An error occurred', err))
      } else {
        helper.errorToast(`No Phone Number`)
      }
    }
  }

  return (
    <Modal isVisible={isMultiPhoneModalVisible}>
      <View style={[styles.modalMain]}>
        <View style={styles.row}>
          <Text style={styles.title}>Select Phone Number</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              showMultiPhoneModal(false), dispatch(setConnectFeedback({}))
            }}
          >
            <Image source={close} style={styles.closeImg} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{contactsInformation ? contactsInformation.name : ''}</Text>


        { !contactsInformation?.payload  ? <ActivityIndicator style={{
           alignSelf: 'center', marginBottom: 20 
        }} color={AppStyles.colors.primaryColor} size="large" /> :
          <FlatList
            data={contactsInformation ? contactsInformation.payload : []}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => callOnSelectedNumber(item, 'whatsapp')}
                  style={styles.itemRow}
                >
                  <Image style={[styles.whatsapp, { marginRight: 10 }]} source={whatsapp} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => callOnSelectedNumber(item, 'phone')}
                  style={[
                    styles.itemRow,
                    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
                  ]}
                >
                  <Image style={[styles.closeImg]} source={phone} />
                  <Text style={[styles.number]}>{item.number}</Text>
                </TouchableOpacity>
                {contactsInformation && contactsInformation.payload.length - 1 !== index && (
                  <Divider />
                )}
              </View>
            )}
          />
        }
      </View>
    </Modal>
  )
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    selectedDiary: store.diary.selectedDiary,
    connectFeedback: store.diary.connectFeedback,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(React.memo(MultiplePhoneOptionModal))

const styles = StyleSheet.create({
  modalMain: {
    //   backgroundColor:'red',
    backgroundColor: '#fff',
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    width: '10%',
  },
  closeImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  whatsapp: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: AppStyles.fontSize.medium,
  },
  itemRow: {
    marginVertical: 5,
  },
  number: {
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: AppStyles.fontSize.medium,
    padding: 10,
  },
  buttonStyle: {
    width: '100%',
    borderColor: '#006ff1',
    backgroundColor: '#006ff1',
    borderRadius: 4,
    borderWidth: 1,
    color: '#006ff1',
    textAlign: 'center',
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    minHeight: 40,
    marginVertical: 10,
  },
})
