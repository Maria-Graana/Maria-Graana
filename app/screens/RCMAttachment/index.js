import React, { Component } from 'react'
import { Text, View, FlatList, Alert } from 'react-native'
import AttachmentTile from '../../components/AttachmentTile'
import AppStyles from '../../AppStyles'
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import * as DocumentPicker from 'expo-document-picker';
import AddAttachment from './addAttachment';
import _ from 'underscore';
import axios from 'axios';
import { connect } from 'react-redux';
import { setRCMPayment } from '../../actions/rcmPayment';
import helper from '../../helper';


class RCMAttachment extends Component {

    attachments = [];
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            checkValidation: false,
            title: '',
            formData: { ...this.props.rcmPayment }
        }
    }

    showModal = () => {
        this.setState({ isVisible: true, checkValidation: false, formData: { title: '', fileName: '', size: '', uri: '' }, title: '' })
    }

    setValues = (value) => {
        this.props.dispatch(setRCMPayment(value));
    }

    closeModal = () => {
        const { isVisible, formData } = this.state;
        const { rcmPayment } = this.props;
        const copyFormData = { ...formData };
        copyFormData.fileName = '';
        copyFormData.size = null;
        copyFormData.uri = '';
        copyFormData.title = '';
        this.setState({
            isVisible: !isVisible,
        }, () => {
            this.setValues({ ...rcmPayment, copyFormData });
        })
    }

    componentWillUnmount() {
        this.reopenPaymentModal()
    }

    reopenPaymentModal = () => {
        const { rcmPayment, dispatch } = this.props;
        dispatch(setRCMPayment({ ...rcmPayment, visible: true }));
    }


    getAttachmentFromStorage = () => {
        const { title, formData } = this.state;
        var newFormData = { ...formData }

        let options = {
            type: '*/*',
            copyToCacheDirectory: true,
        }
        DocumentPicker.getDocumentAsync(options).then(item => {
            if (item.type === 'cancel' && newFormData.fileName === '') { // App should prompt a pop message in-case file is already selected
                Alert.alert('Pick File', 'Please pick a file from documents!')
            }
            else {
                if (item.name && item.name !== '') {
                    newFormData.fileName = item.name;
                    newFormData.size = item.size;
                    newFormData.uri = item.uri;
                    this.setState({
                        formData: newFormData,
                    })
                }
            }
        }).catch(error => {
            console.log(error);
        })
    }


    deleteAttachmentLocally = (item) => {
        const { rcmPayment } = this.props;
        let newPaymentArray = { ...rcmPayment };
        newPaymentArray = _.without(newPaymentArray.attachments, item);
        this.setValues({ ...rcmPayment, paymentAttachments: newPaymentArray })
    }

    deleteAttachmentFromServer = (item) => {
        axios.delete(`/api/leads/payment/attachment?attachmentId=${item.id}`)
            .then((res) => {
                this.deleteAttachmentLocally(item);
            })
            .catch((error) => {
                console.log('error', error.message)
            })
    }

    showDeleteDialog(item) {
        Alert.alert('Delete attachment', 'Are you sure you want to delete this attachment ?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => item.id ? this.deleteAttachmentFromServer(item) : this.deleteAttachmentLocally(item) },
        ],
            { cancelable: false })
    }


    // ********* On form Submit Function
    formSubmit = () => {
        const { formData, title } = this.state
        const { rcmPayment } = this.props;

        // ********* Form Validation Check
        if (!title ||
            !formData.fileName
        ) {
            this.setState({
                checkValidation: true
            })
        } else {
            // ********* Call Add Attachment API here :)
            var objectForAttachment = {
                fileName: '',
                uri: '',
                size: null,
                title: '',
            }
            objectForAttachment.fileName = formData.fileName;
            objectForAttachment.size = formData.size;
            objectForAttachment.uri = formData.uri;
            objectForAttachment.title = title;
            rcmPayment.paymentAttachments.push(objectForAttachment);
            var payload = {
                ...rcmPayment,
            }
            this.setState({ isVisible: false }, () => {
                this.setValues(payload);
            })

        }
    }

    render() {
        const { isVisible, formData, checkValidation, title, loading } = this.state;
        const { rcmPayment } = this.props;
        return (
            <View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0 }]}>
                <AddAttachmentPopup
                    isVisible={isVisible}
                    formData={formData}
                    title={title}
                    setTitle={(title) => this.setState({ title: title })}
                    formSubmit={this.formSubmit}
                    checkValidation={checkValidation}
                    getAttachmentFromStorage={this.getAttachmentFromStorage}
                    closeModal={() => this.closeModal()}
                />
                <FlatList
                    ref={ref => { this.flatList = ref }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                    data={rcmPayment.paymentAttachments ? rcmPayment.paymentAttachments : []}
                    renderItem={({ item }) => (
                        <AttachmentTile
                            data={item}
                            deleteAttachment={(item) => this.showDeleteDialog(item)} />
                    )}
                    ListFooterComponent={<AddAttachment onPress={this.showModal} />}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View>
        )
    }
}
mapStateToProps = (store) => {
    return {
        rcmPayment: store.RCMPayment.RCMPayment,
    }
}
export default connect(mapStateToProps)(RCMAttachment)


