import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import { connect } from 'react-redux';
import { formatPrice } from '../../PriceFormate';

class PaymentTile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			menuShow: false
		}
	}

	render() {
		const { status, currencyConvert } = this.props
		var statusColor = status === 'approved' ? styles.statusGreen : status === 'cancel' ?  styles.statusRed : styles.statusYellow
		console.log(statusColor)
		return (
			<TouchableOpacity>
				<View style={styles.tileTopWrap}>
					<View style={styles.upperLayer}>
						<Text style={styles.paymnetHeading}>PAYMENT 01 (CHEQUE)</Text>
						<Text style={[styles.tileStatus, statusColor]}>APPROVED</Text>
					</View>
					<View style={styles.bottomLayer}>
						<Text style={styles.formatPrice}>{currencyConvert('133344444')}</Text>
						<Text style={styles.totalPrice}>{formatPrice('133344444')}</Text>
						<Text style={styles.priceDate}>09.9.2020 / 04:06 PM</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		contacts: store.contacts.contacts,
	}
}

export default connect(mapStateToProps)(PaymentTile)
