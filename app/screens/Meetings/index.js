import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Linking } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import { connect } from 'react-redux';
import styles from './style'
import MeetingTile from '../../components/MeetingTile'
import MeetingModal from '../../components/MeetingModal'
import moment from 'moment'
import helper from '../../helper';

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
      meetings: [],
      checkValidation: false,
      doneStatus: false,
      doneStatusId: '',
    }
  }

  componentDidMount() {
    this.getMeetingLead()
    // console.log(this.props.route.params.lead)
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
          helper.successToast(`Meeting Added`)
          this.getMeetingLead();
          this.setState({
            active: false,
            formData: { time: '', date: '' }
          })
        })
    }
  }

  getMeetingLead = () => {
    const { formData } = this.state
    axios.get(`/api/diary/all?leadId=${formData.leadId}`)
      .then((res) => {
        this.setState({ meetings: res.data })
      })
  }

  openStatus = (id) => {
    this.setState({
      doneStatus: !this.state.doneStatus,
      doneStatusId: id,
    })

  }

  sendStatus = (status) => {
    let body = {
      status: status
    }
    axios.patch(`/api/diary/update?id=${this.state.doneStatusId}`, body)
      .then((res) => {
        this.getMeetingLead();
        this.setState({
          doneStatus: !this.state.doneStatus,
          doneStatusId: '',
        })
      })
  }

  sendCallStatus = () => {
    var a = new Date()
    let body = {
      start: a,
      end: a,
      time: moment(a).format("LT"),
      date: a,
      taskType: 'called',
      subject: 'Call to client ' + this.props.route.params.lead.customer.customerName,
      cutomerId: this.props.route.params.lead.customer.id,
      leadId: this.props.route.params.lead.id,
    }
    axios.post(`api/leads/project/meeting`, body)
      .then((res) => {
        this.getMeetingLead();
      })
  }

  callNumber = (url) => {
    if (url != 'tel:null') {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + url);
          } else {
            this.sendCallStatus()
            return Linking.openURL(url) 
          }
        }).catch(err => console.error('An error occurred', err));
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  render() {
    const { active, formData, checkValidation, meetings, doneStatus, doneStatusId } = this.state
    return (
      <View style={styles.mainWrapCon}>

        {/* ************Fab For Open Modal************ */}
        <View style={[styles.meetingConteiner]}>
          <ScrollView>
            <View style={styles.paddBottom}>
              {
                meetings && meetings != '' && meetings.rows.map((item, key) => {
                  return (
                    <MeetingTile
                      data={item}
                      key={key}
                      openStatus={this.openStatus}
                      sendStatus={this.sendStatus}
                      doneStatus={doneStatus}
                      doneStatusId={doneStatusId}
                    />
                  )
                })
              }
            </View>
          </ScrollView>

        </View>

        <View style={[styles.callMeetingBtn]}>
          <View style={[styles.btnsMainWrap]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { this.callNumber(`tel:${this.props.route.params.lead.customer.phone}`) }}>
              <Text style={styles.alignCenter}>CALL</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.btnsMainWrap]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { this.openModal() }}>
              <Text style={styles.alignCenter}>ADD MEETING</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Fab
          active={active}
          style={{ backgroundColor: '#0D73EE' }}
          position="bottomRight"
          onPress={() => { this.openModal() }}>
          <Ionicons name="md-add" color="#ffffff" />
        </Fab>

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


