import React from 'react'
import {
    View,
    Text,
    Modal,
    SafeAreaView,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import styles from './style'
import AppStyles from '../../AppStyles';
import DateTimePicker from '../DatePicker';
import ErrorMessage from '../ErrorMessage'
import helper from '../../helper';
import TouchableButton from '../../components/TouchableButton'

class AddViewing extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { isVisible, onPress, handleForm, openModal, checkValidation, viewing, update, loading } = this.props;
        return (
            <Modal
                visible={isVisible}
                animationType="slide"
                onRequestClose={openModal}
            >
                <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
                    <AntDesign style={styles.closeStyle} onPress={openModal} name="close" size={26} color={AppStyles.colors.textColor} />
                    <View style={[styles.viewContainer]}>
                        <DateTimePicker
                            placeholderLabel={'Select Date'}
                            name={'date'}
                            mode={'date'}
                            showError={checkValidation === true && viewing.date === ''}
                            errorMessage={'Required'}
                            iconSource={require('../../../assets/img/calendar.png')}
                            date={viewing.date ? new Date(viewing.date) : new Date()}
                            selectedValue={viewing.date ? helper.formatDate(viewing.date) : ''}
                            handleForm={(value, name) => handleForm(value, name)}
                        />
                        <DateTimePicker
                            placeholderLabel={'Select Time'}
                            name={'time'}
                            mode={'time'}
                            showError={checkValidation === true && viewing.time === ''}
                            errorMessage={'Required'}
                            iconSource={require('../../../assets/img/clock.png')}
                            date={viewing.time ? new Date(viewing.time) : new Date()}
                            selectedValue={viewing.time ? helper.formatTime(viewing.time) : ''}
                            handleForm={(value, name) => handleForm(value, name)}
                        />
                            <TouchableButton
                                containerStyle={[AppStyles.formBtn, { marginTop: 10 }]}
                                label={update ? 'UPDATE VIEWING' : 'BOOK VIEWING'}
                                onPress={onPress}
                                loading={loading}
                            />
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}

export default AddViewing

