import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import { connect } from 'react-redux';
import styles from './style'
import * as RootNavigation from '../../navigation/RootNavigation';
import MeetingTile from '../../components/MeetingTile'

class Meetings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
    this.staticData = [
      {
        id: '1',
        time: '09:30am',
        date: 'Mar 29',
        status: 'Done'
      },
      {
        id: '2',
        time: '11:05am',
        date: 'Mar 25',
        status: ''
      },
      {
        id: '3',
        time: '04:15pm',
        date: 'Mar 23',
        status: 'Done'
      },
      {
        id: '4',
        time: '05:40pm',
        date: 'Mar 20',
        status: ''
      },
      {
        id: '5',
        time: '06:15pm',
        date: 'Feb 16',
        status: ''
      },
      {
        id: '6',
        time: '07:00pm',
        date: 'Feb 13',
        status: 'Done'
      },

    ]
  }
  render() {
    return (
      <View>
        <Fab
          active={this.state.active}
          direction="up"
          style={{ backgroundColor: '#0D73EE' }}
          position="topRight"
          onPress={() => this.setState({ active: !this.state.active })}>
          <Ionicons name="md-add" color="#ffffff" />
        </Fab>
        <View style={[styles.meetingConteiner]}>
          <ScrollView>
            {
              this.staticData.map((item, key) => {
                return (
                  <MeetingTile data={item} key={key}/>
                )
              })
            }
          </ScrollView>
        </View>
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


