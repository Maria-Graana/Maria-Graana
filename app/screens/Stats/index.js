import React, { Component } from 'react'
import { View, Text, Button, SafeAreaView, StatusBar, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles';
import StatisticsTile from '../../components/StatisticsTile';
import TouchableButton from '../../components/TouchableButton'
import styles from './style';

class Stats extends Component {
    constructor(props) {
        super(props)
    }

    goToLanding = () => {
        const { navigation } = this.props;
        navigation.navigate('Landing');
    }

    render() {

        return (
            <SafeAreaView style={[AppStyles.mb1, { backgroundColor: AppStyles.colors.backgroundColor },]}>
                <StatusBar barStyle="dark-content"/>
                <ScrollView style={[AppStyles.mb1, styles.additionalScrollView]}>
                  <StatisticsTile title={'Daily Average Response Time'} value={'2h 7m 40s'}/>
                  <StatisticsTile title={'Total Listings in their Area'} value={'19021'}/>
                  <StatisticsTile title={'Total Geotagged listings in their Area'} value={'212'}/>
                  <StatisticsTile title={'Lead Conversion Ratio (won/assigned)'} value={'2.9%'}/>
                  <StatisticsTile title={'Average Client Feedback'} value={'50%'}/>
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

