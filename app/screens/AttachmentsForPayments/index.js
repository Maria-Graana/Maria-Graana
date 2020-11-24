import React, { Component } from 'react'
import { Text, View, FlatList, Alert } from 'react-native'
import AttachmentTile from '../../components/AttachmentTile'
import AppStyles from '../../AppStyles'
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import * as DocumentPicker from 'expo-document-picker';
import _ from 'underscore';
import AddAttachment from './addAttachment';
import axios from 'axios';
import Loader from '../../components/loader'
import { connect } from 'react-redux';
import { setCMPaymennt } from '../../actions/addCMPayment';


class AttachmentsForPayments extends Component {

    attachments = [];
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            checkValidation: false,
            title: '',
            formData: { ...this.props.CMPayment }
        }
    }

    componentDidMount() {
        //this.getAttachmentsFromServer();
    }

    showModal = () => {
        const { formData } = this.state;
        this.setState({ isVisible: true, checkValidation: false, formData: { title: '', fileName: '', size: '', uri: '' }, title: '' })
    }

    setValues = (value) => {
        this.props.dispatch(setCMPaymennt(value));
    }

    closeModal = () => {
        const { isVisible, formData } = this.state;
        const { CMPayment } = this.props;
        const copyFormData = { ...formData };
        copyFormData.fileName = '';
        copyFormData.size = null;
        copyFormData.uri = '';
        copyFormData.title = '';
        this.setState({
            isVisible: !isVisible,
        }, () => {
            this.setValues({ ...CMPayment, copyFormData });
        })
    }

    getAttachmentFromStorage = () => {
        const { title, formData } = this.state;
        var newFormData = { ...formData }

        let options = {
            type: '*/*',
            copyToCacheDirectory: true,
        }
        DocumentPicker.getDocumentAsync(options).then(item => {
            if (item.type === 'cancel' && formData.fileName === '') {
                Alert.alert('Pick File', 'Please pick a file from documents!')
            }
            else {
                if(item.name && item.name!==''){
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
        const { CMPayment } = this.props;
        let newPaymentArray = { ...CMPayment };
        newPaymentArray = _.without(newPaymentArray.attachments, item);
        this.setValues({ ...CMPayment, attachments: newPaymentArray })
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
        const { CMPayment } = this.props;

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
            CMPayment.attachments.push(objectForAttachment);
            var payload = {
                ...CMPayment,
            }
            this.setState({ isVisible: false }, () => {
                this.setValues(payload);
            })

        }
    }

    render() {
        const { isVisible, formData, checkValidation, title, loading } = this.state;
        const { CMPayment } = this.props;
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
                    data={CMPayment.attachments ? CMPayment.attachments : []}
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
        CMPayment: store.CMPayment.CMPayment,
    }
}
export default connect(mapStateToProps)(AttachmentsForPayments)


