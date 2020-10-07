import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './style';
import times from '../../../assets/img/times.png'
import StaticData from '../../StaticData'
import Modal from 'react-native-modal';

class HistoryStatusModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            visibleStatus,
            sendStatus,
            openStatus,
        } = this.props
        let callStatus = StaticData.callStatus
        return (
            <Modal isVisible={visibleStatus}>
                <View style={[styles.dotsWrap]}>
                    <View style={[styles.dropDownMain]}>
                        <TouchableOpacity style={styles.timesBtn} onPress={() => { openStatus('') }}>
                            <Image source={times} style={styles.timesImg} />
                        </TouchableOpacity>
                        {
                            callStatus.map((item, key) => {
                                return (
                                    <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { sendStatus(item.value) }} key={key}>
                                        <Text style={styles.blueColor}>{item.name}</Text>
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

export default HistoryStatusModal;