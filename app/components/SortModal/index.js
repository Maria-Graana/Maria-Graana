import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native'
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
      <Modal isVisible={doneStatus}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => { openStatus('') }}>
            <View style={{ flex: 1, backgroundColor: '#3f3f3f' }} />
          </TouchableWithoutFeedback>
        }
      >
        <View style={[styles.dotsWrap]}>
          <View style={[styles.dropDownMain]}>
            {/* <TouchableOpacity style={styles.timesBtn} onPress={() => { openStatus('') }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity> */}
            {
              data.map((item, key) => {
                return (

                  <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { sendStatus(item.value) }} key={key}>
                    <View style={AppStyles.flexDirectionRow}>
                      <Text style={[styles.textStyle, sort === item.value && styles.textColorBlue]}>
                        {item.name}
                      </Text>
                      {sort === item.value && <Image source={require('../../../assets/img/tick.png')} style={styles.tickImageStyle} />}
                    </View>
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