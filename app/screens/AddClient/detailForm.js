import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Textarea } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';

class DetailForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			formData: {
				client: '',
				city: '',
				project: '',
				productType: '',
				minInvestment: '',
				maxInvestment: '',
			}
		}

		this.city = [
			{ id: 'shop', name: 'shop' },
			{ id: 'office', name: 'Office' },
			{ id: 'other', name: 'other' },
		]
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

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput onChangeText={(text) => { handleForm(text, 'firstName') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'firstName'} placeholder={'First Name*'} />
						{
							checkValidation === true && formData.firstName === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput onChangeText={(text) => { handleForm(text, 'lastName') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'lastName'} placeholder={'Last Name*'} />
						{
							checkValidation === true && formData.lastName === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput onChangeText={(text) => { handleForm(text, 'contactNumber') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'contactNumber'} placeholder={'Contact Number*'} />
						{
							checkValidation === true && formData.contactNumber === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput onChangeText={(text) => { handleForm(text, 'email') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'email'} placeholder={'Email'} />
						{
							checkValidation === true && formData.email === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput onChangeText={(text) => { handleForm(text, 'cnic') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'cnic'} placeholder={'CNIC'} />
						{
							checkValidation === true && formData.cnic === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor="#bfbbbb"
                        style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, styles.textArea]} rowSpan={5}
                        placeholder="Address"
                        onChangeText={(text) => handleForm(text, 'address')}
                        // value={notes}
                    />
					{
						checkValidation === true && formData.address === '' && <ErrorMessage errorMessage={'Required'} />
					}
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor="#bfbbbb"
                        style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, styles.textArea]} rowSpan={5}
                        placeholder="Secondary Address"
                        onChangeText={(text) => handleForm(text, 'secondaryAddress')}
                        // value={notes}
                    />
                </View>


				{/* **************************************** */}
				<View style={[AppStyles.mainInputWrap]}>
					<Button
						onPress={() => { formSubmit(formData) }}
						style={[AppStyles.formBtn, styles.addInvenBtn]}>
						<Text style={AppStyles.btnText}>ADD</Text>
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

export default connect(mapStateToProps)(DetailForm)

