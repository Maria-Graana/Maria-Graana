import React from 'react'
import { StyleSheet, View} from 'react-native'
import { Textarea } from 'native-base'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'

const AddTaskModal = ({ active, description, handleDescriptionChange, closeModal, addTask }) => {
    return (
        <Modal isVisible={active} onBackdropPress={()=> closeModal()}>
            <View style={[styles.modalMain]}>
                <Textarea
                    autoFocus
                    bordered
                    blurOnSubmit={true}
                    placeholderTextColor={'#a8a8aa'}
                    onSubmitEditing={() => description === null || description === '' || description === undefined ? alert('Title cannot be empty!') : addTask(description)}
                    returnKeyType={'done'}
                    style={[
                        AppStyles.formControl,
                        Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                        AppStyles.formFontSettings,
                        styles.taskBox,
                    ]}
                    rowSpan={5}
                    placeholder="Description"
                    onChangeText={(text) => handleDescriptionChange(text)}
                />

            </View>
        </Modal >
    )
}

export default AddTaskModal

const styles = StyleSheet.create({
    modalMain: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 7,
        overflow: 'hidden',
        zIndex: 5,
        position: 'relative',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#33333312',
        shadowOpacity: 1,
    },
    // timesBtn: {
    //     position: 'absolute',
    //     right: 10,
    //     top: 10,
    //     backgroundColor: '#fff',
    //     padding: 5,
    //     borderRadius: 50,
    // },
    // timesImg: {
    //     width: 10,
    //     height: 10,
    //     resizeMode: 'contain',
    // },
    taskBox: {
        borderColor: AppStyles.colors.primaryColor,
    }
})
