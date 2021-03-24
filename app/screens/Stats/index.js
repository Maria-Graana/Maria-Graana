import axios from 'axios';
import React, { Component } from 'react'
import { View, Text, Button, SafeAreaView, StatusBar, ScrollView } from 'react-native'
import * as Linking from 'expo-linking';
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
        this._handleDeepLink()     // if app is not in opened state this function is executed for deep linking
        this._addLinkingListener(); // if app is in foreground, this function is called for deep linking
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

    _handleDeepLink = () => {
        const { navigation } = this.props;
        Linking.getInitialURL().then(async (url) => {
          const { path } = await Linking.parseInitialURLAsync(url)
          const pathArray = path?.split('/') ?? []
          if (pathArray && pathArray.length) {
            const leadId = pathArray[pathArray.length - 1];
            const purposeTab = pathArray.includes('cmLead')
              ? 'invest'
              : pathArray.includes('rcmLead') && pathArray.includes('buy')
                ? 'sale'
                : pathArray.includes('rcmLead') && pathArray.includes('rent')
                  ? 'rent'
                  : ''
            pathArray.includes('cmLead') || pathArray.includes('rcmLead') ? navigation.navigate('LeadDetail', {
              purposeTab,
              lead: { id: leadId },
            })
              : null
          }
        })
      }

      _handleRedirectInForeground = (event) => {
        const { navigation } = this.props;
        const { path } = Linking.parse(event.url)
        const pathArray = path?.split('/') ?? []
        if (pathArray && pathArray.length) {
          const leadId = pathArray[pathArray.length - 1];
          const purposeTab = pathArray.includes('cmLead')
            ? 'invest'
            : pathArray.includes('rcmLead') && pathArray.includes('buy')
              ? 'sale'
              : pathArray.includes('rcmLead') && pathArray.includes('rent')
                ? 'rent'
                : ''
          pathArray.includes('cmLead') || pathArray.includes('rcmLead') ? navigation.navigate('LeadDetail', {
            purposeTab,
            lead: { id: leadId },
          })
            : null
        }
      }
    
      _addLinkingListener = () => {
        Linking.addEventListener('url', this._handleRedirectInForeground)
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

