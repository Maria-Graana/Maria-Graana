import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Button, } from 'native-base';
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'
import styles from './style'
import { formatPrice } from '../../PriceFormate';

class FirstScreenConfirmModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      firstScreenConfirmModal,
      data,
      getAllProject,
      getAllFloors,
      allUnits,
      submitFirstScreen,
      firstScreenConfirmLoading,
    } = this.props

    var project = getAllProject.find((item) => { return data.projectId === item.id && item })
    var floors = getAllFloors.find((item) => { return data.floorId === item.id && item })
    var units = allUnits.find((item) => { return data.unitId === item.id && item })

    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity style={styles.timesBtn} onPress={() => { firstScreenConfirmModal(false) }}>
            <Image source={times} style={styles.timesImg} />
          </TouchableOpacity>
          <Text style={styles.topTextMain}>Are you sure you want to book?</Text>
          <Text style={styles.noramlText}>Project: <Text style={styles.mainTextLarge}>{project && project.name}</Text></Text>
          <Text style={styles.noramlText}>Floor: <Text style={styles.mainTextLarge}>{floors && floors.name}</Text></Text>
          <Text style={styles.noramlText}>Unit: <Text style={styles.mainTextLarge}>{units && units.name}</Text></Text>
          <Text style={styles.noramlText}>Approved Discount: <Text style={styles.mainTextLarge}>{data.discount ? data.discount+'%' : 'N/A'}</Text></Text>
          <Text style={styles.noramlText}>Payment Plan: <Text style={styles.mainTextLarge}>{data.paymentPlan}</Text></Text>
          <Text style={styles.noramlText}>Final Price: <Text style={styles.mainTextLarge}>{formatPrice(data.finalPrice ? data.finalPrice : '')}</Text></Text>
          <View style={styles.confirmBtnView}>
            <TouchableOpacity style={[styles.confirmBtn]}  onPress={() => { firstScreenConfirmLoading != true && submitFirstScreen() }}> 
              <Text style={[styles.textCenter, styles.activeBtn]}>{firstScreenConfirmLoading === true ? 'Wait...' :'BOOK'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.confirmBtn]}> 
              <Text style={[styles.textCenter]} onPress={() => { firstScreenConfirmModal(false) }}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

export default FirstScreenConfirmModal;