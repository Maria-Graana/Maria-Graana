/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import Modal from 'react-native-modal'
import times from '../../../assets/img/times.png'
import StaticData from '../../StaticData'
import SimpleInputText from '../../components/SimpleInputField'

class GraanaPropertiesStatusModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      data,
      graanaVerifeyModal,
      submitStatus,
      forStatusPrice,
      handleForm,
      submitGraanaStatusAmount,
      formData,
    } = this.props

    var statusForProperties = []
    if (data && data.purpose === 'rent') {
      statusForProperties = StaticData.graanaPropertiesStatusForRent
    } else {
      statusForProperties = StaticData.graanaPropertiesStatusForSale
    }

    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          {
            <View style={styles.topHeader}>
              <Text style={styles.headingText}>Select Status</Text>
              <TouchableOpacity
                style={styles.timesBtn}
                onPress={() => {
                  graanaVerifeyModal(false)
                }}
              >
                <Image source={times} style={styles.timesImg} />
              </TouchableOpacity>
            </View>
          }

          <View style={styles.MainTileView}>
            {statusForProperties &&
              statusForProperties.length &&
              statusForProperties.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index.toString()}
                    style={styles.statusButtons}
                    onPress={() => {
                      submitStatus(data, item.value)
                    }}
                  >
                    <Text style={styles.statusBtnText}>{item.label}</Text>
                  </TouchableOpacity>
                )
              })}

            {forStatusPrice === true && (
              <View style={styles.mainFormView}>
                <SimpleInputText
                  name={'amount'}
                  placeholder={statusForProperties[1].label}
                  label={
                    statusForProperties[1].label === 'Sold'
                      ? 'SOLD AMOUNT (Required)'
                      : 'RENT AMOUNT (Required)'
                  }
                  value={formData.amount}
                  keyboardType={'numeric'}
                  onChangeHandle={handleForm}
                  formatValue={formData.amount}
                  editable={true}
                  fromatName={false}
                />

                {formData.amount != '' && (
                  <TouchableOpacity
                    style={styles.statusButtons}
                    onPress={() => {
                      submitGraanaStatusAmount('amount')
                    }}
                  >
                    <Text style={styles.statusBtnText}>SUBMIT AMOUNT</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    )
  }
}

export default GraanaPropertiesStatusModal
