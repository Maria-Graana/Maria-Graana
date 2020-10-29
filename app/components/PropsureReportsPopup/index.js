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
import { Button, CheckBox } from 'native-base';
import ErrorMessage from '../ErrorMessage'
import { Divider } from 'react-native-paper';

const PropsureReportsPopup = (props) => {
    const { isVisible, closeModal, onPress, addRemoveReport, selectedReports, reports, checkValidation } = props;
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
                <AntDesign style={styles.closeStyle} onPress={closeModal} name="close" size={26} color={AppStyles.colors.textColor} />
                <FlatList data={reports}
                    style={{ marginTop: 25 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <View>
                            <View style={styles.reportRow}>
                                <CheckBox checked={selectedReports.includes(item)} style={{ marginHorizontal: 5 }}
                                    onPress={() => addRemoveReport(item)}
                                    color={AppStyles.colors.primaryColor} />
                                <Text style={styles.reportName}>{item}</Text>
                            </View>
                            <Divider />
                        </View>

                    }
                />

                <View style={[AppStyles.mainInputWrap, styles.buttonExtraStyle]}>
                    <Button
                        style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={onPress}>
                        <Text style={AppStyles.btnText}>REQUEST VERIFICATION</Text>
                    </Button>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default PropsureReportsPopup

