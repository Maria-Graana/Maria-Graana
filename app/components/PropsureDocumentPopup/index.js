import React from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    Modal,
    SafeAreaView,
    TouchableOpacity
} from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles'
import AppStyles from '../../AppStyles';
import { Button } from 'native-base';
import ErrorMessage from '../../components/ErrorMessage'

const PropsureDocumentPopup = (props) => {
    const { isVisible, closeModal, onPress, getAttachmentFromStorage,selectedFile,checkValidation } = props;
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
                <AntDesign style={styles.closeStyle} onPress={closeModal} name="close" size={26} color={AppStyles.colors.textColor} />
                <View style={[styles.viewContainer]}>

                    <View style={[AppStyles.mainInputWrap]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TouchableOpacity onPress={getAttachmentFromStorage} activeOpacity={0.7} >
                                <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, { textAlign: 'center', letterSpacing: 3, fontFamily: AppStyles.fonts.semiBoldFont }]}
                                    editable={false}
                                    placeholderTextColor={AppStyles.colors.textColor}
                                    value={selectedFile && selectedFile.name}
                                    placeholder={'UPLOAD PROPSURE REPORT'}
                                />
                                <View style={{ position: 'absolute', left: 10, top: 7 }}>
                                    <MaterialCommunityIcons name="file-upload-outline" size={32} color={AppStyles.colors.primaryColor} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            checkValidation === true && selectedFile === null && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>

                    <View style={[AppStyles.mainInputWrap]}>
                        <Button
                            style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={onPress}>
                            <Text style={AppStyles.btnText}>DONE</Text>
                        </Button>
                    </View>


                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default PropsureDocumentPopup

