import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'

class UnitDetailsModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      openUnitDetailsModal,
    } = this.props

    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity style={styles.timesBtn} onPress={() => { openUnitDetailsModal(false) }}>
            <Image source={times} style={styles.timesImg} />
          </TouchableOpacity>
          <View style={styles.MainTileView}>
            <View>
              <Text style={styles.smallText}>Unit ID</Text>
              <Text style={styles.largeText}>10-3445-05</Text>
            </View>
          </View>
          {/* ===================== */}
          <View style={styles.MainTileView}>
            <View>
              <Text style={styles.smallText}>Unit ID</Text>
              <Text style={styles.largeText}>10-3445-05</Text>
            </View>
          </View>
          {/* ===================== */}
          <View style={styles.MainTileView}>
            <View>
              <Text style={styles.smallText}>Unit ID</Text>
              <Text style={styles.largeText}>10-3445-05</Text>
            </View>
          </View>
          {/* ===================== */}
          <View style={styles.MainTileView}>
            <View>
              <Text style={styles.smallText}>Unit ID</Text>
              <Text style={styles.largeText}>10-3445-05</Text>
            </View>
          </View>
          {/* ===================== */}
          <View style={styles.MainTileView}>
            <View>
              <Text style={styles.smallText}>Unit ID</Text>
              <Text style={styles.largeText}>10-3445-05</Text>
            </View>
          </View>
          {/* ===================== */}
        </View>
      </Modal>
    )
  }
}

export default UnitDetailsModal;