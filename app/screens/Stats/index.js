import axios from 'axios';
import React, { Component } from 'react'
import { View, Text, Button, SafeAreaView, StatusBar, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles';
import Loader from '../../components/loader';
import StatisticsTile from '../../components/StatisticsTile';
import TouchableButton from '../../components/TouchableButton'
import styles from './style';

class Stats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            userStatistics: null,
        }
    }

    componentDidMount() {
        this.getUserStatistics()
    }


    getUserStatistics = () => {
        axios.get(`/api/user/stats`).then(response => {
            this.setState({ userStatistics: response.data })
        }).catch(error => {
            console.log('error getting statistic at /api/user/stats', error)
        })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    showLeadWonAssignedPercentage = (wonLeads, assignedLeads) => {
        if (wonLeads && assignedLeads) {
               return `${((wonLeads/assignedLeads) * 100).toFixed(1)} %`;
        }
        else {
            return null;
        }
    }

    goToLanding = () => {
        const { navigation } = this.props;
        navigation.navigate('Landing');
    }

    render() {
        const { loading, userStatistics } = this.state;
        return (
            loading ?
                <Loader loading={loading} />
                :
                <SafeAreaView style={[AppStyles.mb1, { backgroundColor: AppStyles.colors.backgroundColor },]}>
                    <StatusBar barStyle="dark-content" />
                    <ScrollView style={[AppStyles.mb1, styles.additionalScrollView]}>
                        <StatisticsTile title={'Daily Average Response Time'} value={userStatistics.avgTime} />
                        <StatisticsTile title={'Total Listings in their Area'} value={userStatistics.geoTaggedListing} />
                        <StatisticsTile title={'Total Geotagged listings in their Area'} value={userStatistics.listing} />
                        <StatisticsTile title={`Lead Conversion Ratio (${userStatistics.won}) / (${userStatistics.totalLeads})`} value={ this.showLeadWonAssignedPercentage(userStatistics.won, userStatistics.totalLeads) } />
                    </ScrollView>
                    <View style={styles.continueContainer}>
                        <TouchableButton
                            label={'CONTINUE'}
                            loading={false}
                            fontFamily={AppStyles.fonts.boldFont}
                            onPress={this.goToLanding}
                            containerStyle={styles.continueButton}
                        />
                    </View>
                </SafeAreaView>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(Stats)

