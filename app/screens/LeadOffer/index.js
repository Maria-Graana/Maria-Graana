/** @format */

import axios from 'axios'
import * as React from 'react'
import { Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import AgentTile from '../../components/AgentTile/index'
import CMBottomNav from '../../components/CMBottomNav'
import HistoryModal from '../../components/HistoryModal/index'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import MatchTile from '../../components/MatchTile/index'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import OfferModal from '../../components/OfferModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import SubmitFeedbackOptionsModal from '../../components/SubmitFeedbackOptionsModal'
import GraanaPropertiesModal from '../../components/GraanaPropertiesStatusModal'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './styles'

import NoRecordFound from './../../components/NoRecordFound'
class LeadOffer extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead, permissions, shortlistedData } = this.props
    this.state = {
      open: false,
      loading: true,
      modalActive: false,
      offersData: [],
      leadData: {
        customer: '',
        seller: '',
        agreed: '',
      },
      currentProperty: {},
      progressValue: 0,
      disableButton: false,
      // for the lead close dialog
      isCloseLeadVisible: false,
      checkReasonValidation: false,
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead, permissions, shortlistedData),
      callModal: false,
      meetings: [],
      matchData: [],
      menuShow: false,
      showWarning: false,
      customerNotZero: false,
      sellerNotZero: false,
      agreedNotZero: false,
      offerReadOnly: false,
      legalDocLoader: false,
      active: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      currentCall: null,
      isFollowUpMode: false,
      closedWon: false,
      comment: null,
      sellerNotNumeric: false,
      customerNotNumeric: false,
      agreedNotNumeric: false,
      newActionModal: false,
      graanaModalActive: false,
      singlePropertyData: {},
      forStatusPrice: false,
      formData: {
        amount: '',
      },
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchLegalPaymentInfo()
      this.fetchLead()
      this.getCallHistory()
      this.fetchProperties()
    })
  }

  fetchProperties = () => {
    const { lead } = this.props
    const { rcmProgressBar } = StaticData
    let matches = []
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((res) => {
        matches = helper.propertyIdCheck(res.data.rows)
        this.setState({
          disableButton: false,
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
  }

  fetchLead = () => {
    const { lead } = this.props
    axios
      .get(`api/leads/byid?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
        this.closeLead(res.data)
      })
      .catch((error) => {
        console.log(error)
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

  openChatModal = () => {
    const { modalActive } = this.state
    this.setState(
      {
        modalActive: !modalActive,
        showWarning: false,
        offerReadOnly: false,
      },
      () => {
        if (!this.state.modalActive) {
          this.fetchLead()
          this.fetchProperties()
        }
      }
    )
  }

  setProperty = (property) => {
    this.setState({ currentProperty: property }, () => {
      this.fetchOffers()
    })
  }

  handleForm = (value, name) => {
    const { leadData } = this.state
    let copySellerNotNumeric = false
    let copycustomerNotNumeric = false
    let copyAgreedNotNumeric = false
    leadData[name] = value
    if (name === 'seller' && /^\d+$/.test(value) == false) copySellerNotNumeric = true
    if (name === 'customer' && /^\d+$/.test(value) == false) copycustomerNotNumeric = true
    if (name === 'agreed' && /^\d+$/.test(value) == false) copyAgreedNotNumeric = true
    this.setState({
      leadData,
      agreedNotZero: false,
      sellerNotZero: false,
      customerNotZero: false,
      sellerNotNumeric: copySellerNotNumeric,
      customerNotNumeric: copycustomerNotNumeric,
      agreedNotNumeric: copyAgreedNotNumeric,
    })
  }

  fetchOffers = () => {
    const { currentProperty } = this.state
    const { lead } = this.props
    axios
      .get(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`)
      .then((res) => {
        this.setState({
          offerChat: res.data.rows,
          disableButton: false,
          leadData: { customer: '', seller: '', agreed: '' },
          showWarning: false,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  placeCustomerOffer = () => {
    const { leadData, currentProperty, customerNotNumeric } = this.state
    const { lead } = this.props
    if (leadData.customer && leadData.customer !== '' && !customerNotNumeric) {
      if (Number(leadData.customer) <= 0) {
        this.setState({
          customerNotZero: true,
        })
        return
      }
      let body = {
        offer: leadData.customer,
        type: 'customer',
      }
      this.setState({ disableButton: true })
      axios
        .post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
        .then((res) => {
          this.fetchOffers()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  placeSellerOffer = () => {
    const { leadData, currentProperty, sellerNotNumeric } = this.state
    const { lead } = this.props
    if (leadData.seller && leadData.seller !== '' && !sellerNotNumeric) {
      if (Number(leadData.seller) <= 0) {
        this.setState({
          sellerNotZero: true,
        })
        return
      }
      let body = {
        offer: leadData.seller,
        type: 'seller',
      }
      this.setState({ disableButton: true })
      axios
        .post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
        .then((res) => {
          this.fetchOffers()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  closedLead = () => {
    helper.leadClosedToast()
  }

  fetchLegalPaymentInfo = () => {
    this.setState({ loading: true }, () => {
      axios.get(`/api/leads/legalPayment`).then((res) => {
        this.setState({
          legalServicesFee: res.data,
        })
      })
    })
  }

  closeLead = async (lead) => {
    const { legalServicesFee } = this.state
    if (lead.commissions.length) {
      let legalDocResp = await this.getLegalDocumentsCount()
      if (helper.checkClearedStatuses(lead, legalDocResp, legalServicesFee)) {
        this.setState({
          closedWon: true,
        })
      }
    }
  }

  getLegalDocumentsCount = async () => {
    const { lead } = this.props
    this.setState({ legalDocLoader: true })
    try {
      let res = await axios.get(`api/legal/document/count?leadId=${lead.id}`)
      return res.data
    } catch (error) {
      console.log(`ERROR: api/legal/document/count?leadId=${lead.id}`, error)
    }
  }

  onHandleCloseLead = () => {
    const { navigation, lead } = this.props
    let payload = Object.create({})
    payload.reasons = 'payment_done'
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.setState({ isVisible: false }, () => {
          helper.successToast(`Lead Closed`)
          navigation.navigate('Leads')
        })
      })
      .catch((error) => {
        console.log(error)
      })
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
      screenName: 'Diary',
    })
  }

  goToAttachments = (purpose) => {
    const { lead, navigation } = this.props
    navigation.navigate('LeadAttachments', {
      rcmLeadId: lead.id,
      workflow: 'rcm',
      purpose: purpose,
    })
  }

  goToComments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  openOfferModalReadOnly = () => {
    const { modalActive } = this.state
    this.setState(
      {
        modalActive: !modalActive,
        showWarning: false,
        offerReadOnly: true,
      },
      () => {
        if (!this.state.modalActive) {
          this.fetchLead()
          this.fetchProperties()
        }
      }
    )
  }

  checkStatus = (property) => {
    const { lead, user, permissions, shortlistedData } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(
      user,
      lead,
      permissions,
      shortlistedData
    )
    const leadAssignedSharedStatusAndReadOnly = helper.checkAssignedSharedStatusANDReadOnly(
      user,
      lead,
      shortlistedData
    )
    if (property.agreedOffer.length) {
      return (
        <TouchableOpacity
          style={styles.tileAgreedBtn}
          onPress={() => {
            if (leadAssignedSharedStatusAndReadOnly) {
              this.openOfferModalReadOnly()
              this.setProperty(property)
            }
          }}
        >
          <Text style={styles.agreedText}>
            Agreed Amount:{' '}
            <Text style={styles.offerText}>
              {property && helper.currencyConvert(property.agreedOffer[0].offer)}
            </Text>
          </Text>
        </TouchableOpacity>
      )
    } else if (property.leadOffers.length) {
      return (
        <TouchableOpacity
          style={styles.tileOfferBtn}
          onPress={() => {
            if (leadAssignedSharedStatus) {
              this.openChatModal()
              this.setProperty(property)
            }
          }}
        >
          <Text style={styles.viewText}>
            View <Text style={styles.offerViewText}>Offers</Text>
          </Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={styles.tileBtn}
          onPress={() => {
            if (leadAssignedSharedStatus) {
              this.openChatModal()
              this.setProperty(property)
            }
          }}
        >
          <Text style={styles.tileText}> PLACE OFFER</Text>
        </TouchableOpacity>
      )
    }
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: this.props.lead.purpose,
      isFromLeadWorkflow: true,
      fromScreen: 'offer',
    })
  }

  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = () => {
    const { lead } = this.props
    axios.get(`/api/leads/tasks?rcmLeadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data })
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', {
      propertyId: data.id,
      screenName: 'offer',
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

  placeAgreedOffer = () => {
    const { leadData, currentProperty, agreedNotNumeric } = this.state
    if (leadData.agreed && leadData.agreed !== '' && !agreedNotNumeric) {
      if (Number(leadData.agreed) <= 0) {
        this.setState({
          agreedNotZero: true,
        })
        return
      }
      this.setState({ disableButton: true, btnLoading: true }, () => {
        this.showDialogOfferConfirmation(currentProperty, leadData)
      })
    }
  }

  showDialogOfferConfirmation(currentProperty, leadData) {
    const { lead } = this.props
    Alert.alert(
      'Agreed Amount',
      'Are you sure you want to continue?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => this.setState({ disableButton: false, btnLoading: false }),
        },
        {
          text: 'Yes',
          onPress: () => {
            let body = {
              offer: leadData.agreed,
              type: 'agreed',
            }
            axios
              .post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
              .then((res) => {
                this.openChatModal()
              })
              .catch((error) => {
                console.log(error)
              })
          },
        },
      ],
      { cancelable: false }
    )
  }

  acceptOffer = (offerId) => {
    const { lead } = this.props
    axios
      .patch(`/api/offer/agree?leadId=${lead.id}&offerId=${offerId}&addedBy=buyer`)
      .then((res) => {
        if (res.data.msg) {
          helper.errorToast(res.data.msg)
        } else {
          this.openChatModal()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  agreedAmount = (value) => {
    const { offerChat, currentProperty, offerReadOnly } = this.state
    const { lead } = this.props
    let offer = []
    let offerId = null
    if (offerChat) {
      if (value === 'showSeller') {
        offerChat.map((item) => {
          if (item.from === 'customer') {
            offer.push(item)
          }
        })
      } else {
        offerChat.map((item) => {
          if (item.from === 'seller') {
            offer.push(item)
          }
        })
      }
      this.setState({ disableButton: true, btnLoading: false })
      if (offer && offer.length) {
        offerId = offer[offer.length - 1].id
        this.showConfirmationDialog(offerId)
      } else {
        this.setState({ showWarning: true, disableButton: false })
        helper.warningToast('Please enter an agreed amount')
      }
    } else {
      this.setState({ showWarning: true, disableButton: false })
      helper.warningToast('Please enter an agreed amount')
    }
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

  showConfirmationDialog(offerId) {
    Alert.alert(
      'Accept Offer',
      'Are you sure you want to accept this offer?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => this.setState({ disableButton: false, btnLoading: false }),
        },
        { text: 'Yes', onPress: () => this.acceptOffer(offerId) },
      ],
      { cancelable: false }
    )
  }

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }

  //  ************ Function for open Follow up modal ************
  openModalInFollowupMode = (value) => {
    const { navigation, lead } = this.props

    navigation.navigate('ScheduledTasks', {
      taskType: 'follow_up',
      lead,
      rcmLeadId: lead ? lead.id : null,
    })
    // this.setState({
    //   active: !this.state.active,
    //   isFollowUpMode: true,
    //   comment: value,
    // })
  }

  // ************ Function for Reject modal ************
  goToRejectForm = () => {
    const { statusfeedbackModalVisible } = this.state
    this.setState({
      statusfeedbackModalVisible: !statusfeedbackModalVisible,
      modalMode: 'reject',
    })
  }

  rejectLead = (body) => {
    const { navigation, lead } = this.props
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, body, { params: { id: leadId } })
      .then((res) => {
        helper.successToast(`Lead Closed`)
        navigation.navigate('Leads')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  showStatusFeedbackModal = (value, modalType) => {
    this.setState({ statusfeedbackModalVisible: value, modalType })
  }

  goToViewingScreen = () => {
    const { navigation } = this.props
    navigation.navigate('RCMLeadTabs', { screen: 'Viewing' })
  }

  setNewActionModal = (value) => {
    this.setState({ newActionModal: value })
  }
  submitGraanaStatusAmount = (check) => {
    const { singlePropertyData, formData } = this.state
    var endpoint = ''
    var body = {
      amount: formData.amount,
      propertyType: singlePropertyData.property ? 'graana' : 'arms',
    }
    console.log(body)
    if (body.propertyType === 'graana') {
      // // for graana properties
      endpoint = `api/inventory/verifyProperty?id=${singlePropertyData.property.id}`
    } else {
      // for arms properties
      endpoint = `api/inventory/verifyProperty?id=${singlePropertyData.armsProperty.id}`
    }
    formData['amount'] = ''
    axios.patch(endpoint, body).then((res) => {
      this.setState(
        {
          forStatusPrice: false,
          graanaModalActive: false,
          formData,
        },
        () => {
          this.fetchProperties()
          helper.successToast(res.data)
        }
      )
    })
  }
  graanaVerifeyModal = (status, id) => {
    const { matchData } = this.state
    if (status === true) {
      var filterProperty = matchData.find((item) => {
        return item.id === id && item
      })
      this.setState({
        singlePropertyData: filterProperty,
        graanaModalActive: status,
        forStatusPrice: false,
      })
    } else {
      this.setState({
        graanaModalActive: status,
        forStatusPrice: false,
      })
    }
  }
  verifyStatusSubmit = (data, graanaStatus) => {
    if (graanaStatus === 'sold') {
      this.setState({
        forStatusPrice: true,
      })
    } else if (graanaStatus === 'rented') {
      this.setState({
        forStatusPrice: true,
      })
    } else {
      this.submitGraanaStatusAmount('other')
    }
  }
  handleFormVerification = (value, name) => {
    const { formData } = this.state
    const newFormData = formData
    newFormData[name] = value
    this.setState({ formData: newFormData })
  }

  render() {
    const {
      menuShow,
      meetings,
      callModal,
      loading,
      matchData,
      modalActive,
      offersData,
      offerChat,
      open,
      progressValue,
      disableButton,
      leadData,
      reasons,
      selectedReason,
      isCloseLeadVisible,
      checkReasonValidation,
      closedLeadEdit,
      currentProperty,
      btnLoading,
      showWarning,
      agreedNotZero,
      sellerNotZero,
      customerNotZero,
      offerReadOnly,
      legalDocLoader,
      active,
      statusfeedbackModalVisible,
      isFollowUpMode,
      modalMode,
      closedWon,
      sellerNotNumeric,
      customerNotNumeric,
      agreedNotNumeric,
      newActionModal,
      graanaModalActive,
      singlePropertyData,
      forStatusPrice,
      formData,
    } = this.state
    const { lead, navigation, user, permissions, shortlistedData } = this.props
    const showMenuItem = helper.checkAssignedSharedStatus(user, lead, permissions, shortlistedData)
    const showBuyerSide = helper.setBuyerAgent(lead, 'buyerSide', user)
    const showSellerSide = helper.setSellerAgent(lead, currentProperty, 'buyerSide', user)

    return !loading ? (
      <View style={{ flex: 1 }}>
        <ProgressBar
          style={{ backgroundColor: 'ffffff' }}
          progress={progressValue}
          color={'#0277FD'}
        />
        <HistoryModal
          getCallHistory={this.getCallHistory}
          navigation={navigation}
          data={meetings}
          closePopup={this.goToHistory}
          openPopup={callModal}
        />
        <View
          style={[
            AppStyles.container,
            { backgroundColor: AppStyles.colors.backgroundColor, marginBottom: 65 },
          ]}
        >
          {matchData.length ? (
            <FlatList
              data={_.clone(matchData)}
              renderItem={(item, index) => (
                <View style={{ marginVertical: 3 }}>
                  {this.ownProperty(item.item) ? (
                    <MatchTile
                      data={_.clone(item.item)}
                      user={user}
                      displayChecks={this.displayChecks}
                      showCheckBoxes={false}
                      addProperty={this.addProperty}
                      isMenuVisible={showMenuItem}
                      viewingMenu={false}
                      goToPropertyComments={this.goToPropertyComments}
                      toggleMenu={this.toggleMenu}
                      menuShow={menuShow}
                      screen={'offer'}
                      graanaVerifeyModal={this.graanaVerifeyModal}
                    />
                  ) : (
                    <AgentTile
                      data={_.clone(item.item)}
                      user={user}
                      displayChecks={this.displayChecks}
                      showCheckBoxes={false}
                      addProperty={this.addProperty}
                      isMenuVisible={showMenuItem}
                      viewingMenu={false}
                      goToPropertyComments={this.goToPropertyComments}
                      toggleMenu={this.toggleMenu}
                      menuShow={menuShow}
                      screen={'offer'}
                    />
                  )}
                  <View>{this.checkStatus(item.item)}</View>
                </View>
              )}
              keyExtractor={(item, index) => item.id.toString()}
            />
          ) : (
            <>
              <NoRecordFound />
            </>
          )}
        </View>
        <OfferModal
          showWarning={showWarning}
          agreedAmount={this.agreedAmount}
          loading={btnLoading}
          user={user}
          property={currentProperty}
          lead={lead}
          leadData={leadData}
          offersData={offersData}
          active={modalActive}
          offerChat={offerChat}
          placeCustomerOffer={this.placeCustomerOffer}
          placeSellerOffer={this.placeSellerOffer}
          placeAgreedOffer={this.placeAgreedOffer}
          handleForm={this.handleForm}
          disableButton={disableButton}
          openModal={this.openChatModal}
          agreedNotZero={agreedNotZero}
          sellerNotZero={sellerNotZero}
          customerNotZero={customerNotZero}
          offerReadOnly={offerReadOnly}
          sellerNotNumeric={sellerNotNumeric}
          customerNotNumeric={customerNotNumeric}
          agreedNotNumeric={agreedNotNumeric}
          showBuyerSide={showBuyerSide}
          showSellerSide={showSellerSide}
        />
        <StatusFeedbackModal
          visible={statusfeedbackModalVisible}
          showFeedbackModal={(value, modalMode) => this.showStatusFeedbackModal(value, modalMode)}
          commentsList={
            modalMode === 'call'
              ? StaticData.commentsFeedbackCall
              : StaticData.leadClosedCommentsFeedback
          }
          modalMode={modalMode}
          rejectLead={(body) => this.rejectLead(body)}
          setNewActionModal={(value) => this.setNewActionModal(value)}
          leadType={'RCM'}
        />
        <GraanaPropertiesModal
          active={graanaModalActive}
          data={singlePropertyData}
          forStatusPrice={forStatusPrice}
          formData={formData}
          handleForm={this.handleFormVerification}
          graanaVerifeyModal={this.graanaVerifeyModal}
          submitStatus={this.verifyStatusSubmit}
          submitGraanaStatusAmount={this.submitGraanaStatusAmount}
        />
        <SubmitFeedbackOptionsModal
          showModal={newActionModal}
          modalMode={modalMode}
          setShowModal={(value) => this.setNewActionModal(value)}
          performFollowUp={this.openModalInFollowupMode}
          performReject={this.goToRejectForm}
          //call={this.callAgain}
          goToViewingScreen={this.goToViewingScreen}
          leadType={'RCM'}
        />
        <MeetingFollowupModal
          closeModal={() => this.closeMeetingFollowupModal()}
          active={active}
          isFollowUpMode={isFollowUpMode}
          lead={lead}
          leadType={'RCM'}
          getMeetingLead={this.getCallHistory}
        />
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
            getCallHistory={this.getCallHistory}
            goToFollowUp={(value) => this.openModalInFollowupMode(value)}
            navigation={navigation}
            showStatusFeedbackModal={(value, modalType) =>
              this.showStatusFeedbackModal(value, modalType)
            }
            leadType={'RCM'}
            goToRejectForm={this.goToRejectForm}
            closedWon={closedWon}
            onHandleCloseLead={this.onHandleCloseLead}
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
          legalDocLoader={legalDocLoader}
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
    permissions: store.user.permissions,
    shortlistedData: store.drawer.shortlistedData,
  }
}

export default connect(mapStateToProps)(LeadOffer)
