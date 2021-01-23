import React, { useState } from 'react'
import { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native'
import Modal from 'react-native-modal';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../ErrorMessage';
import TouchableButton from '../TouchableButton';

const RejectPropertyModal = ({ isVisible, showHideModal, rejectProperty }) => {
    const [reason, setReason] = useState(null);
    const [validate, checkValidation] = useState(false);
    useEffect(() => {
        if (reason === '') {
            checkValidation(true)
        }
    }, [reason])

    const rejectPropertyAndClear = () => {
        rejectProperty(reason)
        setReason(null);
    }
    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalMain}>
                <Text style={{
                    fontSize: 14,
                    fontFamily: AppStyles.fonts.semiBoldFont,
                    color: AppStyles.colors.textColor
                }}>Do you really want to reject this property? This process cannot be undone.</Text>
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput
                            onChangeText={(text) => {
                                setReason(text)
                            }}
                            placeholderTextColor={'#a8a8aa'}
                            value={reason}
                            style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                            placeholder={'Reason'}
                        />
                        {reason === '' && <ErrorMessage errorMessage={'Required*'} />}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableButton containerStyle={[styles.buttonStyle, { marginRight: 10 }]}
                            label={'NO'}
                            loading={false}
                            fontSize={16}
                            fontFamily={AppStyles.fonts.boldFont}
                            onPress={() => {
                                showHideModal(false)
                                setReason(null)
                            }} />
                        <TouchableButton containerStyle={[styles.buttonStyle]}
                            label={'YES'}
                            loading={false}
                            fontSize={16}
                            fontFamily={AppStyles.fonts.boldFont}
                            onPress={() => reason !== '' && reason !== null ?
                                rejectPropertyAndClear(reason)
                                :
                                alert('Please enter a reason to reject the property')} />
                    </View>
                </View>
            </View>

        </Modal>

    )
}

export default RejectPropertyModal

const styles = StyleSheet.create({
    modalMain: {
        backgroundColor: '#e7ecf0',
        borderRadius: 7,
        overflow: 'hidden',
        zIndex: 5,
        position: 'relative',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#33333312',
        shadowOpacity: 1,
        paddingHorizontal: 10,
        paddingTop: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    buttonStyle: {
        borderColor: '#006ff1',
        backgroundColor: '#006ff1',
        width: '30%',
        borderRadius: 4,
        borderWidth: 1,
        color: '#006ff1',
        textAlign: 'center',
        borderRadius: 4,
        marginBottom: 0,
        justifyContent: 'center',
        minHeight: 55,
    },
})
