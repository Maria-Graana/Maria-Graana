/** @format */

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'
import TouchableButton from '../TouchableButton'
import close from '../../../assets/img/times.png'
import { Divider } from 'react-native-paper'
import phone from '../../../assets/img/phone2.png'

const MultiplePhoneOptionModal = ({
  isMultiPhoneModalVisible,
  showMultiPhoneModal,
  contacts,
  handlePhoneSelectDone,
}) => {
  return (
    <Modal isVisible={isMultiPhoneModalVisible}>
      <View style={[styles.modalMain]}>
        <View style={styles.row}>
          <Text style={styles.title}>Select Phone Number</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={() => showMultiPhoneModal(false)}>
            <Image source={close} style={styles.closeImg} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={contacts}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handlePhoneSelectDone(item)} style={styles.itemRow}>
              <View style={styles.row}>
                <Image style={[styles.closeImg]} source={phone} />
                <Text style={[styles.number]}>{item.number}</Text>
              </View>
              {contacts.length - 1 !== index && <Divider />}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  )
}

export default MultiplePhoneOptionModal

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
    padding: 5,
    borderRadius: 50,
    width: '10%',
  },
  closeImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
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
