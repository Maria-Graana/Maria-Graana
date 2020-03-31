import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Button } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';

class MeetingModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { openModal, active } = this.props
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <Text>Hello!</Text>
          <Button title="Hide modal" onPress={() => { openModal() }} />
        </View>
      </Modal>
    )
  }
}

export default MeetingModal;