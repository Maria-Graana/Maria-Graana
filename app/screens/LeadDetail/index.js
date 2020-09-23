import { ScrollView, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import AppStyles from '../../AppStyles'
import { Button } from 'native-base';
import React from 'react';
import { connect } from 'react-redux';
import helper from '../../helper';
import moment from 'moment';
import { setlead } from '../../actions/lead';
import styles from './style'
import axios from 'axios';
import Ability from '../../hoc/Ability'
import Loader from '../../components/loader';
import StaticData from '../../StaticData';

const _format = 'YYYY-MM-DD';

class LeadDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: '',
            lead: [],
            loading: true,
            customerName: '',
            showAssignToButton: false,
            editDes: false,
            description: '',
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.purposeTab()
        })
    }


    purposeTab = () => {
        const { route } = this.props
        const { purposeTab } = route.params
        if (purposeTab === 'invest') {
            this.fetchLead('/api/leads/project/byId')
            this.setState({
                type: 'Investment'
            })
        }
        else if (purposeTab === 'sale') {
            this.fetchLead('api/leads/byId')
            this.setState({
                type: 'Buy'
            })
        } else {
            this.fetchLead('api/leads/byId')
            this.setState({
                type: 'Rent'
            })
        }
    }

    fetchLead = (url) => {
        const { route } = this.props
        const { lead } = route.params
        const that = this;
        axios.get(`${url}?id=${lead.id}`)
            .then((res) => {
                this.props.dispatch(setlead(res.data))
                const regex = /(<([^>]+)>)/ig
                let text = res.data.description && res.data.description !== '' ? res.data.description.replace(regex, '') : null
                this.setState({ lead: res.data, loading: false, description: text }, () => {
                    that.checkCustomerName(res.data);
                    that.checkAssignedLead(res.data);
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    navigateTo = () => {
        const { navigation } = this.props
        const { lead, type } = this.state
        var status = lead.status
        let page = ''

        if (type === 'Investment') {

            if (status === "token" || status === 'payment' || status === 'closed_won' || status === 'closed_lost') {
                page = 'Payments'
            } else {
                page = 'Meetings'
            }
            navigation.navigate('CMLeadTabs', {
                screen: page,
                params: { lead: lead },
            })
        } else {
            if (status === "viewing") {
                page = 'Viewing'
            }
            if (status === "offer") {
                page = 'Offer'
            }
            if (status === "propsure") {
                page = 'Propsure'
            }
            if (status === "payment") {
                page = 'Payment'
            }
            if (status === "payment" || status === 'closed_won' || status === 'closed_lost') {
                page = 'Payment'
            }
            navigation.navigate('RCMLeadTabs', {
                screen: page,
                params: { lead: lead },
            })
        }
    }

    navigateToAssignLead = () => {
        const { navigation } = this.props
        const { lead, type } = this.state
        navigation.navigate('AssignLead', { leadId: lead.id, type: type, screen: 'LeadDetail' })
    }

    checkAssignedLead = (lead) => {
        const { user } = this.props;
        // Show assign lead button only if loggedIn user is Sales level2 or CC/BC/RE Manager
        if (Ability.canView(user.subRole, 'AssignLead') && lead.status !== StaticData.Constants.lead_closed_lost && lead.status !== StaticData.Constants.lead_closed_won) {

            // Lead can only be assigned to someone else if it is assigned to no one or to current user 
            if (lead.assigned_to_armsuser_id === null || user.id === lead.assigned_to_armsuser_id) {
                this.setState({ showAssignToButton: true })
            }
            else {
                // Lead is already assigned to some other user (any other user)
                this.setState({ showAssignToButton: false })
            }
        }
    }

    checkCustomerName = (lead) => {
        if (lead.customer)
            // for  CM LEAD
            this.setState({ customerName: helper.capitalize(lead.customer.customerName) })
        else {
            // FOR RCM LEAD
            this.setState({ customerName: helper.capitalize(lead.customer.first_name) + ' ' + helper.capitalize(lead.customer.last_name) })
        }

    }

    goToClientsDetail = () => {
        const { lead } = this.state;
        const { navigation } = this.props;
        navigation.navigate('ClientDetail', { client: lead.customer ? lead.customer : null });
    }

    editDescription = (status) => {
        this.setState({
            editDes: status,
        })
    }

    handleDes = (text) => {
        const regex = /(<([^>]+)>)/ig
        text = text && text !== '' ? text.replace(regex, '') : null
        this.setState({
            description: text
        })
    }

    submitDes = () => {
        const { route } = this.props;
        const { description } = this.state;
        const { purposeTab, lead } = route.params
        var endPoint = ''
        var leadId = []
        leadId.push(lead.id)
        var body = {
            description: description,
        }
        if (purposeTab == 'invest') {
            endPoint = `/api/leads/project`
        } else {
            endPoint = `/api/leads`
        }
        axios.patch(endPoint, body, { params: { id: leadId } })
            .then((res) => {
                this.purposeTab()
                this.editDescription(false)
            })
    }

    checkLeadSource = () => {
        const { lead } = this.state;
        if (lead.origin) {
            if (lead.origin === 'arms') {
                return `${lead.origin.split('_').join(' ').toLocaleUpperCase()} ${lead.creator ? `(${lead.creator.firstName} ${lead.creator.lastName})` : ''}`
            }
            else {
                return `${lead.origin.split('_').join(' ').toLocaleUpperCase()}`;
            }
        }
        else {
            return null;
        }
    }

    leadSize = () => {
        const { lead } = this.state
        let minSize = !lead.projectId && lead.size && lead.size !== 0 ? lead.size : ''
        let maxSize = !lead.projectId && lead.max_size && lead.max_size !== 0 ? lead.max_size : ''
        let size = ''
        if (minSize == maxSize) {
            size = minSize + ' '
        } else {
            maxSize = maxSize !== '' ? ' - ' + maxSize : maxSize
            size = minSize + maxSize + ' '
        }
        return size
    }

    render() {
        const { type, lead, customerName, showAssignToButton, loading, editDes, description } = this.state
        const { user, route } = this.props;
        const { purposeTab } = route.params
        let projectName = lead.project ? helper.capitalize(lead.project.name) : lead.projectName
        const leadSource = this.checkLeadSource();
        const regex = /(<([^>]+)>)/ig
        let leadSize = this.leadSize()

        return (
            !loading ?
                <ScrollView showsVerticalScrollIndicator={false} style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                    <View style={styles.outerContainer}>
                        <View style={styles.rowContainer}>
                            <View style={AppStyles.mb1}>
                                <Text style={styles.headingText}>Lead Type</Text>
                                <Text style={styles.labelText}>{type} </Text>
                            </View>
                            <View style={styles.statusView}>
                                <Text style={styles.textStyle}>
                                    {
                                        lead.status && lead.status === 'token' ?
                                            <Text>DEAL SIGNED - TOKEN</Text>
                                            :
                                            lead.status &&
                                            lead.status.split('_').join(' ').toUpperCase()
                                    }
                                </Text>
                            </View>
                        </View>
                        <View style={styles.underLine} />
                        <View style={styles.rowContainer}>
                            <View style={AppStyles.mb1}>
                                <Text style={styles.headingText}>Client Name </Text>
                                <Text style={styles.labelText}>{customerName}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.goToClientsDetail()} style={styles.roundButtonView} activeOpacity={0.6}>
                                <Text style={[AppStyles.btnText, { fontSize: 16 }]}>Details</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.underLine} />
                        <View style={styles.mainDesView}>
                            <View style={styles.viewOne}>
                                <Text style={styles.headingText}>Description </Text>
                                {
                                    editDes === true ?
                                        <View>
                                            <TextInput placeholderTextColor={'#a8a8aa'} style={styles.inputDes} placeholder={`Edit Description`} value={description} onChangeText={(text) => { this.handleDes(text) }} />
                                            <TouchableOpacity onPress={() => this.submitDes()} style={styles.roundButtonViewTwo} activeOpacity={0.6}>
                                                <Text style={{ textAlign: 'center', color: '#fff' }}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <Text style={styles.labelText}>
                                            {lead.description && lead.description !== '' ? lead.description.replace(regex, '') : null}
                                        </Text>
                                }

                            </View>
                            <View style={styles.viewTwo}>
                                {
                                    editDes === true ?
                                        <TouchableOpacity onPress={() => { this.editDescription(false) }} style={styles.editDesBtn} activeOpacity={0.6}>
                                            <Image source={require('../../../assets/img/times.png')} style={styles.editImg} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => { this.editDescription(true) }} style={styles.editDesBtn} activeOpacity={0.6}>
                                            <Image source={require('../../../assets/img/edit.png')} style={styles.editImg} />
                                        </TouchableOpacity>
                                }


                            </View>
                        </View>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Requirement </Text>
                        <Text style={styles.labelText}>
                            {leadSize}
                            {!lead.projectId && lead.size ? helper.capitalize(lead.size_unit) + ' ' : ''}
                            {!lead.projectId && helper.capitalize(lead.subtype)}
                            {lead.projectId && lead.projectType && helper.capitalize(lead.projectType)}
                        </Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>{type === 'Investment' ? 'Project' : 'Area'} </Text>
                        <Text style={styles.labelText}>
                            {
                                !lead.projectId && lead.armsLeadAreas && lead.armsLeadAreas.length ?
                                    lead.armsLeadAreas[0].area &&
                                    // lead.armsLeadAreas[0].area.name 
                                    lead.armsLeadAreas.map((item, index) => {
                                        var comma = index > 0 ? ', ' : ''
                                        return comma + (item.area.name)
                                    })
                                    :
                                    ''
                            }
                            {!lead.projectId && lead.city && ' - ' + lead.city.name}{purposeTab === 'invest' && projectName}</Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Price Range </Text>
                        <Text style={styles.labelText}>
                            {` ${!lead.projectId && lead.min_price ? helper.checkPrice(lead.min_price, true) + ' - ' : ''}`}
                            {!lead.projectId && lead.price ? helper.checkPrice(lead.price) : ''}
                            {lead.projectId && lead.minPrice && helper.checkPrice(lead.minPrice, true) + ' - '}
                            {lead.projectId && lead.maxPrice && helper.checkPrice(lead.maxPrice)}
                        </Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Assigned</Text>
                        <Text style={styles.labelText}>{lead.assigned_at ? moment(lead.assigned_at).format("MMM DD YYYY, hh:mm A") : '-'} </Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Created </Text>
                        <Text style={styles.labelText}>{moment(lead.createdAt).format("MMM DD YYYY, hh:mm A")} </Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Modified</Text>
                        <Text style={styles.labelText}>{moment(lead.updatedAt).format("MMM DD YYYY, hh:mm A")} </Text>
                        <View style={styles.underLine} />
                        {
                            lead.shared_with_armsuser_id && user.id !== lead.shared_with_armsuser_id && lead.shareUser ?
                                <>
                                    <Text style={styles.headingText}>Shared with</Text>
                                    <Text style={styles.labelText}>{lead.shareUser.firstName + ' ' + lead.shareUser.lastName + ', ' + lead.shareUser.phoneNumber} </Text>
                                    <View style={styles.underLine} />
                                </>
                                :
                                null
                        }
                        {
                            lead.shared_with_armsuser_id && user.id === lead.shared_with_armsuser_id && lead.armsuser ?
                                <>
                                    <Text style={styles.headingText}>Shared by</Text>
                                    <Text style={styles.labelText}>{lead.armsuser.firstName + ' ' + lead.armsuser.lastName + ', ' + (lead.armsuser.phoneNumber ? lead.armsuser.phoneNumber : '')} </Text>
                                    <View style={styles.underLine} />
                                </>
                                :
                                null
                        }
                        {
                            lead.sharedAt ?
                                <>
                                    <Text style={styles.headingText}>Shared at</Text>
                                    <Text style={styles.labelText}>{moment(lead.sharedAt).format("MMM DD YYYY, hh:mm A")} </Text>
                                    <View style={styles.underLine} />
                                </>
                                : null
                        }

                        <Text style={styles.headingText}>Lead Source </Text>
                        <Text numberOfLines={1} style={styles.labelText}>{leadSource} {lead.projectId && lead.bulk && '(Bulk uploaded)'}</Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Assigned To </Text>
                        <Text style={styles.labelText}>{(lead.armsuser && lead.armsuser.firstName) ? lead.armsuser.firstName + ' ' + lead.armsuser.lastName : '-'}</Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Lead ID</Text>
                        <Text style={styles.labelText}>{lead.id ? lead.id : ''} </Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Additional Information </Text>
                        <Text style={styles.labelText}>{lead.category ? lead.category : 'NA'} </Text>
                    </View>
                    {
                        showAssignToButton &&
                        < View style={styles.assignButtonView}>
                            <Button
                                onPress={() => { this.navigateToAssignLead() }}
                                style={[AppStyles.formBtnWithWhiteBg, { marginBottom: 30 }]}>
                                <Text style={AppStyles.btnTextBlue}>ASSIGN TO TEAM MEMBER</Text>
                            </Button>
                        </View>
                    }

                    <View style={[AppStyles.assignButtonView]}>
                        <Button
                            onPress={() => { this.navigateTo() }}
                            style={[AppStyles.formBtn, styles.btn1]}>
                            <Text style={AppStyles.btnText}>OPEN LEAD WORKFLOW</Text>
                        </Button>
                    </View>
                </ScrollView >
                :
                <Loader loading={loading} />
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(LeadDetail)
