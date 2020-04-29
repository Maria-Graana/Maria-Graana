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
import { Button } from 'native-base';
import DateComponent from '../DatePicker';
import ErrorMessage from '../ErrorMessage'

class AddViewing extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { isVisible, onPress, date, time, handleForm, openModal, checkValidation, viewing, update } = this.props;

        return (
            <Modal
                visible={isVisible}
                animationType="slide"
                onRequestClose={isVisible}
            >
                <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
                    <AntDesign style={styles.closeStyle} onPress={openModal} name="close" size={26} color={AppStyles.colors.textColor} />
                    <View style={[styles.viewContainer]}>
                        <DateComponent date={viewing.date} mode='date' placeholder='Select Date' onDateChange={(date) => handleForm(date, 'date')} />
                        {
							checkValidation === true && viewing.date === '' && <ErrorMessage errorMessage={'Required'} />
						}
                        <View style={{marginVertical: 10}}/>
                        <DateComponent date={viewing.time} mode='time' placeholder='Select Time' onTimeChange={(value) => handleForm(value, 'time')} />
                        {
							checkValidation === true && viewing.time === '' && <ErrorMessage errorMessage={'Required'} />
						}


                        <View style={[AppStyles.mainInputWrap]}>
                            <Button
                                style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={onPress}>
                                <Text style={AppStyles.btnText}>{update ? 'UPDATE VIEWING' : 'BOOK VIEWING'}</Text>
                            </Button>
                        </View>


                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}

export default AddViewing

