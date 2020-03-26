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
		}
	}

	componentDidMount() { }

	render() {

		const {
			formSubmit,
			checkValidation,
			handleForm,
			formData,
			update
		} = this.props
		let btnText= update? 'UPDATE': 'ADD'
		return (
			<View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput value={formData.firstName} onChangeText={(text) => { handleForm(text, 'firstName') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'firstName'} placeholder={'First Name*'} />
						{
							checkValidation === true && formData.firstName === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput value={formData.lastName} onChangeText={(text) => { handleForm(text, 'lastName') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'lastName'} placeholder={'Last Name*'} />
						{
							checkValidation === true && formData.lastName === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput value={formData.contactNumber} keyboardType='number-pad' autoCompleteType='cc-number' onChangeText={(text) => { handleForm(text, 'contactNumber') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'contactNumber'} placeholder={'Contact Number*'} />
						{
							checkValidation === true && formData.contactNumber === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput value={formData.email} keyboardType='email-address' autoCompleteType='email' onChangeText={(text) => { handleForm(text, 'email') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'email'} placeholder={'Email'} />
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput value={formData.cnic} onChangeText={(text) => { handleForm(text, 'cnic') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'cnic'} placeholder={'CNIC'} />
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor="#bfbbbb"
                        style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, styles.textArea]} rowSpan={5}
                        placeholder="Address"
                        onChangeText={(text) => handleForm(text, 'address')}
                        value={formData.address}
                    />
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor="#bfbbbb"
                        style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, styles.textArea]} rowSpan={5}
                        placeholder="Secondary Address"
                        onChangeText={(text) => handleForm(text, 'secondaryAddress')}
                        value={formData.secondaryAddress}
                    />
                </View>


				{/* **************************************** */}
				<View style={[AppStyles.mainInputWrap]}>
					<Button
						onPress={() => { formSubmit(formData) }}
						style={[AppStyles.formBtn, styles.addInvenBtn]}>
						<Text style={AppStyles.btnText}>{btnText}</Text>
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

