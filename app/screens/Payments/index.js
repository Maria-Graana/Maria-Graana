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
    }

  }

  componentDidMount(){
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

  render() {
    const { getProject } = this.state
    return (
      <ScrollView>
        <View style={[AppStyles.container]}>
          <InnerForm 
          getFloor={StaticData.floors}
          getUnit={StaticData.units}
          getProject={getProject}
          getInstallments={StaticData.getInstallments}
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


