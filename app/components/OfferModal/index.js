import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Modal, SafeAreaView, FlatList } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import moment from 'moment'
import { AntDesign } from '@expo/vector-icons';
import addImg from '../../../assets/img/add.png'
import checkImg from '../../../assets/img/check.png'

class OfferModal extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { active, isVisible, handleForm, placeMyOffer, placeTheirOffer, placeAgreedOffer, offerChat } = this.props
		return (
			<Modal
				visible={active}
				animationType="slide"
				onRequestClose={isVisible}
			>
				<SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
					<View style={{ flexDirection: 'row', marginHorizontal: 10, }}>
						<View style={{flex: 1}} />
						<AntDesign style={styles.closeStyle} onPress={() => { this.props.openModal() }} name="close" size={26} color={AppStyles.colors.textColor} />
					</View>

					{/* **************************************** */}
					<View style={[styles.mainTopHeader]}>
						{/* ******************Left Input */}
						<View style={styles.mainInputWrap}>
							<Text style={styles.offerColor}>My Offers</Text>
							<View style={styles.inputWrap}>
								<TextInput style={[styles.formControl]} placeholder={'PKR 4.5 Crore'} onChangeText={(text) => { handleForm(text, 'my') }} />
								<TouchableOpacity
									onPress={placeMyOffer}
									style={[styles.addBtnColorLeft, styles.sideBtnInput]}>
									<Image source={addImg} style={[styles.addImg]} />
								</TouchableOpacity>
							</View>
						</View>

						{/* ******************Right Input */}
						<View style={styles.mainInputWrap}>
							<Text style={styles.offerColor}>Their Offers</Text>
							<View style={styles.inputWrap}>
								<TextInput style={[styles.formControl]} placeholder={'PKR 4.5 Crore'} onChangeText={(text) => { handleForm(text, 'their') }} />
								<TouchableOpacity
									onPress={placeTheirOffer}
									style={[styles.addBtnColorRight, styles.sideBtnInput]}>
									<Image source={addImg} style={[styles.addImg]} />
								</TouchableOpacity>
							</View>
						</View>

					</View>


					{/* **************************************** */}
					<View style={[styles.chatContainer]}>
						<FlatList
							data={offerChat}
							renderItem={(item, index) => (
								<View >
									{
										item.item.from === 'agent' ?
											<View style={[styles.mainChatWrap]}>
												<View style={[styles.caret, styles.caretRight]}></View>
												<Text style={[styles.priceStyle, styles.priceBlue]}>{item.item.offer}</Text>
												<Text style={[styles.dataTime]}>{moment(item.item.createdAt).format("YYYY-MM-DD hh:mm a")}</Text>
											</View>
											:
											<View style={[styles.alignRight]}>
												<View style={[styles.mainChatWrap]}>
													<View style={[styles.caret, styles.caretLeft]}></View>
													<Text style={[styles.priceStyle, styles.priceBlack, styles.textRight]}>{item.item.offer}</Text>
													<Text style={[styles.dataTime, styles.textRight]}>{moment(item.item.createdAt).format("YYYY-MM-DD hh:mm a")}</Text>
												</View>
											</View>
									}
								</View>
							)}
						/>
					</View>



					{/* **************************************** */}
					<View style={[{ marginHorizontal: 10, marginBottom: 20}]}>
						<Text style={styles.offerColorLast}>AGREED AMOUNT</Text>
						<View style={styles.inputWrapLast}>
							<TextInput style={[styles.formControlLast]} placeholder={'PKR 4.5 Crore'} onChangeText={(text) => { handleForm(text, 'agreed') }} />
							<TouchableOpacity
								onPress={placeAgreedOffer}
								style={[styles.addBtnColorLeft, styles.sideBtnInputLast]}>
								<Image source={checkImg} style={[styles.checkImg]} />
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>
			</Modal>
		)
	}
}

export default OfferModal;