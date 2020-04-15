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
    const { isVisible, closeModal, onPress, getAttachmentFromStorage, selectedFile, checkValidation } = props;
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
                <AntDesign style={styles.closeStyle} onPress={closeModal} name="close" size={26} color={AppStyles.colors.textColor} />
                <View style={[styles.viewContainer]}>
                    <TouchableOpacity onPress={getAttachmentFromStorage} activeOpacity={0.7} >
                        <View style={[AppStyles.flexDirectionRow, AppStyles.bgcWhite]}>
                            <View style={{ alignSelf: 'flex-start', marginTop: 7, marginLeft: 10, flex: 0.1 }}>
                                <MaterialCommunityIcons name="file-upload-outline" size={32} color={AppStyles.colors.primaryColor} />
                            </View>
                            <Text style={[AppStyles.formControl, {
                                marginHorizontal: 10,
                                letterSpacing: 1,
                                flex: 0.9,
                                fontFamily: AppStyles.fonts.semiBoldFont,
                                textColor: AppStyles.colors.textColor,
                                textAlignVertical:'center'
                            }]}
                                numberOfLines={2}
                            >
                                {selectedFile ? selectedFile.name : 'UPLOAD PROPSURE REPORT'}
                            </Text>
                        </View>
                        {
                            checkValidation === true && selectedFile === null && <ErrorMessage errorMessage={'Required'} />
                        }
                    </TouchableOpacity>
                </View>


                {/* <View style={[AppStyles.mainInputWrap,{marginLeft:25,marginRight:25}]}>
                    <Button
                        style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={onPress}>
                        <Text style={AppStyles.btnText}>DONE</Text>
                    </Button>
                </View> */}

            </SafeAreaView>
        </Modal>
    )
}

export default PropsureDocumentPopup

