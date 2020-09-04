import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { Button, Textarea } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';
import helper from '../../helper';
import PhoneInputComponent from '../../components/PhoneCountry/PhoneInput'

class DetailForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			phone: '+92432342432334',
		}
	}

	componentDidMount() { }



	render() {

		const {
			formSubmit,
			checkValidation,
			handleForm,
			formData,
			update,
			phoneValidate,
			emailValidate,
			cnicValidate,
			contact1Validate,
			contact2Validate,
			getTrimmedPhone,
			validate,
			hello,
			countryCode,
			countryCode1,
			countryCode2,
			contactNumberCheck,
		} = this.props
		let btnText = update ? 'UPDATE' : 'ADD'
		return (
			<View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput placeholderTextColor={'#a8a8aa'} value={formData.firstName} onChangeText={(text) => { handleForm(text, 'firstName') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'firstName'} placeholder={'First Name*'} />
						{
							checkValidation === true && formData.firstName === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput placeholderTextColor={'#a8a8aa'} value={formData.lastName} onChangeText={(text) => { handleForm(text, 'lastName') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'lastName'} placeholder={'Last Name*'} />
						{
							checkValidation === true && formData.lastName === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>
				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<PhoneInputComponent
							phoneValue={formData.contactNumber != '' && getTrimmedPhone(formData.contactNumber.replace('+92', ''))}
							countryCodeValue={countryCode}
							containerStyle={AppStyles.phoneInputStyle}
							setPhone={(value) => validate(value, 'phone')}
							setFlagObject={(object) => { hello(object, 'contactNumber') }}
							onChangeHandle={handleForm}
							name={'contactNumber'}
							placeholder={'Contact Number*'}
						/>
						{
							phoneValidate == true && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
						}
						{
							phoneValidate == false && checkValidation === true && formData.contactNumber === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>


				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<PhoneInputComponent
							phoneValue={formData.contact1 != '' && getTrimmedPhone(formData.contact1.replace('+92', ''))}
							countryCodeValue={countryCode1}
							containerStyle={AppStyles.phoneInputStyle}
							setPhone={(value) => validate(value, 'phone')}
							setFlagObject={(object) => { hello(object, 'contact1') }}
							onChangeHandle={handleForm}
							name={'contact1'}
							placeholder={'Contact Number 2'}
						/>
						{
							contact1Validate == true  && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<PhoneInputComponent
							phoneValue={formData.contact2 != '' && getTrimmedPhone(formData.contact2.replace('+92', ''))}
							countryCodeValue={countryCode2}
							containerStyle={AppStyles.phoneInputStyle}
							setPhone={(value) => validate(value, 'phone')}
							setFlagObject={(object) => { hello(object, 'contact2') }}
							onChangeHandle={handleForm}
							name={'contact2'}
							placeholder={'Contact Number 3'}
						/>
						{
							contact2Validate == true && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
						}
					
					</View>
				</View>


				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput placeholderTextColor={'#a8a8aa'} value={formData.email} keyboardType='email-address' autoCompleteType='email' onChangeText={(text) => { handleForm(text, 'email') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'email'} placeholder={'Email'} />
						{
							emailValidate == false && <ErrorMessage errorMessage={'Enter a Valid Email Address'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<TextInput placeholderTextColor={'#a8a8aa'} keyboardType={'number-pad'} maxLength={15} value={formData.cnic} onChangeText={(text) => { handleForm(text, 'cnic') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'cnic'} placeholder={'CNIC'} />
						{
							cnicValidate == true && <ErrorMessage errorMessage={'Enter a Valid CNIC Number'} />
						}
					</View>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<Textarea
						placeholderTextColor={AppStyles.colors.subTextColor}
						style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, styles.textArea]} rowSpan={5}
						placeholder="Address"
						onChangeText={(text) => handleForm(text, 'address')}
						value={formData.address}
					/>
				</View>

				<View style={[AppStyles.mainInputWrap]}>
					<Textarea
						placeholderTextColor={AppStyles.colors.subTextColor}
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

