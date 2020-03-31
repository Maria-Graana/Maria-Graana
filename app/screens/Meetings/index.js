import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';

class Meetings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }
  render() {
    return (
      <View>
        <Text>Meetings</Text>
        <Fab
						active={this.state.active}
						direction="up"
						style={{ backgroundColor: '#0D73EE' }}
						position="topRight"
						onPress={() => this.setState({ active: !this.state.active })}>
						<Ionicons name="md-add" color="#ffffff" />
					</Fab>
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


