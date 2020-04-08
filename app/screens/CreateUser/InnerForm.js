import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';
import StaticData from '../../StaticData'

class InnerForm extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() { }

  render() {

    const {
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      cities,
      getClients,
      getProject,
    } = this.props

    return (
      <View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput onChangeText={(text) => { handleForm(text, 'maxPrice') }} style={[AppStyles.formControl]} name={'ownerNumber'} placeholder={'Max Price'} />
              {
                checkValidation === true && formData.maxPrice === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Button
            onPress={() => { formSubmit(formData) }}
            style={[AppStyles.formBtn, styles.addInvenBtn]}>
            <Text style={AppStyles.btnText}>CREATE USER</Text>
          </Button>
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

export default connect(mapStateToProps)(InnerForm)

