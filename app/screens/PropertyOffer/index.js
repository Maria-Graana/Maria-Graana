/** @format */

import axios from 'axios'
import * as React from 'react'
import { Alert } from 'react-native'
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import OfferModal from '../../components/OfferModal'
import PropAgentTile from '../../components/PropAgentTile/index'
import PropertyBottomNav from '../../components/PropertyBottomNav'
import PropMatchTile from '../../components/PropMatchTile/index'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'

class PropertyOffer extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead, permissions } = this.props
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
      closedLeadEdit: helper.propertyCheckAssignedSharedStatus(user, lead, permissions),
      callModal: false,
      meetings: [],
      matchData: [],
      menuShow: false,
      btnLoading: false,
      showWarning: false,
      customerNotZero: false,
      sellerNotZero: false,
      agreedNotZero: false,
      offerReadOnly: false,
      active: false,
      isFollowUpMode: false,
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchLead()
      this.fetchProperties()
    })
  }

  fetchProperties = () => {
    const { lead, user } = this.props
    const { rcmProgressBar } = StaticData
    let matches = []
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((res) => {
        matches = helper.propertyIdCheck(res.data.rows, user)
        this.setState({
          disableButton: false,
          loading: false,
          matchData: matches,
          progressValue: rcmProgressBar[lead.status],
          offerReadOnly: false,
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
        btnLoading: false,
        showWarning: false,
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
    leadData[name] = value
    console.log('handleForm: ', value, name)
    this.setState({ leadData, agreedNotZero: false, sellerNotZero: false, customerNotZero: false })
  }

  // ************** types will be seller an customer... customer= lead agent, seller= property agent ****************
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
    const { leadData, currentProperty } = this.state
    const { lead } = this.props
    if (leadData.customer && leadData.customer !== '') {
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
    const { leadData, currentProperty } = this.state
    const { lead } = this.props
    if (leadData.seller && leadData.seller !== '') {
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
    // helper.leadClosedToast()
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
      screenName: 'Diary',
    })
  }

  goToAttachments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('LeadAttachments', { rcmLeadId: lead.id, workflow: 'propertyLeads' })
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
    const { lead, user, permissions } = this.props
    let leadAssignedSharedStatus = helper.propertyCheckAssignedSharedStatus(user, lead, permissions)
    const leadAssignedSharedStatusAndReadOnly = helper.checkAssignedSharedStatusANDReadOnly(
      user,
      lead
    )
    leadAssignedSharedStatus = true
    if (property.agreedOffer.length) {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: AppStyles.colors.primaryColor,
            height: 30,
            borderBottomEndRadius: 10,
            borderBottomLeftRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            this.openOfferModalReadOnly()
            this.setProperty(property)
          }}
        >
          <Text style={{ color: 'white', fontFamily: AppStyles.fonts.lightFont }}>
            Agreed Amount:{' '}
            <Text style={{ fontFamily: AppStyles.fonts.defaultFont }}>
              {property && property.agreedOffer[0].offer}
            </Text>
          </Text>
        </TouchableOpacity>
      )
    } else if (property.leadOffers.length) {
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
              this.openChatModal()
              this.setProperty(property)
            }
          }}
        >
          <Text style={{ fontFamily: AppStyles.fonts.lightFont }}>
            View{' '}
            <Text
              style={{
                color: AppStyles.colors.primaryColor,
                fontFamily: AppStyles.fonts.defaultFont,
              }}
            >
              Offers
            </Text>
          </Text>
        </TouchableOpacity>
      )
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
              this.openChatModal()
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
            {' '}
            PLACE OFFER
          </Text>
        </TouchableOpacity>
      )
    }
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: 'property',
      isFromLeadWorkflow: true,
      fromScreen: 'offer',
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', { propertyId: data.id, screenName: 'offer', leadId: lead.id })
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
    const { leadData, currentProperty } = this.state
    const { lead } = this.props
    if (leadData.agreed && leadData.agreed !== '') {
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

  acceptOffer = (offerId, currentProperty) => {
    const { lead } = this.props
    axios
      .patch(
        `/api/offer/agree?leadId=${lead.id}&offerId=${offerId}&shortlistedPropId=${currentProperty.id}&addedBy=seller`
      )
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

  showConfirmationDialog(offerId, currentProperty) {
    Alert.alert(
      'Accept Offer',
      'Are you sure you want to accept this offer?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => this.setState({ disableButton: true, btnLoading: false }),
        },
        { text: 'Yes', onPress: () => this.acceptOffer(offerId, currentProperty) },
      ],
      { cancelable: false }
    )
  }

  agreedAmount = (value) => {
    const { offerChat, currentProperty } = this.state
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
        this.showConfirmationDialog(offerId, currentProperty)
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
      active,
      isFollowUpMode,
    } = this.state
    const { lead, navigation, user } = this.props
    const showBuyerSide = helper.setBuyerAgent(lead, 'sellerSide', user)
    const showSellerSide = helper.setSellerAgent(lead, currentProperty, 'sellerSide', user)
    // console.log('Property showBuyerSide: ', showBuyerSide)
    // console.log('Property showSellerSide: ', showSellerSide)

    return !loading ? (
      <View style={{ flex: 1 }}>
        <ProgressBar
          style={{ backgroundColor: 'ffffff' }}
          progress={progressValue}
          color={'#0277FD'}
        />
        {/* <HistoryModal
          getCallHistory={this.getCallHistory}
          navigation={navigation}
          data={meetings}
          closePopup={this.goToHistory}
          openPopup={callModal}
        /> */}
        <View
          style={[
            AppStyles.container,
            styles.container,
            { backgroundColor: AppStyles.colors.backgroundColor },
          ]}
        >
          <View style={{ paddingBottom: 100 }}>
            {matchData.length ? (
              <View>
                <FlatList
                  data={_.clone(matchData)}
                  renderItem={(item, index) => (
                    <View style={{ marginVertical: 3 }}>
                      {this.ownProperty(item.item) ? (
                        <PropMatchTile
                          data={_.clone(item.item)}
                          user={user}
                          displayChecks={this.displayChecks}
                          showCheckBoxes={false}
                          addProperty={this.addProperty}
                          isMenuVisible={true}
                          viewingMenu={false}
                          goToPropertyComments={this.goToPropertyComments}
                          toggleMenu={this.toggleMenu}
                          menuShow={menuShow}
                          screen={'offer'}
                        />
                      ) : (
                        <PropAgentTile
                          data={_.clone(item.item)}
                          user={user}
                          displayChecks={this.displayChecks}
                          showCheckBoxes={false}
                          addProperty={this.addProperty}
                          isMenuVisible={true}
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
                  showBuyerSide={showBuyerSide}
                  showSellerSide={showSellerSide}
                />
              </View>
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
          <MeetingFollowupModal
            closeModal={() => this.closeMeetingFollowupModal()}
            active={active}
            isFollowUpMode={isFollowUpMode}
            lead={lead}
            leadType={'RCM'}
          />
          <PropertyBottomNav
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
            goToHistory={() => null}
            getCallHistory={() => null}
            goToFollowUp={(value) => this.openModalInFollowupMode(value)}
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
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(PropertyOffer)
