import React, { Component } from 'react'
import { Text, View, FlatList, Alert } from 'react-native'
import AttachmentTile from '../../components/AttachmentTile'
import AppStyles from '../../AppStyles'
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import * as DocumentPicker from 'expo-document-picker';
import _ from 'underscore';
import moment from 'moment';
import AddAttachment from './addAttachment';
import axios from 'axios';
import StaticData from '../../StaticData'

class Attachments extends Component {

    newRow = [];
    constructor(props) {
        super(props);
        this.state = {
            attachmentRows: [],
            isVisible: false,
            checkValidation: false,
            title: '',
            formData: {
                size: '',
                title: '',
                fileName: '',
                uri: '',
                dateCreated: ''
            }
        }
    }

    componentDidMount() {
        const { route, navigation } = this.props;
        const { leadId } = route.params;
        axios.get(`/api/leads/comments?rcmLeadId=${leadId}`).then(response => {
            this.setState({ attachmentRows: response.data });
        }).catch(error => {
            console.log(error);
        })
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
            copyToCacheDirectory: false
        }
        DocumentPicker.getDocumentAsync(options).then(item => {
            if (item.type === 'cancel') {
                Alert.alert('Pick File', 'Please pick a file from documents!')
            }
            else {
                this.setState({ formData: { fileName: item.name, size: item.size, uri: item.uri, dateCreated: moment().format('hh:mm A, MMMM DD'), title: title } }, () => {
                })
            }

        }).catch(error => {
            console.log(error);
        })
    }

    addAttachmentToList = () => {
        const { formData } = this.state;
        this.newRow.push(formData);
        this.uploadAttachment(formData);
        this.setState({
            attachmentRows: this.newRow,
            title: '',
            formData: { fileName: '', size: '', uri: '', title: '' }
        });
    }

    uploadAttachment(data) {
        const { attachmentRows, title } = this.state;
        const { route } = this.props;
        const { leadId } = route.params;

        let fd = new FormData()
        fd.append('attachment', data);

        axios.post(`/api/leads/attachment?rcmLeadId=${leadId}&title=${title}`, fd).then(response => {
            console.log('postResponse=>', response);
        }).catch(error => {
            console.log('error=>', error.message);
        })

    }


    deleteAttachment = (item) => {
        const { attachmentRows } = this.state;
        let deletedRows = _.without(attachmentRows, item)
        this.setState({ attachmentRows: deletedRows })
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
            // console.log('call api here');
        }
    }





    render() {
        const { attachmentRows, isVisible, formData, checkValidation, title } = this.state;
        return (
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
        )
    }
}
export default Attachments;


