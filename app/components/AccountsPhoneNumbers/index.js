/** @format */

import React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Linking,
} from 'react-native'
import Modal from 'react-native-modal'
import { Divider } from 'react-native-paper'
import phone from '../../../assets/img/phone2.png'
import close from '../../../assets/img/times.png'
import whatsapp from '../../../assets/img/whatsapp-02.png'
import AppStyles from '../../AppStyles'
import Loader from '../loader'
import helper from '../../helper'

const AccountsPhoneNumbers = ({
  isMultiPhoneModalVisible,
  toggleAccountPhone,
  contacts,
  handlePhoneSelectDone,
  mode = 'phone',
  loading,
}) => {
  call = (data) => {
    let url = `tel:${data.phoneNumber}`
    if (url && url != 'tel:null') {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            helper.errorToast(`No application available to dial phone number`)
            console.log("Can't handle url: " + url)
          } else {
            return Linking.openURL(url)
          }
        })
        .catch((err) => console.error('An error occurred', err))
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  return (
    <Modal isVisible={isMultiPhoneModalVisible}>
      <SafeAreaView>
        {contacts && contacts.length ? (
          <View style={[styles.modalMain]}>
            <View style={styles.row}>
              <Text style={styles.title}>Select Phone Number</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => toggleAccountPhone(false)}>
                <Image source={close} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={contacts}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => call(item)} style={styles.itemRow}>
                  <Text style={[styles.number]}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <View style={styles.row}>
                    <Image style={[styles.closeImg]} source={mode === 'phone' ? phone : whatsapp} />
                    <Text style={[styles.number]}>{item.phoneNumber}</Text>
                  </View>
                  {contacts.length - 1 !== index && <Divider />}
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <Loader loading={loading} />
        )}
      </SafeAreaView>
    </Modal>
  )
}

export default AccountsPhoneNumbers

const styles = StyleSheet.create({
  modalMain: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: AppStyles.fontSize.large,
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
