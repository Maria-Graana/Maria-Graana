import React from 'react';
import styles from './style'
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { Button } from 'native-base';
import moment from 'moment';
import { setlead } from '../../actions/lead';

const _format = 'YYYY-MM-DD';

class LeadDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: ''
        }
    }

    componentDidMount() {
        const { route } = this.props
        const { purposeTab, lead } = route.params
        this.props.dispatch(setlead(lead))
        if (purposeTab === 'invest') {
            this.setState({
                type: 'Invest'
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

    navigateTo = () => {
        const { navigation, route } = this.props
        const { lead } = route.params
        const { type } = this.state
        if (type === 'Invest') {
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
        const { type } = this.state
        const { route, user } = this.props;
        const { lead } = route.params
        return (
            <View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                <View style={styles.outerContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.headingText}> Lead Type</Text>
                        <Text style={styles.labelText}> {type} </Text>
                        <Text style={styles.headingText}> Client Name </Text>
                        <Text style={styles.labelText}> {lead.customer.customerName}</Text>
                        <Text style={styles.headingText}> Requirement </Text>
                        <Text style={styles.labelText}>{!lead.projectId && lead.size} {!lead.projectId && lead.size_unit} {!lead.projectId && lead.type}{lead.projectId && lead.project.type}</Text>
                        <Text style={styles.headingText}> {type === 'Invest' ? 'Project' : 'Area'} </Text>
                        <Text style={styles.labelText}>{!lead.projectId && 'F-10 Markaz, '}{!lead.projectId && lead.city && lead.city.name} {lead.projectId && lead.project.name}</Text>
                        <Text style={styles.headingText}> Price Range </Text>
                        <Text style={styles.labelText}> PKR {!lead.projectId && lead.price} {lead.projectId && lead.minPrice} - {lead.projectId && lead.maxPrice}</Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}> Created Date </Text>
                        <Text style={styles.labelText}> {moment(lead.createdAt).format(_format)} </Text>
                        <Text style={styles.headingText}> Modified Date </Text>
                        <Text style={styles.labelText}> {moment(lead.updatedAt).format(_format)} </Text>
                        <Text style={styles.headingText}> Lead Source </Text>
                        <Text style={styles.labelText}> Online Marketing </Text>
                        <Text style={styles.headingText}> Additional Information </Text>
                        <Text style={styles.labelText}> Walk-in lead </Text>
                    </View>
                    <View style={styles.pad}>
                        <Text style={[styles.headingText, styles.padLeft]}> Status </Text>
                        <View style={{ marginRight: 20 }}>
                            <Text style={[styles.tokenLabel, AppStyles.mrFive]}> {lead.status} </Text>
                        </View>
                    </View>
                </View>
                <View style={[AppStyles.mainInputWrap]}>
                    <Button
                        onPress={() => { this.navigateTo() }}
                        style={[AppStyles.formBtn, styles.btn1]}>
                        <Text style={AppStyles.btnText}>{type === 'Invest' ? 'OPEN LEAD WORKFLOW' : 'MATCH PROPERTIES'}</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(LeadDetail)