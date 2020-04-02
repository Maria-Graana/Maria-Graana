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

class Attachments extends Component {

    newRow = [];

    constructor(props) {
        super(props);
        this.state = {
            attachmentRows: [],
            isVisible: false,
            checkValidation: false,
            loading: true,
            title: '',
            formData: {
                size: '',
                title: '',
                fileName: '',
                uri: '',
            }
        }
    }

    componentDidMount() {
        this.getAttachmentsFromServer();
    }

    showModal = () => {
        this.setState({ isVisible: true })
    }

    closeModal = () => {
        const { isVisible } = this.state;
        this.setState({
            isVisible: !isVisible,
            title: '',
            formData: { fileName: '', size: '', uri: '', title: '' }
        });
    }

    setTitle = (title) => {
        this.setState({ title: title });
    }

    getAttachmentFromStorage = () => {
        const { title } = this.state;
        // console.log('pickDocment')
        let options = {
            type: '*/*',
            copyToCacheDirectory: true,
        }
        DocumentPicker.getDocumentAsync(options).then(item => {
            if (item.type === 'cancel') {
                Alert.alert('Pick File', 'Please pick a file from documents!')
            }
            else {
                this.setState({ formData: { fileName: item.name, size: item.size, uri: item.uri, title: title } }, () => {
                })
            }

        }).catch(error => {
            console.log(error);
        })
    }

    getAttachmentsFromServer = () => {
        const { route } = this.props;
        const { leadId } = route.params;
        axios.get(`/api/leads/comments?rcmLeadId=${leadId}&type=attachment`).then(response => {
           // console.log(response.data);
            this.setState({ attachmentRows: response.data, loading: false });
        }).catch(error => {
            console.log(error);
        })
    }

    addAttachmentToList = () => {
        const { formData } = this.state;
        this.newRow.push(formData);
        let document = {
            name: formData.fileName,
            type: 'file/' + formData.fileName.split('.').pop(),
            uri: formData.uri
        }
        this.uploadAttachment(document);
        this.setState({
            attachmentRows: this.newRow,
            title: '',
            formData: { fileName: '', size: '', uri: '', title: '' }
        });
    }

    uploadAttachment(data) {
        const { title } = this.state;
        const { route } = this.props;
        const { leadId } = route.params;
        let fd = new FormData()
        fd.append('file', data);

        axios.post(`/api/leads/attachment?rcmLeadId=${leadId}&title=${title}`, fd).then(response => {
            this.getAttachmentsFromServer();
        }).catch(error => {
            console.log('error=>', error.message);
        })
    }

    deleteAttachment = (item) => {
        const { attachmentRows } = this.state;
        this.newRow = _.without(attachmentRows, item)
        this.setState({ attachmentRows: this.newRow })
        this.deleteAttachmentFromServer(item.id);
    }

    deleteAttachmentFromServer(attachmentId) {
        axios.delete(`/api/leads/comments/remove?id=${attachmentId}`)
            .then((res) => {
               // console.log(res.status);
            })
            .catch((error) => {
                console.log('error', error.message)
            })
    }

    // ********* On form Submit Function
    formSubmit = () => {
        const { formData, title } = this.state

        // ********* Form Validation Check
        if (!title ||
            !formData.fileName
        ) {
            this.setState({
                checkValidation: true
            })
        } else {
            // ********* Call Add Attachment API here :)
            this.setState({ isVisible: false })
            this.addAttachmentToList();
        }
    }

    render() {
        const { attachmentRows, isVisible, formData, checkValidation, title, loading } = this.state;
        return (
            !loading ?
                <View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0 }]}>
                    <AddAttachmentPopup
                        isVisible={isVisible}
                        formData={formData}
                        title={title}
                        setTitle={(title) => this.setTitle(title)}
                        formSubmit={this.formSubmit}
                        checkValidation={checkValidation}
                        getAttachmentFromStorage={this.getAttachmentFromStorage}
                        closeModal={() => this.closeModal()}
                    />
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1 }}
                        data={attachmentRows}
                        renderItem={({ item }) => (
                            <AttachmentTile
                                data={item}
                                deleteAttachment={this.deleteAttachment} />
                        )}
                        ListFooterComponent={<AddAttachment onPress={this.showModal} />}
                        keyExtractor={(item, index) => index.toString()}
                    />

                </View>
                :
                <Loader loading={loading} />
        )
    }
}
export default Attachments;


