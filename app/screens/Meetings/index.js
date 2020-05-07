import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Linking } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import { connect } from 'react-redux';
import styles from './style'
import MeetingTile from '../../components/MeetingTile'
import MeetingModal from '../../components/MeetingModal'
import MeetingStatusModal from '../../components/MeetingStatusModal'
import moment from 'moment'
import helper from '../../helper';
import AppStyles from '../../AppStyles';
import { ProgressBar, Colors } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { setlead } from '../../actions/lead';
import StaticData from '../../StaticData';

class Meetings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      formData: {
        time: '',
        date: '',
        leadId: this.props.route.params.lead.id,
        subject: this.props.route.params.lead.customer ? `Meeting with ${this.props.route.params.lead.customer.customerName}` : null
      },
      meetings: [],
      checkValidation: false,
      doneStatus: false,
      doneStatusId: '',
      editMeeting: false,
      meetingId: '',
      modalStatus: 'dropdown',
      open: false,
      progressValue: 0
    }
  }

  componentDidMount() {
    this.fetchLead()
    this.getMeetingLead()
  }

  fetchLead = () => {
    const { lead } = this.props
    const { cmProgressBar } = StaticData
    axios.get(`/api/leads/project/byId?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
        this.setState({
          progressValue: cmProgressBar[res.data.status] || 0
        })
      })
      .catch((error) => {
        console.log(error)
      })
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

  getMeetingLead = () => {
    const { formData } = this.state
    const { lead } = this.props
    axios.get(`/api/diary/all?leadId=${lead.id}`)
      .then((res) => {
        this.setState({ meetings: res.data })
      })
  }

  //  ************ Form submit Function  ************ 
  formSubmit = (id) => {
    const { formData, editMeeting, meetingId } = this.state
    if (!formData.time || !formData.date) {
      this.setState({ checkValidation: true })
    } else {
      if (editMeeting === true) {
        let startTime = moment(formData.time, 'LT').format('HH:mm:ss')
        let startDate = moment(formData.date, 'YYYY-MM-DDLT').format('YYYY-MM-DD')
        let body = {
          date: startDate + 'T' + startTime,
          time: formData.time,
          leadId: formData.leadId,
          start: startDate + 'T' + startTime,
          end: startDate + 'T' + startTime,
        }
        axios.patch(`/api/diary/update?id=${meetingId}`, body)
          .then((res) => {
            helper.successToast(`Meeting Updated`)
            this.getMeetingLead();
            formData['time'] = ''
            formData['date'] = ''
            this.setState({
              active: false,
              formData,
              editMeeting: false,
            })
          }).catch(() => {
            helper.errorToast(`Some thing went wrong!!!`)
          })
      } else {
        axios.post(`api/leads/project/meeting`, formData)
          .then((res) => {
            formData['time'] = ''
            formData['date'] = ''
            helper.successToast(`Meeting Added`)
            this.getMeetingLead();
            this.setState({
              active: false,
              formData,
            })
          }).catch(() => {
            helper.errorToast(`Some thing went wrong!!!`)
          })
      }

    }
  }

  openStatus = (data) => {
    this.setState({
      doneStatus: !this.state.doneStatus,
      doneStatusId: data,
      modalStatus: 'dropdown'
    })
  }

  openAttechment = () => {
    this.setState({
      modalStatus: 'btnOptions',
      doneStatus: !this.state.doneStatus,
    })
  }

  sendStatus = (status) => {
    const { formData } = this.state
    let body = {
      response: status,
      leadId: formData.leadId
    }
    if (status === 'cancel_meeting') {
      axios.delete(`/api/diary/delete?id=${this.state.doneStatusId.id}`)
        .then((res) => {
          this.getMeetingLead();
          this.setState({
            doneStatus: !this.state.doneStatus,
          })
        })
    } else {
      axios.patch(`/api/diary/update?id=${this.state.doneStatusId.id}`, body)
        .then((res) => {
          this.getMeetingLead();
          this.setState({
            doneStatus: !this.state.doneStatus,
          })
        })
    }

  }

  sendCallStatus = () => {
    var a = new Date()
    let body = {
      start: a,
      end: a,
      time: moment(a).format("LT"),
      date: a,
      taskType: 'called',
      response: 'Called',
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

  editFunction = (id) => {
    const { meetings, active } = this.state
    let filter = meetings.rows.filter((item) => { return item.id === id && item })
    this.setState({
      active: !active,
      formData: {
        date: filter[0].date,
        time: filter[0].time,
        leadId: this.props.route.params.lead.id,
      },
      editMeeting: true,
      meetingId: id,
    })
  }

  goToComments = () => {
    const { navigation, route } = this.props;
    navigation.navigate('Comments', { cmLeadId: route.params.lead.id });
  }

  goToAttachments = () => {
    const { navigation, route } = this.props;
    navigation.navigate('Attachments', { cmLeadId: route.params.lead.id });
  }

  goToDiaryForm = () => {
    const { navigation, route, user } = this.props;
    navigation.navigate('AddDiary', {
      update: false,
      cmLeadId: route.params.lead.id,
      agentId: user.id
    });
  }
  render() {
    const { active, formData, checkValidation, meetings, doneStatus, doneStatusId, modalStatus, open, progressValue } = this.state
    let leadData = this.props.route.params.lead
    return (
      <View style={styles.mainWrapCon}>
        <ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />

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
                      editFunction={this.editFunction}
                    />
                  )
                })
              }
            </View>
          </ScrollView>

          <FAB.Group
            open={open}
            icon="plus"
            fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
            color={AppStyles.bgcWhite.backgroundColor}
            actions={[
              { icon: 'plus', label: 'Comment', color: AppStyles.colors.primaryColor, onPress: () => this.goToComments() },
              { icon: 'plus', label: 'Attachment', color: AppStyles.colors.primaryColor, onPress: () => this.goToAttachments() },
              { icon: 'plus', label: 'Diary Task', color: AppStyles.colors.primaryColor, onPress: () => this.goToDiaryForm() },

            ]}
            onStateChange={({ open }) => this.setState({ open })}
          />

        </View>

        <View style={[styles.callMeetingBtn]}>
          <View style={[styles.btnsMainWrap]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { this.callNumber(`tel:${leadData && leadData.customer && leadData.customer.phone}`) }}>
              <Text style={styles.alignCenter}>CALL</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.btnsMainWrap]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { this.openModal() }}>
              <Text style={styles.alignCenter}>ADD MEETING</Text>
            </TouchableOpacity>
          </View>
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

        <MeetingStatusModal
          doneStatus={doneStatus}
          sendStatus={this.sendStatus}
          data={doneStatusId}
          openStatus={this.openStatus}
          modalType={modalStatus}
          goToDiaryForm={this.goToDiaryForm}
          goToAttachments={this.goToAttachments}
          goToComments={this.goToComments}
        />

      </View>
    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead
  }
}

export default connect(mapStateToProps)(Meetings)


