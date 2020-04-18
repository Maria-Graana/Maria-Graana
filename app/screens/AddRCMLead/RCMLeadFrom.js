import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './style';
import AppStyles from '../../AppStyles';
import InnerRCMForm from './innerRCMForm'
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';

class CMLeadFrom extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formType: 'buy'
    }
  }

  componentDidMount() { }



  render() {
    const {
      formType,
      changeStatus,
      formData,
      handleForm,
      getClients,
      cities,
      propertyType,
      subType,
      sizeUnit,
      size,
      formSubmit,
      checkValidation,
      handleAreaClick
    } = this.props
    const checkBuy = formType === 'sale'
    const checkRent = formType === 'rent'
    return (
      <View>
        <View style={[styles.multiButton]}>
          <TouchableOpacity style={[AppStyles.flexOne, styles.buttonDesign, checkBuy && styles.activeBtn]} onPress={() => { changeStatus('sale') }}>
            <Text style={[styles.textCenter, checkBuy && styles.textBold]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[AppStyles.flexOne, styles.buttonDesign, checkRent && styles.activeBtn]} onPress={() => { changeStatus('rent') }}>
            <Text style={[styles.textCenter, checkRent && styles.textBold]}>Rent</Text>
          </TouchableOpacity>
        </View>

        {/* *********** Main Container *********** */}
        <View style={[AppStyles.container]}>
          <InnerRCMForm
            formData={formData}
            handleForm={handleForm}
            getClients={getClients}
            cities={cities}
            propertyType={propertyType}
            subType={subType}
            sizeUnit={sizeUnit}
            size={size}
            formSubmit={formSubmit}
            checkValidation={checkValidation}
            handleAreaClick={handleAreaClick}
          />
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

export default connect(mapStateToProps)(CMLeadFrom)

