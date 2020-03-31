import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, Fab, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import { connect } from 'react-redux';
import styles from './style'
import * as RootNavigation from '../../navigation/RootNavigation';
import MeetingTile from '../../components/MeetingTile'
import MeetingModal from '../../components/MeetingModal'

class Meetings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      formData: {
        time: '',
        date: '',
        leadId: this.props.route.params.lead.id,
      },
      checkValidation: false,
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

  //  ************ Function for open modal ************ 
  openModal = () => {
    this.setState({
      active: !this.state.active,
    })
  }

  //  ************ Form Handle Function  ************ 
  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    this.setState({ formData })
  }

  //  ************ Form submit Function  ************ 
  formSubmit = () => {
    const { formData } = this.state
    if (!formData.time || !formData.date) {
      this.setState({ checkValidation: true })
    } else {
      axios.post(`api/leads/project/meeting`, formData)
        .then((res) => {
          this.setState({
            active: false,
          })
        })
    }
  }

  render() {
    const { active, formData, checkValidation } = this.state
    return (
      <View>

        {/* ************Fab For Open Modal************ */}
        <Fab
          active={active}
          style={{ backgroundColor: '#0D73EE' }}
          position="topRight"
          onPress={() => { this.openModal() }}>
          <Ionicons name="md-add" color="#ffffff" />
        </Fab>
        <View style={[styles.meetingConteiner]}>
          <ScrollView>
            {
              this.staticData.map((item, key) => {
                return (
                  <MeetingTile data={item} key={key} />
                )
              })
            }
          </ScrollView>
        </View>

        {/* ************Modal Component************ */}
        <MeetingModal
          active={active}
          formData={formData}
          checkValidation={checkValidation}
          openModal={this.openModal}
          handleForm={this.handleForm}
          formSubmit={this.formSubmit}
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

export default connect(mapStateToProps)(Meetings)


