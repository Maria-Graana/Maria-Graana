import { ScrollView, Text, View } from 'react-native';

import AppStyles from '../../AppStyles'
import { Button } from 'native-base';
import React from 'react';
import { connect } from 'react-redux';
import helper from '../../helper';
import moment from 'moment';
import { setlead } from '../../actions/lead';
import styles from './style'
import axios from 'axios';

const _format = 'YYYY-MM-DD';

class LeadDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: '',
            lead: []
        }
    }

    componentDidMount() {
        const { route } = this.props
        const { purposeTab, lead } = route.params
        this.fetchLead()
        if (purposeTab === 'invest') {
            this.setState({
                type: 'Investment'
            })
        }
        else if (purposeTab === 'sale') {
            this.setState({
                type: 'Buy'
            })
        } else {
            this.setState({
                type: 'Rent'
            })
        }
    }

    fetchLead = () => {
        const { route } = this.props
        const { lead } = route.params
        axios.get(`api/leads/byid?id=${lead.id}`)
            .then((res) => {
                this.props.dispatch(setlead(res.data))
                this.setState({ lead: res.data })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    navigateTo = () => {
        const { navigation } = this.props
        const { lead, type } = this.state
        if (type === 'Investment') {
            navigation.navigate('CMLeadTabs', {
                screen: 'Meetings',
                params: { lead: lead },
            })
        } else {
            navigation.navigate('RCMLeadTabs', {
                screen: 'Match',
                params: { lead: lead },
            })
        }
    }

    render() {
        const { type, lead } = this.state
        return (
            <ScrollView style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                <View style={styles.outerContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.headingText}>Lead Type</Text>
                        <Text style={styles.labelText}>{type} </Text>
                        <Text style={styles.headingText}>Client Name </Text>
                        <Text style={styles.labelText}>{lead.customer && lead.customer.customerName && helper.capitalize(lead.customer.customerName)}</Text>
                        <Text style={styles.headingText}>Requirement </Text>
                        <Text style={styles.labelText}>{!lead.projectId && lead.size && lead.size + ' '}{!lead.projectId && lead.size_unit && lead.size_unit + ' '}{!lead.projectId && helper.capitalize(lead.subtype)}{lead.projectId && lead.projectType && helper.capitalize(lead.projectType)}</Text>
                        <Text style={styles.headingText}>{type === 'Investment' ? 'Project' : 'Area'} </Text>
                        <Text style={styles.labelText}>{!lead.projectId && lead.armsLeadAreas && lead.armsLeadAreas.length && lead.armsLeadAreas[0].area && lead.armsLeadAreas[0].area.name + ', '}{!lead.projectId && lead.city && lead.city.name}{lead.projectId && lead.project && helper.capitalize(lead.project.name)}</Text>
                        <Text style={styles.headingText}>Price Range </Text>
                        <Text style={styles.labelText}>PKR {!lead.projectId && lead.price} {lead.projectId && lead.minPrice && lead.minPrice + ' - '} {lead.projectId && lead.maxPrice && lead.maxPrice}</Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}>Created Date </Text>
                        <Text style={styles.labelText}>{moment(lead.createdAt).format(_format)} </Text>
                        <Text style={styles.headingText}>Modified Date </Text>
                        <Text style={styles.labelText}>{moment(lead.updatedAt).format(_format)} </Text>
                        <Text style={styles.headingText}>Lead Source </Text>
                        <Text style={styles.labelText}>{lead.origin ? (lead.origin.split('_').join(' ')).toLocaleUpperCase() : null} </Text>
                        <Text style={styles.headingText}>Additional Information </Text>
                        <Text style={styles.labelText}>{lead.category ? lead.category : 'NA'} </Text>
                    </View>
                    <View style={[styles.pad, { alignItems: 'center', }]}>
                        <Text style={[styles.headingText, styles.padLeft, { paddingLeft: 0 }]}>Status</Text>
                        <View style={styles.mainView}>
                            <Text style={styles.textStyle}>
                                {lead.status && lead.status.split('_').join(' ').toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={[AppStyles.mainInputWrap]}>
                    <Button
                        onPress={() => { this.navigateTo() }}
                        style={[AppStyles.formBtn, styles.btn1]}>
                        <Text style={AppStyles.btnText}>OPEN LEAD WORKFLOW</Text>
                    </Button>
                </View>
            </ScrollView>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(LeadDetail)