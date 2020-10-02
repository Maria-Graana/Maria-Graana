import * as React from 'react';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { View, Alert, Platform, AppState } from 'react-native';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as Sentry from 'sentry-expo';
import * as Updates from 'expo-updates';
import UpdateModal from './components/UpdateModal';
import SuccessModal from './components/SuccessModal';

class UpdateApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appState: AppState.currentState,
            visible: false,
            loading: false,
            successModal: false
        }
    }

    componentDidMount = () => {
        AppState.addEventListener('change', this._handleAppStateChange)
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => { if (nextAppState === 'active') this.checkUpdates() }

    async checkUpdates() {
        try {
            const canUpdate = await Updates.checkForUpdateAsync();
            if (canUpdate.isAvailable) {
                Sentry.captureException(`canUpdate.manifest: ${canUpdate.manifest}`)
                Sentry.captureException(`canUpdate.manifest.expo: ${canUpdate.manifest.expo}`)
                this.setState({ visible: true })
            }
        } catch (e) {
            Sentry.captureException(`Error ! ${JSON.stringify(e)}`)
        }
    }

    updateSubmit = async () => {
        this.setState({ loading: true })
        let result = await Updates.fetchUpdateAsync();
        if (result.isNew) {
            this.setState({ visible: false, successModal: true })
        } else {
            this.setState({ visible: false })
            Sentry.captureException(`your app is new!`)
        }
    }

    reloadApp = () => {
        this.setState({ visible: false, successModal: false, loading: false })
        Updates.reloadAsync()
        Sentry.captureException(`App Updated!`)
    }

    render() {
        return (
            <View>
                <UpdateModal active={this.state.visible} click={this.updateSubmit} loading={this.state.loading} />
                <SuccessModal active={this.state.successModal} click={this.reloadApp} loading={false} />
            </View>

        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(UpdateApp)
