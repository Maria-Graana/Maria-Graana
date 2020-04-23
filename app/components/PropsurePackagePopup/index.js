import React from 'react'
import {
    View,
    Text,
    Image,
    Modal,
    SafeAreaView,
    TouchableOpacity
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import styles from './styles'
import AppStyles from '../../AppStyles';
import { Button } from 'native-base';
import ErrorMessage from '../../components/ErrorMessage'

const PropsurePackagePopup = (props) => {
    const { isVisible, closeModal, onPress, selectedPackage, packages, changePackage, checkValidation } = props;
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
                <AntDesign style={styles.closeStyle} onPress={closeModal} name="close" size={26} color={AppStyles.colors.textColor} />
                <View style={[styles.viewContainer]}>

                    {
                        packages.map((packageItem, index) => {
                            return (
                                <TouchableOpacity style={[ AppStyles.formControl, AppStyles.inputPadLeft,styles.rowStyle]} key={index} onPress={() => changePackage(packageItem.value)} activeOpacity={0.7} >
                                    <View style={AppStyles.flexDirectionRow}>
                                        {packageItem.value === selectedPackage && <Image source={require('../../../assets/img/tick.png')} style={styles.tickImageStyle} />}

                                        <Text style={styles.packageNameStyle}>
                                            {packageItem.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }

                    {
                        checkValidation === true && selectedPackage === '' && <ErrorMessage errorMessage={'Please select a package to proceed.'} />
                    }


                    <View style={[AppStyles.mainInputWrap]}>
                        <Button
                            style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={onPress}>
                            <Text style={AppStyles.btnText}>REQUEST VERIFICATION</Text>
                        </Button>
                    </View>


                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default PropsurePackagePopup

