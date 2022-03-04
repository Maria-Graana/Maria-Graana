/** @format */

import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import styles from './style'
import Modal from 'react-native-modal'
import { AntDesign } from '@expo/vector-icons'
import { connect } from 'react-redux'

const ClosedWonModel = ({ visible, closeWonModel, checkCloseWon }) => {
  return (
    <Modal isVisible={visible}>
      <View style={styles.modalMain}>
        <View style={styles.mainTextWrap}>
          <View style={styles.titleView}>
            <AntDesign name="warning" size={30} color="red" />
            <Text style={styles.topTextMain}> Unable to close this lead</Text>
          </View>
          {checkCloseWon.paymentEr !== '' && <Text style={styles.largeText}>Payments:</Text>}
          <Text style={styles.smallText}>{checkCloseWon.paymentEr} </Text>
          {checkCloseWon.documentEr !== '' && (
            <Text style={styles.largeText}>Legal Documents :</Text>
          )}
          <Text style={styles.smallText}>{checkCloseWon.documentEr} </Text>
          <View>
            <TouchableOpacity
              onPress={() => {
                closeWonModel()
              }}
            >
              <View style={styles.confirmBtnInnerView}>
                <Text style={[styles.textCenter]}>OK</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
mapStateToProps = (store) => {
  return {
    lead: store.lead.lead,
    permissions: store.user.permissions,
  }
}
export default connect(mapStateToProps)(ClosedWonModel)
