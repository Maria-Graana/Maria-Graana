/** @format */

import * as Updates from 'expo-updates'
import * as React from 'react'
import { AppState, View } from 'react-native'
import { connect } from 'react-redux'
// import * as Sentry from 'sentry-expo'
import SuccessModal from './components/SuccessModal'
import UpdateModal from './components/UpdateModal'

class UpdateApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
      visible: false,
      loading: false,
      successModal: false,
      expoVersion: '',
    }
  }

  componentDidMount = () => {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') this.checkUpdates()
  }

  async checkUpdates() {
    try {
      const canUpdate = await Updates.checkForUpdateAsync()
      if (canUpdate.isAvailable) {
        this.setState({ visible: true, expoVersion: canUpdate.manifest.version })
      }
    } catch (e) {
      // Sentry.captureException(`Error ! ${JSON.stringify(e)}`)
    }
  }

  updateSubmit = async () => {
    this.setState({ loading: true })
    let result = await Updates.fetchUpdateAsync()
    if (result.isNew) {
      this.setState({ visible: false, successModal: true })
    } else {
      this.setState({ visible: false })
    }
  }

  reloadApp = () => {
    this.setState({ visible: false, successModal: false, loading: false })
    Updates.reloadAsync()
  }

  render() {
    return (
      <View>
        <UpdateModal
          active={this.state.visible}
          click={this.updateSubmit}
          loading={this.state.loading}
        />
        <SuccessModal
          expoVersion={this.state.expoVersion}
          active={this.state.successModal}
          reloadApp={this.reloadApp}
          loading={false}
        />
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(UpdateApp)
