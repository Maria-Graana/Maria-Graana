/** @format */

import * as React from 'react'
import styles from './style'
import { View, Text, FlatList, Image, TouchableOpacity, Linking } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index'
import AgentTile from '../../components/AgentTile/index'
import HistoryModal from '../../components/HistoryModal/index'
import axios from 'axios'
import Loader from '../../components/loader'
import AddViewing from '../../components/AddViewing/index'
import _ from 'underscore'
import moment from 'moment'
import { FAB } from 'react-native-paper'
import { ProgressBar } from 'react-native-paper'
import StaticData from '../../StaticData'
import { setlead } from '../../actions/lead'
import helper from '../../helper'
import TimerNotification from '../../LocalNotifications'
import CMBottomNav from '../../components/CMBottomNav'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import config from '../../config'
import CheckListModal from '../../components/CheckListModal'
import ViewCheckListModal from '../../components/ViewCheckListModal'

class LeadViewing extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead } = this.props
    this.state = {
      isVisible: false,
      open: false,
      loading: true,
      addLoading: false,
      viewing: {
        date: '',
        time: '',
      },
      checkValidation: false,
      currentProperty: {},
      progressValue: 0,
      menuShow: false,
      updateViewing: false,
      isMenuVisible: true,
      // for the lead close dialog
      isCloseLeadVisible: false,
      checkReasonValidation: false,
      organization: 'arms',
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
      callModal: false,
      meetings: [],
      matchData: [],
      isCheckListModalVisible: false,
      selectedCheckList: [],
      userFeedback: null,
      viewCheckListModal: false,
      selectedViewingData: null,
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchLead()
      this.getCallHistory()
      this.fetchProperties()
    })
  }

  fetchProperties = () => {
    const { lead } = this.props
    const { rcmProgressBar } = StaticData
    let matches = []
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/${lead.id}/shortlist`)
        .then((res) => {
          matches = helper.propertyIdCheck(res.data.rows)
          this.setState({
            loading: false,
            matchData: matches,
            progressValue: rcmProgressBar[lead.status],
          })
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            loading: false,
          })
        })
        .finally(() => {
          this.setState({
            loading: false,
          })
        })
    })
  }

  fetchLead = () => {
    const { lead } = this.props
    axios
      .get(`api/leads/byid?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  openModal = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    })
  }

  displayChecks = () => {}

  ownProperty = (property) => {
    const { user } = this.props
    const { organization } = this.state
    if (property.arms_id) {
      if (property.assigned_to_armsuser_id) {
        return user.id === property.assigned_to_armsuser_id
      } else {
        return false
      }
    } else {
      return true
    }
  }

  closedLead = () => {
    helper.leadClosedToast()
  }

  closeLead = () => {
    const { lead } = this.props
    if (lead.commissions && lead.commissions.status === StaticData.leadClearedStatus) {
      this.setState({
        reasons: StaticData.leadCloseReasonsWithPayment,
        isCloseLeadVisible: true,
        checkReasonValidation: '',
      })
    } else {
      this.setState({
        reasons: StaticData.leadCloseReasons,
        isCloseLeadVisible: true,
        checkReasonValidation: '',
      })
    }
  }

  onHandleCloseLead = () => {
    const { navigation, lead } = this.props
    const { selectedReason } = this.state
    let payload = Object.create({})
    payload.reasons = selectedReason
    if (selectedReason !== '') {
      var leadId = []
      leadId.push(lead.id)
      axios
        .patch(`/api/leads`, payload, { params: { id: leadId } })
        .then((response) => {
          this.setState({ isCloseLeadVisible: false }, () => {
            helper.successToast(`Lead Closed`)
            navigation.navigate('Leads')
          })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      alert('Please select a reason for lead closure!')
    }
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value })
  }

  closeModal = () => {
    this.setState({ isCloseLeadVisible: false })
  }

  goToDiaryForm = () => {
    const { lead, navigation, user } = this.props
    navigation.navigate('AddDiary', {
      update: false,
      agentId: user.id,
      rcmLeadId: lead.id,
      addedBy: 'self',
    })
  }

  goToAttachments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('Attachments', { rcmLeadId: lead.id })
  }

  goToComments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  setProperty = (property) => {
    const { viewing } = this.state
    viewing['date'] = ''
    viewing['time'] = ''
    this.setState({ currentProperty: property, updateViewing: false })
  }

  updateProperty = (property) => {
    if (property.diaries.length) {
      if (property.diaries[0].status === 'pending') {
        let diary = property.diaries[0]
        let date = moment(diary.date)
        this.setState({
          currentProperty: property,
          viewing: {
            date: date,
            time: diary.start,
          },
          updateViewing: true,
        })
      }
    }
  }

  handleForm = (value, name) => {
    const { viewing } = this.state
    viewing[name] = value
    this.setState({ viewing })
  }

  submitViewing = () => {
    const { viewing, updateViewing } = this.state
    if (!viewing.time || !viewing.date) {
      this.setState({
        checkValidation: true,
      })
    } else {
      this.setState({ addLoading: true })
      if (updateViewing) this.updateViewing()
      else this.createViewing()
    }
  }

  updateViewing = () => {
    const { viewing, currentProperty } = this.state
    const { lead } = this.props
    if (currentProperty.diaries.length) {
      let diary = currentProperty.diaries[0]
      let start = helper.formatDateAndTime(helper.formatDate(viewing.date), viewing.time)
      let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
      let body = {
        date: start,
        time: start,
        start: start,
        end: end,
        subject: diary.subject,
        taskCategory: 'leadTask',
      }
      axios
        .patch(`/api/diary/update?id=${diary.id}`, body)
        .then((res) => {
          this.setState({
            isVisible: false,
            loading: true,
          })
          let start = new Date(res.data.start)
          let end = new Date(res.data.end)
          let data = {
            id: res.data.id,
            title: res.data.subject,
            body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
          }
          helper.deleteAndUpdateNotification(data, start, res.data.id)
          this.fetchLead()
          this.fetchProperties()
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.setState({ addLoading: false })
        })
    }
  }

  createViewing = () => {
    const { viewing, currentProperty } = this.state
    const { lead } = this.props
    let customer =
      (lead.customer &&
        lead.customer.customerName &&
        helper.capitalize(lead.customer.customerName)) ||
      ''
    let areaName =
      (currentProperty.area && currentProperty.area.name && currentProperty.area.name) || ''
    let customerId = lead.customer && lead.customer.id
    let start = helper.formatDateAndTime(helper.formatDate(viewing.date), viewing.time)
    let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
    let body = {
      date: start,
      time: start,
      start: start,
      end: end,
      propertyId: currentProperty.id,
      leadId: lead.id,
      subject: 'Viewing with ' + customer + ' at ' + areaName,
      taskCategory: 'leadTask',
      customerId: customerId,
    }
    axios
      .post(`/api/leads/viewing`, body)
      .then((res) => {
        this.setState({
          isVisible: false,
          loading: true,
        })
        let start = new Date(res.data.start)
        let end = new Date(res.data.end)
        let data = {
          id: res.data.id,
          title: res.data.subject,
          body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
        }
        TimerNotification(data, start)
        this.fetchLead()
        this.fetchProperties()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ addLoading: false })
      })
  }

  toggleCheckListModal = (toggleState, data) => {
    this.setState({
      isCheckListModalVisible: toggleState,
      currentProperty: data ? data : null,
      selectedCheckList: [],
      userFeedback: null,
    })
  }

  checkStatus = (property) => {
    const { lead, user } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (helper.checkMyDiary(property, user)) {
      let diaries = property.diaries
      let diary = _.find(diaries, (item) => user.id === item.userId)
      let viewingDoneCount =
        diaries &&
        diaries.filter((item) => {
          return item.status === 'completed' && item.userId === user.id
        })
      let greaterOneViewing = viewingDoneCount && viewingDoneCount.length > 1
      if (diaries && diaries.length > 0) {
        return (
          <View>
            {diary && diary.status === 'pending' && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (leadAssignedSharedStatus) {
                    this.openModal()
                    this.updateProperty(property)
                  }
                }}
              >
                <Text style={{ fontFamily: AppStyles.fonts.lightFont }}>
                  Viewing at{' '}
                  <Text
                    style={{
                      color: AppStyles.colors.primaryColor,
                      fontFamily: AppStyles.fonts.defaultFont,
                    }}
                  >
                    {moment(diary.start).format('LLL')}
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
            {viewingDoneCount && viewingDoneCount.length > 0 && (
              <TouchableOpacity
                style={{
                  backgroundColor: AppStyles.colors.primaryColor,
                  height: 30,
                  borderBottomEndRadius: 10,
                  borderBottomLeftRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                onPress={() => this.simplifyViewingData(viewingDoneCount)}
              >
                <Text style={{ color: 'white', fontFamily: AppStyles.fonts.defaultFont }}>
                  VIEWING{greaterOneViewing && 'S'} DONE
                </Text>
                {greaterOneViewing && (
                  <Text style={styles.countStyle}>{`${viewingDoneCount.length}`}</Text>
                )}
              </TouchableOpacity>
            )}
            {/* } */}
          </View>
        )
      }
    } else {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            height: 30,
            borderBottomEndRadius: 10,
            borderBottomLeftRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (leadAssignedSharedStatus) {
              this.openModal()
              this.setProperty(property)
            }
          }}
        >
          <Text
            style={{
              color: AppStyles.colors.primaryColor,
              fontFamily: AppStyles.fonts.defaultFont,
            }}
          >
            BOOK VIEWING
          </Text>
        </TouchableOpacity>
      )
    }
  }

  simplifyViewingData = (data) => {
    let simpleData = [...data]
    simpleData = simpleData.map((item, index) => {
      return {
        ...item,
        checkList: _.keys(JSON.parse(item.checkList)),
        isExpanded: data.length > 1 ? false : true,
        title: data.length > 1 ? `Details for Viewing 0${index + 1} ` : `Details for Viewing`,
      }
    })
    this.setState({ selectedViewingData: simpleData }, () => {
      this.toggleViewCheckList(true)
    })
  }

  toggleExpandable = (status, id) => {
    const { selectedViewingData } = this.state
    let copyViewingData = [...selectedViewingData]
    copyViewingData = copyViewingData.map((item) => {
      return item.id === id ? { ...item, isExpanded: status } : { ...item, isExpanded: false }
    })
    this.setState({ selectedViewingData: copyViewingData })
  }

  toggleViewCheckList = (value) => {
    this.setState({ viewCheckListModal: value })
  }

  bookAnotherViewing = (property) => {
    const { lead, user } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (leadAssignedSharedStatus) {
      this.openModal()
      this.setProperty(property)
    }
  }

  doneViewing = (property) => {
    const { user } = this.props
    const { selectedCheckList, userFeedback } = this.state
    if (property.diaries.length) {
      let diaries = property.diaries
      let diary = _.find(diaries, (item) => user.id === item.userId)
      if (
        diary.status === 'pending' &&
        (selectedCheckList.length === StaticData.areaManagerCheckList.length ) &&
        userFeedback !== '' &&
        userFeedback !== null
      ) {
        let checkList = {}
        selectedCheckList.map((item, index) => {
          checkList[item] = true
        })
        let stringifiedObj = JSON.stringify(checkList)
        let body = {
          status: 'completed',
          checkList: stringifiedObj,
          customer_feedback: userFeedback,
        }
        console.log('doneViewing: ', `/api/diary/update?id=${diary.id}`, body)
        axios
          .patch(`/api/diary/update?id=${diary.id}`, body)
          .then((res) => {
            this.setState({ loading: true })
            this.toggleCheckListModal(false, null)
            this.fetchProperties()
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        alert('Please fill the checklist and user feedback to continue!')
      }
    }
  }

  cancelViewing = (property) => {
    const { lead } = this.props
    if (property.diaries.length) {
      if (property.diaries[0].status === 'pending') {
        axios
          .delete(
            `/api/diary/delete?id=${property.diaries[0].id}&propertyId=${property.id}&leadId=${lead.id}`
          )
          .then((res) => {
            this.setState({ loading: true })
            helper.deleteLocalNotification(property.diaries[0].id)
            this.fetchProperties()
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }

  deleteProperty = (property) => {
    axios
      .delete(`/api/leads/shortlisted?id=${property.id}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.message) {
            helper.errorToast(res.data.message)
          } else {
            this.setState({ loading: true })
            this.fetchProperties()
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: this.props.lead.purpose,
      isFromLeadWorkflow: true,
      fromScreen: 'viewing',
    })
  }

  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = () => {
    const { lead } = this.props
    axios.get(`/api/diary/all?armsLeadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data.rows })
    })
  }

  goToPropertyScreen = () => {
    const { lead, navigation } = this.props
    navigation.navigate('AddInventory', {
      lead: lead,
      screenName: 'leadViewing',
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', {
      propertyId: data.id,
      screenName: 'viewing',
      leadId: lead.id,
    })
  }

  toggleMenu = (val, id) => {
    const { matchData } = this.state
    let newMatches = matchData.map((item) => {
      if (item.id === id) {
        item.checkBox = val
        return item
      } else return item
    })
    this.setState({ matchData: newMatches })
  }

  addProperty = (data) => {
    this.redirectProperty(data)
  }

  redirectProperty = (property) => {
    if (property.origin === 'arms' || property.origin === 'arms_lead') {
      if (this.ownProperty(property))
        this.props.navigation.navigate('PropertyDetail', {
          property: property,
          update: true,
          screen: 'LeadDetail',
        })
      else helper.warningToast(`You cannot view other agent's property details!`)
    } else {
      let url = `${config.graanaUrl}/property/${property.graana_id}`
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) helper.errorToast(`No application available open this Url`)
          else return Linking.openURL(url)
        })
        .catch((err) => console.error('An error occurred', err))
    }
  }

  handleCheckListSelection = (item) => {
    if (this.state.selectedCheckList.includes(item)) {
      let temp = this.state.selectedCheckList
      delete temp[temp.indexOf(item)]
      this.setState({ selectedCheckList: temp })
    } else {
      let temp = this.state.selectedCheckList
      temp.push(item)
      this.setState({ selectedCheckList: temp })
    }
  }

  render() {
    const {
      menuShow,
      meetings,
      callModal,
      loading,
      matchData,
      isVisible,
      checkValidation,
      viewing,
      progressValue,
      updateViewing,
      isMenuVisible,
      reasons,
      selectedReason,
      isCloseLeadVisible,
      checkReasonValidation,
      closedLeadEdit,
      addLoading,
      isCheckListModalVisible,
      selectedCheckList,
      userFeedback,
      selectedViewingData,
      viewCheckListModal,
    } = this.state
    const { lead, user, navigation } = this.props
    const showMenuItem = helper.checkAssignedSharedStatus(user, lead)

    return !loading ? (
      <View style={{ flex: 1 }}>
        <View>
          <ProgressBar
            style={{ backgroundColor: 'ffffff' }}
            progress={progressValue}
            color={'#0277FD'}
          />
        </View>
        <HistoryModal
          getCallHistory={this.getCallHistory}
          navigation={navigation}
          data={meetings}
          closePopup={this.goToHistory}
          openPopup={callModal}
        />
        <CheckListModal data={StaticData.areaManagerCheckList}
          selectedCheckList={selectedCheckList}
          isVisible={isCheckListModalVisible}
          togglePopup={(val) => this.toggleCheckListModal(val)}
          setSelected={(item) => this.handleCheckListSelection(item)}
          userFeedback={userFeedback}
          setUserFeedback={(value) => this.setState({ userFeedback: value })}
          viewingDone={() => this.doneViewing(this.state.currentProperty)}
          loading={loading}
        />

        <ViewCheckListModal
          viewCheckList={viewCheckListModal}
          toggleViewCheckList={(value) => this.toggleViewCheckList(value)}
          selectedViewingData={selectedViewingData}
          toggleExpandable={(status, id) => this.toggleExpandable(status, id)}
        />
        <View
          style={[
            AppStyles.container,
            styles.container,
            { backgroundColor: AppStyles.colors.backgroundColor },
          ]}
        >
          <View style={{ paddingBottom: 100 }}>
            <AddViewing
              update={updateViewing}
              onPress={this.submitViewing}
              handleForm={this.handleForm}
              openModal={this.openModal}
              loading={addLoading}
              viewing={viewing}
              checkValidation={checkValidation}
              isVisible={isVisible}
            />
            {matchData.length !== 0 ? (
              <FlatList
                data={_.clone(matchData)}
                renderItem={(item, index) => (
                  <View style={{ marginVertical: 3 }}>
                    {this.ownProperty(item.item) ? (
                      <MatchTile
                        bookAnotherViewing={this.bookAnotherViewing}
                        deleteProperty={this.deleteProperty}
                        cancelViewing={this.cancelViewing}
                        toggleCheckListModal={(toggleState, data) =>
                          this.toggleCheckListModal(toggleState, data)
                        }
                        isMenuVisible={showMenuItem && isMenuVisible}
                        data={_.clone(item.item)}
                        user={user}
                        displayChecks={this.displayChecks}
                        showCheckBoxes={false}
                        addProperty={this.addProperty}
                        viewingMenu={true}
                        goToPropertyComments={this.goToPropertyComments}
                        menuShow={menuShow}
                        toggleMenu={this.toggleMenu}
                        screen={'viewing'}
                      />
                    ) : (
                      <AgentTile
                        bookAnotherViewing={this.bookAnotherViewing}
                        deleteProperty={this.deleteProperty}
                        cancelViewing={this.cancelViewing}
                        toggleCheckListModal={(toggleState, data) =>
                          this.toggleCheckListModal(toggleState, data)
                        }
                        isMenuVisible={showMenuItem && isMenuVisible}
                        data={_.clone(item.item)}
                        user={user}
                        displayChecks={this.displayChecks}
                        showCheckBoxes={false}
                        addProperty={this.addProperty}
                        viewingMenu={true}
                        goToPropertyComments={this.goToPropertyComments}
                        menuShow={menuShow}
                        toggleMenu={this.toggleMenu}
                        screen={'viewing'}
                      />
                    )}
                    <View>{this.checkStatus(item.item)}</View>
                  </View>
                )}
                keyExtractor={(item, index) => item.id.toString()}
              />
            ) : (
              <>
                <Image
                  source={require('../../../assets/img/no-result-found.png')}
                  resizeMode={'center'}
                  style={{ alignSelf: 'center', width: 300, height: 300 }}
                />
              </>
            )}
          </View>
        </View>

        <View style={AppStyles.mainCMBottomNav}>
          <CMBottomNav
            goToAttachments={this.goToAttachments}
            navigateTo={this.navigateToDetails}
            goToDiaryForm={this.goToDiaryForm}
            goToComments={this.goToComments}
            alreadyClosedLead={() => this.closedLead()}
            closeLead={this.closeLead}
            closedLeadEdit={closedLeadEdit}
            callButton={true}
            customer={lead.customer}
            lead={lead}
            goToHistory={this.goToHistory}
            goToPropertyScreen={this.goToPropertyScreen}
            getCallHistory={this.getCallHistory}
            isFromViewingScreen={true}
          />
        </View>
        <LeadRCMPaymentPopup
          reasons={reasons}
          selectedReason={selectedReason}
          changeReason={(value) => this.handleReasonChange(value)}
          checkValidation={checkReasonValidation}
          isVisible={isCloseLeadVisible}
          closeModal={() => this.closeModal()}
          onPress={() => this.onHandleCloseLead()}
        />
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(LeadViewing)
