import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import styles from './style'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'
import moment from 'moment'

class RemarksDetailsForPayment extends React.Component {
  constructor(props) {
    super(props)
  }

  handleEmptyValue = (value) => {
    return value != null && value != '' ? value : ''
  }

  render() {
    const {
      active,
      data,
      goToRemarks,
      remarksPaymentLoading,
    } = this.props
    return (
      <Modal isVisible={active}>

        <View style={[styles.modalMain]}>
          <TouchableOpacity style={styles.timesBtn} onPress={() => { goToRemarks(false) }}>
            <Image source={times} style={styles.timesImg} />
          </TouchableOpacity>
          {
            remarksPaymentLoading === false ?
              <ScrollView>
                {
                  data && data.length && data.map((item, index) => {
                    return (
                      <View style={[styles.MainTileView, index === 0 ? styles.noBorder : null]}>
                        <View>
                          <Text style={[styles.smallText]}>{item.armsuser.firstName} {item.armsuser.lastName} <Text style={styles.smallestText}> ({moment(item.createdAt).format('hh:mm A, MMM DD YY')})</Text></Text>
                          <Text style={styles.largeText}>{this.handleEmptyValue(item.remarks)}</Text>
                        </View>
                      </View>
                    )
                  })
                }
              </ScrollView>
              : <Text>Fetching Data...</Text>
          }
        </View>


      </Modal>
    )
  }
}

export default RemarksDetailsForPayment;