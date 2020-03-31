import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import axios from 'axios'
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import { Text } from 'native-base';

class Payments extends Component {
  constructor(props) {
    super(props)

  }





  render() {

    return (
      <View>
        <Text>Payments</Text>
      </View>
    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(Payments)


