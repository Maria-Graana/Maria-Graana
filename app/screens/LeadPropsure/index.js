import * as React from 'react';
import styles from './styles'
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import axios from 'axios';
import Loader from '../../components/loader';
import PropsurePackagePopup from '../../components/PropsurePackagePopup/index'
import PropsureDocumentPopup from '../../components/PropsureDocumentPopup/index'
import _ from 'underscore';
import StaticData from '../../StaticData';
import { FAB } from 'react-native-paper';
import { ProgressBar, Colors } from 'react-native-paper';

class LeadPropsure extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            open:false,
            isVisible: false,
            documentModalVisible: false,
            checkValidation: false,
            checkPackageValidation: false,
            selectedPackage: '',
            packages: StaticData.propsurePackages,
            selectedPropertyId: null,
            selectedPropsureId: null,
            matchData: [],
            file: null,
        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchProperties()
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchProperties = () => {
        const { lead } = this.props
        this.setState({ loading: true }, () => {
            axios.get(`/api/leads/${lead.id}/shortlist`)
                .then((res) => {
                    //console.log(res.data.rows);
                    this.setState({
                        loading: false,
                        matchData: res.data.rows,
                        selectedPropertyId: null,
                        selctedPropsureId: null,
                        selectedPackage: ''
                    })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({
                        loading: false,
                        selectedPropertyId: null,
                        selctedPropsureId: null,
                        selectedPackage: ''
                    })
                })
        })

    }

    displayChecks = () => { }

    addProperty = () => { }

    ownProperty = (property) => {
        const { user } = this.props
        if ('armsuser' in property && property.armsuser) {
            return user.id === property.armsuser.id
        } else if ('user' in property && property.user) {
            return user.id === property.user.id
        } else {
            return false
        }
    }

    closeModal = () => {
        this.setState({ isVisible: false })
    }

    showPackageModal = (propertyId) => {
        this.setState({ isVisible: true, selectedPropertyId: propertyId, checkPackageValidation: false });
    }


    onHandleRequestVerification = () => {
        const { lead } = this.props
        const { selectedPackage, selectedPropertyId } = this.state;

        if (selectedPackage === '') {
            this.setState({
                checkPackageValidation: true
            })
        } else {
            // ********* Call Add Attachment API here :)
            this.closeModal();
            const body = {
                packageName: selectedPackage,
                propertyId: selectedPropertyId
            }

            axios.post(`api/leads/propsure/${lead.id}`, body).then(response => {
                this.fetchProperties();
            }).catch(error => {
                console.log(error);
                this.setState({ selectedPropertyId: null, selectedPackage: '' });
            })

        }

    }

    handlePackageChange = (value) => {
        this.setState({ selectedPackage: value });
    }

    showDocumentModal = (propsureId) => {
        this.setState({ documentModalVisible: true, selectedPropsureId: propsureId, checkValidation: false });
    }

    closeDocumentModal = () => {
        this.setState({ documentModalVisible: false, file: null })
    }

    getAttachmentFromStorage = () => {
        let options = {
            type: '*/*',
            copyToCacheDirectory: true,
        }
        DocumentPicker.getDocumentAsync(options).then(item => {
            if (item.type === 'cancel') {
                Alert.alert('Pick File', 'Please pick a file from documents!')
            }
            else {
                this.setState({ file: item });
            }

        }).catch(error => {
            console.log(error);
        })
    }

    handleDocumentModalDone = () => {
        const { file } = this.state
        // ********* Form Validation Check
        if (file === null) {
            this.setState({
                checkValidation: true
            })
        } else {
            // ********* Call Add Attachment API here :)
            this.setState({ documentModalVisible: false })
            let document = {
                name: file.name,
                type: 'file/' + file.name.split('.').pop(),
                uri: file.uri
            }
            this.uploadAttachment(document);
            this.setState({
                file: null
            });
        }
    }

    uploadAttachment(data) {
        const { selectedPropsureId } = this.state;

        let fd = new FormData()
        fd.append('file', data);
        axios.post(`api/leads/propsureDoc?id=${selectedPropsureId}`, fd).then(response => {
            this.fetchProperties();
        }).catch(error => {
            console.log('error=>', error.message);
        })
    }

    renderPropsureVerificationView = (item) => {
        return (
            <TouchableOpacity key={item.id.toString()} onPress={() => this.showPackageModal(item.id)}
                style={[styles.viewButtonStyle,{backgroundColor:AppStyles.bgcWhite.backgroundColor}]} activeOpacity={0.7}>
                <Text style={styles.propsureVerificationTextStyle}>
                    PROPSURE VERIFICATION
                </Text>
            </TouchableOpacity>
        )
    }

    renderPropsurePendingView = (item) => {
        return item.propsures.map(propsure => {
            return (
                <TouchableOpacity key={item.id.toString()} onPress={propsure.status === 'pending' ? () => this.showDocumentModal(propsure.id) : null}
                    style={[styles.viewButtonStyle, { backgroundColor: propsure.status === 'pending' ? '#FCD12A' : AppStyles.colors.primaryColor }]} activeOpacity={0.7}>
                    <Text style={[styles.propsureVerificationTextStyle, { color: '#fff' }]}>
                        {
                            propsure.status === 'pending' ?
                                'PENDING VERIFICATION' :
                                'VERIFIED'
                        }
                    </Text>
                </TouchableOpacity>
            )
        });
    }

    goToDiaryForm = () => {
        const { lead, navigation } = this.props
        navigation.navigate('AddDiary', {
            update: false,
            leadId: lead.id
        });
    }

    goToAttachments = () => {
        const { lead, navigation } = this.props
        navigation.navigate('Attachments', { leadId: lead.id });
    }

    goToComments = () => {
        const { lead, navigation } = this.props
        navigation.navigate('Comments', { leadId: lead.id });
    }

    render() {
        const { loading, matchData, user, isVisible, packages, selectedPackage, documentModalVisible, file, checkValidation, checkPackageValidation,open } = this.state;
        return (
            !loading ?
                <View style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0 }]}>
                    <ProgressBar progress={0.8} color={'#0277FD'} />
                    <PropsurePackagePopup
                        packages={packages}
                        selectedPackage={selectedPackage}
                        changePackage={this.handlePackageChange}
                        checkValidation={checkPackageValidation}
                        isVisible={isVisible}
                        closeModal={() => this.closeModal()}
                        onPress={this.onHandleRequestVerification}
                    />
                    <PropsureDocumentPopup
                        isVisible={documentModalVisible}
                        closeModal={() => this.closeDocumentModal()}
                        onPress={this.handleDocumentModalDone}
                        getAttachmentFromStorage={this.getAttachmentFromStorage}
                        selectedFile={file}
                        checkValidation={checkValidation}
                    />
                    <View style={{ flex: 1 }}>
                        {
                            matchData.length ?
                                <FlatList
                                    data={matchData}
                                    renderItem={(item, index) => (
                                        <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                                            {
                                                this.ownProperty(item.item) ?
                                                    <MatchTile
                                                        data={item.item}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={false}
                                                        addProperty={this.addProperty}
                                                    />
                                                    :
                                                    <AgentTile
                                                        data={item.item}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={false}
                                                        addProperty={this.addProperty}
                                                    />
                                            }
                                            <View>
                                                {
                                                    item.item.propsures.length === 0 ?
                                                        this.renderPropsureVerificationView(item.item) :
                                                        this.renderPropsurePendingView(item.item)
                                                }

                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item.id.toString()}
                                />
                                :
                                <Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
                        }
                    </View>
                    <FAB.Group
						open={open}
						icon="plus"
						fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
						color={AppStyles.bgcWhite.backgroundColor}
						actions={[
							{ icon: 'plus', label: 'Comment', color: AppStyles.colors.primaryColor, onPress: () => this.goToComments() },
							{ icon: 'plus', label: 'Attachment', color: AppStyles.colors.primaryColor, onPress: () => this.goToAttachments() },
							{ icon: 'plus', label: 'Diary Task ', color: AppStyles.colors.primaryColor, onPress: () => this.goToDiaryForm() },
						]}
						onStateChange={({ open }) => this.setState({ open })}
					/>
                </View>
                :
                <Loader loading={loading} />
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        lead: store.lead.lead
    }
}

export default connect(mapStateToProps)(LeadPropsure)