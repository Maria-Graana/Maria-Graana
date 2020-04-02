import React from 'react'
import {
    View,
    Text,
    Modal,
    SafeAreaView,
    TextInput,
    TouchableOpacity
} from 'react-native'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import styles from './styles'
import AppStyles from '../../AppStyles';
import { Button } from 'native-base';
import ErrorMessage from '../../components/ErrorMessage'

const AddAttachmentPopup = (props) => {
    const { isVisible, closeModal, formData, checkValidation, formSubmit, getAttachmentFromStorage, title, setTitle } = props;
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
                            <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]} placeholder={'Subject/Title'} onChangeText={(text) => setTitle(text)} />
                        </View>
                        {
                            checkValidation === true && formData.title === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>

                    <View style={[AppStyles.mainInputWrap]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TouchableOpacity onPress={getAttachmentFromStorage} activeOpacity={0.7} >
                                <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, { textAlign: 'center', letterSpacing: 3, fontFamily: AppStyles.fonts.semiBoldFont }]}
                                    editable={false}
                                    placeholderTextColor={AppStyles.colors.textColor}
                                    value={formData.fileName}
                                    placeholder={'UPLOAD ATTACHMENT'}
                                />
                                <View style={{ position: 'absolute', left: 10, top: 7 }}>
                                    <MaterialCommunityIcons name="file-upload-outline" size={32} color={AppStyles.colors.primaryColor} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            checkValidation === true && formData.fileName === '' && <ErrorMessage errorMessage={'Required'} />
                        }



                    </View>


                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap]}>
                        <Button
                            style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={formSubmit}>
                            <Text style={AppStyles.btnText}>DONE</Text>
                        </Button>
                    </View>


                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default AddAttachmentPopup

