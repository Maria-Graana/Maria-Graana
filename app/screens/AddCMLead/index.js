/** @format */

import React, { Component } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native'
import { StyleProvider } from 'native-base'
import CMLeadFrom from './CMLeadFrom'
import AppStyles from '../../AppStyles'
import getTheme from '../../../native-base-theme/components'
import formTheme from '../../../native-base-theme/variables/formTheme'
import { connect } from 'react-redux'
import helper from '../../helper'
import _ from 'underscore'
import { addEditCMLead, getAllProjects, setDefaultCMPayload } from '../../actions/cmLead'
import Loader from '../../components/loader'
import axios from 'axios'
import * as RootNavigation from '../../navigation/RootNavigation'

class AddCMLead extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkValidation: false,
      clientName: '',
      selectedClient: null,
      selectedCity: null,
      getProductType: [],
      loading: false,
    }
  }

  componentDidMount() {
    const { dispatch, navigation, route } = this.props
    dispatch(getAllProjects())
    if (route.params.update) {
      const { lead } = route.params
      navigation.setOptions({ title: 'EDIT LEAD' })
      if (lead && lead.project && lead.project.id) this.getProductType(lead.project.id)
      this.setEditValues()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { CMLead, route, dispatch } = this.props
    const { selectedCity, client, name } = route.params
    if (selectedCity && prevProps.CMLead.cityId !== selectedCity.value) {
      this.setState({ selectedCity }, () => {
        dispatch(addEditCMLead({ ...CMLead, cityId: selectedCity.value }))
      })
    }
    if (client && prevProps.CMLead.customerId !== client.id) {
      this.setClient()
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setDefaultCMPayload())
  }

  setEditValues = () => {
    const { route, CMLead, dispatch } = this.props
    const { lead = null, selectedCity, client, name } = route.params
    let copyObject = Object.assign({}, CMLead)
    copyObject.maxPrice = lead.maxPrice
      ? lead.maxPrice
      : StaticData.PricesProject[StaticData.PricesProject.length - 1]
    copyObject.minPrice = lead.minPrice ? lead.maxPrice : StaticData.PricesProject[0]
    copyObject.projectId = lead.project ? lead.project.id : ''
    copyObject.projectType = lead.projectType ? lead.projectType : ''
    copyObject.armsProjectTypeId = lead.productTypes ? String(lead.productTypes.id) : ''
    copyObject.customerId = client ? client.id : null
    copyObject.cityId = selectedCity ? selectedCity.value : null
    copyObject.description = lead.description ? lead.description : ''
    this.setState({ selectedCity, selectedClient: client, name }, () => {
      dispatch(addEditCMLead(copyObject))
    })
  }

  setClient = () => {
    const { CMLead, route, dispatch } = this.props
    const { client, name } = route.params
    if (client && name) {
      let phones = []
      if (client.customerContacts && client.customerContacts.length) {
        client.customerContacts.map((item) => {
          phones.push(item.phone)
        })
      } else {
        if (client && client.phone) {
          phones.push(client.phone)
        }
      }
      this.setState({ selectedClient: client, clientName: name }, () => {
        dispatch(
          addEditCMLead({
            ...CMLead,
            phones: phones,
            customerId: client ? client.id : null,
          })
        )
      })
    }
  }

  handleForm = (value, name) => {
    const { CMLead, dispatch } = this.props
    const { getProductType } = this.state
    let copyObject = { ...CMLead }
    copyObject[name] = value

    if (name === 'projectId') {
      this.getProductType(value)
    }

    if (name === 'projectType') {
      const getProName = getProductType.find((item) => {
        return item.value === value
      })
      copyObject['armsProjectTypeId'] = value
      copyObject['projectType'] = getProName.name
    }
    dispatch(addEditCMLead(copyObject))
  }

  formSubmit = () => {
    const { CMLead, investmentProjects, route } = this.props
    const { update = false, lead } = route.params

    if (!CMLead.customerId || !CMLead.cityId) {
      this.setState({
        checkValidation: true,
      })
    } else {
      if (CMLead.projectId && CMLead.projectId !== '') {
        let project = _.find(investmentProjects, function (item) {
          return item.value === CMLead.projectId
        })
        CMLead.projectName = project.name
      } else {
        CMLead.projectId = null
        CMLead.projectName = null
      }
      console.log(CMLead)
      this.setState({ loading: true }, () => {
        if (update) {
          // update lead
          axios
            .patch(`/api/leads/project/update/${lead.id}`, CMLead)
            .then((res) => {
              helper.successToast('Lead updated successfully')
              RootNavigation.navigate('Leads')
            })
            .catch((error) => {
              console.log(error)
              this.setState({ loading: false })
            })
        } else {
          // add lead

          axios
            .post(`/api/leads/project`, CMLead)
            .then((res) => {
              helper.successToast('Lead created successfully')
              RootNavigation.navigateToSpecificTab('Leads', 'Invest')
            })
            .catch((error) => {
              console.log(error)
              this.setState({ loading: false })
            })
        }
      })
    }
  }

  getProductType = async (id) => {
    const { investmentProjects } = this.props
    var getProType = _.pluck(
      _.filter(investmentProjects, (item) => item.value === id),
      'productType'
    )
    var getPro = []
    getProType[0].map((item) => {
      return getPro.push({ value: item.id.toString(), name: item.name })
    })
    this.setState({
      getProductType: getPro,
    })
    return getPro
  }

  render() {
    const {
      checkValidation,
      selectedCity,
      clientName,
      getProductType,
      loading,
      isPriceModalVisible,
    } = this.state
    const { route, investmentProjects, CMFormLoading } = this.props
    const { update = false } = route.params
    return CMFormLoading ? (
      <Loader loading={CMFormLoading} />
    ) : (
      <View style={[route.params.pageName === 'CM' && AppStyles.container]}>
        <StyleProvider style={getTheme(formTheme)}>
          <KeyboardAvoidingView enabled>
            <ScrollView keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                  <CMLeadFrom
                    navigation={this.props.navigation}
                    formSubmit={this.formSubmit}
                    checkValidation={checkValidation}
                    handleForm={this.handleForm}
                    clientName={clientName}
                    selectedCity={selectedCity}
                    getProject={investmentProjects}
                    getProductType={getProductType}
                    loading={loading}
                    update={update}
                    isPriceModalVisible={isPriceModalVisible}
                    setParentState={(obj) => {
                      this.setState(obj)
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
        </StyleProvider>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    CMFormLoading: store.cmLead.CMFormLoading,
    investmentProjects: store.cmLead.investmentProjects,
    CMLead: store.cmLead.CMLead,
  }
}

export default connect(mapStateToProps)(AddCMLead)
