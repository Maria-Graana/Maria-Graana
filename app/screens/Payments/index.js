import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import axios from 'axios'
import styles from './style'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import InnerForm from './innerForm';
import StaticData from '../../StaticData';

class Payments extends Component {
  constructor(props) {
    super(props)

    this.state = {
      getProject: [],
      checkValidation: false,
      getUnit: [],
      getFloors: [],
      totalInstalments: [],
      formData: {
        projectId: '',
        floorId: '',
        unitId: '',
        token: '',
        commisionPayment: '',
        downPayment: '',
      },
      instalments: [],
    }

  }

  componentDidMount() {
    this.getAllProjects();
  }

  getAllProjects = () => {
    axios.get(`/api/project/all`)
      .then((res) => {
        let projectArray = [];
        res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name })) })
        this.setState({
          getProject: projectArray
        })
      })
  }

  getFloors = (id) => {
    axios.get(`/api/project/floors?projectId=${id}`)
      .then((res) => {
        let Array = [];
        res && res.data.rows.map((item, index) => { return (Array.push({ value: item.id, name: item.name })) })
        this.setState({
          getFloors: Array
        })
      })
  }

  getUnits = (projectId, floorId) => {
    axios.get(`/api/project/shops?projectId=${projectId}&floorId=${floorId}`)
      .then((res) => {
        let array = [];
        res && res.data.rows.map((item, index) => { return (array.push({ value: item.id, name: item.name })) })
        this.setState({
          getUnit: array
        })
      })
  }
  instalmentsField = (value) => {
    let array = []
    for(var i=1;i<= value;i++){
      array.push({instalments: ''})
    }
    this.setState({
      totalInstalments: array
    })
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    this.setState({ formData })

    if (name === 'projectId' && value != '') {
      this.getFloors(formData.projectId)
    }
    if (name === 'floorId' && value != '') {
      this.getUnits(formData.projectId, formData.floorId)
    }
    if (name === 'instalments' && value != '') {
      this.instalmentsField(value)
    }
  }

  handleInstalments = (value, index) => {
    const { totalInstalments } = this.state
    totalInstalments[index].instalments = value
    this.setState(totalInstalments)
  }

  formSubmit = () => {
    const { formData, totalInstalments } = this.state
    if(!formData.projectId || !formData.floorId || !formData.unitId || !formData.token || !formData.downPayment || !formData.commisionPayment){
      this.setState({
        checkValidation: true
      })
    }else{
      console.log(formData)
    }
  }

  render() {
    const { getProject, formData, getFloors, getUnit, totalInstalments, checkValidation } = this.state
    return (
      <ScrollView>
        <View style={[AppStyles.container]}>
          <InnerForm
            getFloor={getFloors}
            getUnit={getUnit}
            getProject={getProject}
            getInstallments={StaticData.getInstallments}
            formData={formData}
            totalInstalments={totalInstalments}
            checkValidation={checkValidation}
            handleInstalments={this.handleInstalments}
            handleForm={this.handleForm}
            formSubmit={this.formSubmit}
          />
        </View>
      </ScrollView>
    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(Payments)


