import React from 'react'
import {
    View,
    Text,
    Modal,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles'
import AppStyles from '../../AppStyles';
import { Button } from 'native-base';
import ErrorMessage from '../../components/ErrorMessage'


const PropsureDocumentPopup = (props) => {
    const { isVisible, closeModal, onPress, pendingPropsures, getAttachmentFromStorage, uploadReport } = props;
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
                <AntDesign style={styles.closeStyle} onPress={closeModal} name="close" size={26} color={AppStyles.colors.textColor} />
                <FlatList data={pendingPropsures}
                    style={{ marginTop: 35 }}
                    renderItem={({ item }) =>
                        <View style={[styles.viewContainer]}>
                            <TouchableOpacity
                                onPress={() => getAttachmentFromStorage(item.id)}
                                activeOpacity={0.7} >
                                <View style={[AppStyles.flexDirectionRow, AppStyles.bgcWhite]}>
                                    <View style={{
                                        alignSelf: 'center',
                                        marginLeft: 10,
                                        flex: 0.1
                                    }}>
                                        <MaterialCommunityIcons
                                            name="file-upload-outline"
                                            size={32}
                                            color={AppStyles.colors.primaryColor} />
                                    </View>
                                    <View style={[{
                                        backgroundColor: '#fff',
                                        borderRadius: 4,
                                        borderWidth: 0,
                                        height: 50,
                                        marginHorizontal: 10,
                                        flex: 0.7,
                                        justifyContent: 'center'
                                    }]}>

                                        <Text style={[{
                                            letterSpacing: 1,
                                            fontFamily: AppStyles.fonts.semiBoldFont,
                                            color: AppStyles.colors.textColor,
                                        }]}
                                            numberOfLines={2}
                                        >
                                            {
                                                item.propsureDocs.length > 0 ? item.propsureDocs[0].name ? item.propsureDocs[0].name : item.propsureDocs[0].fileName : `Upload ${item.package}`
                                            }
                                        </Text>
                                    </View>
                                    {
                                        item.status === 'pending' ?
                                            <TouchableOpacity
                                                onPress={() => item.propsureDocs.length > 0 ?
                                                    uploadReport(item.propsureDocs[0], item.id)
                                                    : Alert.alert('Pick File', 'Please pick a file from documents!')}
                                                style={{
                                                    flex: 0.2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: AppStyles.colors.primaryColor
                                                }}>
                                                <MaterialCommunityIcons
                                                    name="check"
                                                    size={32}
                                                    color={AppStyles.bgcWhite.backgroundColor} />
                                            </TouchableOpacity>
                                            : null
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    keyExtractor={(item) => item.id.toString()}
                />
                {/* {
                        checkValidation === true && selectedFile === null && <ErrorMessage errorMessage={'Required'} />
                    } */}

                <View style={[AppStyles.mainInputWrap, { marginLeft: 25, marginRight: 25 }]}>
                    <Button
                        style={[AppStyles.formBtn, { marginVertical: 10 }]} onPress={onPress}>
                        <Text style={AppStyles.btnText}>DONE</Text>
                    </Button>
                </View>

            </SafeAreaView>
        </Modal>
    )
}

export default PropsureDocumentPopup

