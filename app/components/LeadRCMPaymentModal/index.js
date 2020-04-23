import React from 'react'
import {
    View,
    Text,
    Image,
    Modal,
    SafeAreaView,
    TouchableOpacity,
    FlatList
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import styles from './styles'
import AppStyles from '../../AppStyles';
import { Button } from 'native-base';
import ErrorMessage from '../../components/ErrorMessage'
import RadioButton from '../../components/RadioButton'

const LeadRCMPaymentModal = (props) => {
    const { isVisible, closeModal, onPress, selectedReason, reasons, changeReason, checkReasonValidation, commisionPayment } = props;

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'space-around', backgroundColor: '#e7ecf0' }]}>
                <AntDesign style={styles.closeStyle} onPress={closeModal} name="close" size={26} color={AppStyles.colors.textColor} />
                <View style={styles.viewContainer}>
                    {
                        <FlatList
                            data={reasons}
                            scrollEnabled={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }} onPress={() => changeReason(item.value)}>
                                    <View style={[styles.outerCircle]}>
                                        {
                                            item.value === selectedReason ?
                                                <View style={styles.innerCircle} />
                                                : null
                                        }
                                    </View>
                                    <Text style={{ paddingLeft: 10 }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.underLine} />}
                        />
                    }

                </View>


                {
                    checkReasonValidation === true && selectedReason === '' && <ErrorMessage errorMessage={'Please select a reason to proceed.'} />
                }

                <View style={[AppStyles.mainInputWrap]}>
                    <Button
                        style={[AppStyles.formBtn, { marginTop: 10, marginHorizontal: 25 }]} onPress={onPress}>
                        <Text style={AppStyles.btnText}>CLOSE LEAD</Text>
                    </Button>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default LeadRCMPaymentModal

