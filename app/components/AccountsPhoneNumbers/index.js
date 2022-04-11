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
  TouchableHighlight,
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
  mode = 'phone',
  loading,
  phoneContacts,
}) => {
  const displayName = (data) => {
    if (data) {
      return data.firstName + ' ' + data.lastName
    } else {
      return '- - -'
    }
  }
  const callPayload = (data) => {
    let name = displayName(data)
    let newContact = {
      phone: data.phoneNumber,
      name: name !== '- - -' ? name : '',
      url: `tel:${data.phoneNumber}`,
      payload: [
        {
          label: 'mobile',
          number: data.phoneNumber,
        },
      ],
    }
    helper.callNumber(
      newContact,
      phoneContacts,
      data.role === 'accounts_hq' ? 'Accounts HQ' : 'Accounts'
    )
  }
  return (
    <Modal isVisible={isMultiPhoneModalVisible}>
      <SafeAreaView>
        {contacts && contacts.length ? (
          <View style={[styles.modalMain]}>
            <View style={styles.row}>
              <Text style={styles.title}>Contact Accounts Team</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => toggleAccountPhone(false)}>
                <Image source={close} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={contacts}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <TouchableHighlight
                  underlayColor={AppStyles.colors.backgroundColor}
                  onPress={() => callPayload(item)}
                  style={styles.itemRow}
                >
                  <View>
                    <Text style={[styles.number]}>
                      {item.firstName} {item.lastName} (
                      {helper.capitalize(item.role).replace('_', ' ')})
                    </Text>
                    <View style={styles.row}>
                      <Image
                        style={[styles.closeImg]}
                        source={mode === 'phone' ? phone : whatsapp}
                      />
                      <Text style={[styles.number]}>{item.phoneNumber}</Text>
                    </View>
                    {contacts.length - 1 !== index && <Divider />}
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        ) : (
          <View
            style={
              ([styles.modalMain],
              { height: '75%', backgroundColor: '#FFF', marginTop: '20%', borderRadius: 7 })
            }
          >
            <View style={{ justifyContent: 'flex-end', paddingTop: 10, paddingRight: 10 }}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => toggleAccountPhone(false)}>
                <Image source={close} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
            <Loader loading={loading} />
          </View>
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
