import { ActivityIndicator, Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import CountryPicker, { FlagButton } from 'react-native-country-picker-modal'
import React, { useEffect, useState } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { onChange } from 'react-native-reanimated'

let locationButtonAlt = {
	borderBottomWidth: 0,
	borderColor: '#757575',
	backgroundColor: '#fff',
	borderRadius: 4,
	// marginTop: 20,
	// marginBottom: 10,
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'row',
	alignSelf: 'center',
	paddingLeft: wp('3%'),
	paddingBottom: 5,
	paddingTop: 5,

}
let input = {
	flex: 1,
	borderColor: '#757575',
	color: '#333',
	fontWeight: '400',
	fontSize: 16,
}
const PhoneInputComponent = (props) => {
	const { onChangeHandle, name, placeholder, countryCodeValue } = props
	const [currentCountryCode, setCurrentCountryCode] = useState('')
	return (
		<View style={locationButtonAlt}>
			<CountryPicker
				withFilter
				withFlag
				withCallingCode
				withCallingCodeButton
				countryCode={props.countryCodeValue}
				onSelect={(country) => { props.setFlagObject(country) }}
				renderFlagButton={(Flag) => { return <View><FlagButton {...Flag}></FlagButton></View> }}
			>
			</CountryPicker>
			<Text style={{ padding: 10 }}>-</Text>
			<TextInput
				placeholder={placeholder}
				style={{ placeholder: { fontSize: 10 } }}
				style={[props.inputStyle || input]}
				keyboardType="number-pad"
				autoCorrect={false}
				maxLength={15}
				autoCompleteType='cc-number'
				value={props.phoneValue && props.phoneValue.substring(0, 3) == '+92' ? props.phoneValue.substring(3) : props.phoneValue}
				onChangeText={(value) => { onChangeHandle(value, name) }}

			/>
		</View>
	)
}

export default PhoneInputComponent;