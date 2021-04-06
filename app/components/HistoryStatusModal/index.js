import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, FlatList } from 'react-native';
import styles from './style';
import times from '../../../assets/img/times.png'
import StaticData from '../../StaticData'
import AppStyles from '../../AppStyles';

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
            <Modal visible={visibleStatus}>
                <View style={[AppStyles.mb1, styles.dropDownMain]}>
                    <TouchableOpacity style={styles.timesBtn} onPress={() => { openStatus('') }}>
                        <Image source={times} style={styles.timesImg} />
                    </TouchableOpacity>
                    <FlatList
                        data={callStatus}
                        renderItem={({ item }) =>
                            <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { sendStatus(item.value) }}>
                                <Text style={styles.blueColor}>{item.name}</Text>
                            </TouchableOpacity>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </Modal>
        )
    }
}

export default HistoryStatusModal;