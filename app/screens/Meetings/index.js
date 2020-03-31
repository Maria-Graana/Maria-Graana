import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text } from 'native-base';
import axios from 'axios'
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';

class Meetings extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <View>
        <Text>Meetings</Text>
      </View>
    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(Meetings)


