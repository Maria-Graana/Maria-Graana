import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import DateComponent from '../../components/DatePicker'
import times from '../../../assets/img/times.png'
import ErrorMessage from '../../components/ErrorMessage'

class SortModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      doneStatus,
      sendStatus,
      openStatus,
      data,
      sort,
    } = this.props
    return (
      <Modal isVisible={doneStatus}>
        <View style={[styles.dotsWrap]}>
          <View style={[styles.dropDownMain]}>
            <TouchableOpacity style={styles.timesBtn} onPress={() => { openStatus('') }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
            {
              data.map((item, key) => {
                return (
                  <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { sendStatus(item.value) }} key={key}>
                    <Text style={styles.blueColor}>{item.name} {sort === item.value && '(active Filter)'}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>
      </Modal>
    )
  }
}

export default SortModal;