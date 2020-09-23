import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import { connect } from 'react-redux';
import { formatPrice } from '../../PriceFormate';
import moment from 'moment'

class PaymentTile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			menuShow: false
		}
	}

	render() {
		const {
			currencyConvert,
			data,
			count,
			editTile,
		} = this.props
		var statusColor = data.status === 'approved' ? styles.statusGreen : data.status === 'rejected' ? styles.statusRed : styles.statusYellow
		return (
			<TouchableOpacity onPress={() => { editTile(data.id) }}>
				<View style={styles.tileTopWrap}>
					<View style={styles.upperLayer}>
						<Text style={styles.paymnetHeading}>PAYMENT {count + 1} (CHEQUE)</Text>
						<Text style={[styles.tileStatus, statusColor]}>{data.status}</Text>
					</View>
					<View style={styles.bottomLayer}>
						<Text style={styles.formatPrice}>{currencyConvert(data.installmentAmount)}</Text>
						<Text style={styles.totalPrice}>{formatPrice(data.installmentAmount)}</Text>
						<Text style={styles.priceDate}>{moment(data.createdAt).format('MM.DD.YYYY / h:mm a')}</Text>
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
