import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Button, Textarea } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';
import { formatPrice } from '../../PriceFormate';
import PriceSlider from '../../components/PriceSlider';
import StaticData from '../../StaticData'
import TouchableInput from '../../components/TouchableInput';
import TouchableButton from '../../components/TouchableButton';

class InnerRCMForm extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() { }

	render() {

		const {
			user,
			formSubmit,
			checkValidation,
			handleForm,
			formData,
			handleCityClick,
			selectedCity,
			propertyType,
			subType,
			sizeUnit,
			handleAreaClick,
			clientName,
			handleClientClick,
			priceList,
			onSliderValueChange,
			organizations,
			loading,
		} = this.props

		const { leadAreas } = formData;
		const leadAreasLength = leadAreas ? leadAreas.length : 0;
		return (
			<View>

				{
					user.subRole === 'group_management' ?
						<View style={[AppStyles.mainInputWrap]}>
							<View style={[AppStyles.inputWrap]}>
								<PickerComponent onValueChange={handleForm} data={organizations} name={'org'} placeholder='Organizations' />
								{
									checkValidation === true && formData.org === '' && <ErrorMessage errorMessage={'Required'} />
								}
							</View>
						</View>
						:
						null
				}

				<TouchableInput placeholder="Client"
					onPress={() => handleClientClick()}
					value={clientName}
					showError={checkValidation === true && formData.customerId === ''}
					errorMessage="Required" />

				<TouchableInput placeholder="Select City"
					onPress={() => handleCityClick()}
					value={selectedCity ? selectedCity.name : ''}
					showError={checkValidation === true && formData.city_id === ''}
					errorMessage="Required" />

				<TouchableInput onPress={() => handleAreaClick()}
					value={leadAreasLength > 0 ? leadAreasLength + ' Areas Selected' : ''}
					placeholder="Select Areas"
					showError={checkValidation === true && leadAreas.length === 0}
					errorMessage="Required"
				/>

				{/* **************************************** */}
				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<PickerComponent onValueChange={handleForm} data={propertyType} name={'type'} placeholder='Property Type' />
						{
							checkValidation === true && formData.type === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				{/* **************************************** */}
				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<PickerComponent onValueChange={handleForm} data={subType} name={'subtype'} placeholder='Property Sub Type' />
						{
							checkValidation === true && formData.subtype === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>

				{/* **************************************** */}
				<View style={AppStyles.multiFormInput}>

					{/* **************************************** */}
					<View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
						<View style={[AppStyles.inputWrap]}>
							<TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'size') }}
								value={formData.size ? String(formData.size) : ''}
								keyboardType='numeric'
								style={[AppStyles.formControl, AppStyles.inputPadLeft]}
								name={'size'}
								placeholder={'Size'} />
						</View>
					</View>

					{/* **************************************** */}
					<View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
						<View style={[AppStyles.inputWrap]}>
							<PickerComponent onValueChange={handleForm} data={sizeUnit} name={'size_unit'} selectedItem={formData.size_unit} placeholder='Unit Size' />
						</View>
					</View>
				</View>
				{/* **************************************** */}
				<View style={[AppStyles.mainInputWrap]}>
					<View style={[AppStyles.inputWrap]}>
						<PickerComponent onValueChange={handleForm} selectedItem={formData.size_unit} data={sizeUnit} name={'size_unit'} placeholder='Unit Size' />
						{
							checkValidation === true && formData.type === '' && <ErrorMessage errorMessage={'Required'} />
						}
					</View>
				</View>
				{
					formData.type != 'plot' && formData.type != 'commercial' &&
					<View style={AppStyles.multiFormInput}>

						{/* **************************************** */}
						<View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
							<View style={[AppStyles.inputWrap]}>
								<TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'bed') }}
									value={formData.bed ? String(formData.bed) : ''}
									keyboardType='numeric'
									style={[AppStyles.formControl, AppStyles.inputPadLeft]}
									name={'bed'}
									placeholder={'Bed'} />
							</View>
						</View>

						{/* **************************************** */}
						<View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
							<View style={[AppStyles.inputWrap]}>
								<TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'bath') }}
									value={formData.bath ? String(formData.bath) : ''}
									keyboardType='numeric'
									style={[AppStyles.formControl, AppStyles.inputPadLeft]}
									name={'bath'}
									placeholder={'Bath'} />
							</View>
						</View>

					</View>
				}

				{/* **************************************** */}

				<View style={[AppStyles.multiFormInput, AppStyles.mainInputWrap, { justifyContent: 'space-between', alignItems: 'center' }]}>

					<TextInput placeholder='Price Min'
						value={formData.minPrice === StaticData.Constants.any_value ? 'Any' : formatPrice(formData.minPrice)}
						style={[AppStyles.formControl, styles.priceStyle]}
						editable={false}
					/>
					<Text style={styles.toText}>to</Text>
					<TextInput placeholder='Price Max'
						value={formData.maxPrice === StaticData.Constants.any_value ? 'Any' : formatPrice(formData.maxPrice)}
						style={[AppStyles.formControl, styles.priceStyle]}
						editable={false}
					/>
				</View>

				<PriceSlider priceValues={priceList} initialValue={0} finalValue={priceList.length - 1} onSliderValueChange={(values) => onSliderValueChange(values)} />
				<View style={[AppStyles.mainInputWrap]}>
					<Textarea
						value={formData.description}
						style={[AppStyles.formControl, Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 }, AppStyles.formFontSettings, { height: 100, paddingTop: 10, }]} rowSpan={5}
						placeholder="Description"
						onChangeText={(text) => handleForm(text, 'description')}
					/>
				</View>

				{/* **************************************** */}
				<View style={[AppStyles.mainInputWrap]}>
					<TouchableButton
						containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
						label={'CREATE LEAD'}
						onPress={() => formSubmit(formData)}
						loading={loading}
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

export default connect(mapStateToProps)(InnerRCMForm)

