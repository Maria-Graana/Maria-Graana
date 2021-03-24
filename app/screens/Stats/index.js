import React, { Component } from 'react'
import { View, Text, Button, SafeAreaView, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles';
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

