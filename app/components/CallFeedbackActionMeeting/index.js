import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native'
import TouchableButton from '../TouchableButton'
import times from '../../../assets/img/times.png'

const CallFeedbackActionMeeting = ({isFeedbackMeetingModalVisible, performMeetingAction, showFeedbackMeetingModal}) => {
    return (
        <Modal visible={isFeedbackMeetingModalVisible}>
            <SafeAreaView style={[styles.modalMain]}>
                <TouchableOpacity
                    style={styles.timesBtn}
                    onPress={() => {
                        showFeedbackMeetingModal(false)
                    }}
                >
                    <Image source={times} style={styles.timesImg} />
                </TouchableOpacity>

                <View style={styles.rowVertical}>
                    <TouchableButton
                        label={'Book Unit'}
                        loading={false}
                        onPress={() => {
                          performMeetingAction('book unit');
                        }}
                        containerStyle={styles.button}
                    />

                    <TouchableButton
                        label={'Setup Another Meeting'}
                        loading={false}
                        onPress={() => {
                             performMeetingAction('setup another meeting');
                        }}
                        containerStyle={styles.button}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default CallFeedbackActionMeeting

const styles = StyleSheet.create({
    modalMain: {
        flex:1,
        backgroundColor: '#E8EDF0',
        borderRadius: 10,
        padding: 15,
        position: 'relative',
        justifyContent:'center',
      },
      timesBtn: {
        position: 'absolute',
        right: 15,
        top: 50,
      },
      timesImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
      },
      rowVertical: {
        justifyContent: 'center',
        alignItems:'center',
        marginVertical: 5,
        width: '100%'
      },
      button: {
        padding: 10, 
        borderRadius: 4,
        width: '70%',
        alignSelf:'center',
        margin: 10,
      }
})
