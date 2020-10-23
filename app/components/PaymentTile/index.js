import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import { connect } from 'react-redux';
import { formatPrice } from '../../PriceFormate';
import moment from 'moment'
import StaticData from '../../StaticData';

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
			tileForToken,
			editTileForscreenOne,
		} = this.props
		var showStatus = data.status != '' ?  StaticData.statusOptions.find((item) => { return item.value === data.status && item  }) : {label: '', value: ''}
		var statusColor = showStatus != null && showStatus.value === 'cleared' ? styles.statusGreen : showStatus.value === 'notCleared' || showStatus.value === 'rejected' ? styles.statusRed : styles.statusYellow
		return (
			<TouchableOpacity onPress={() => { data.status != 'cleared' ? tileForToken === true ? editTileForscreenOne() : editTile(data.id) : null }}>
				<View style={styles.tileTopWrap}>
					<View style={styles.upperLayer}>
						<Text style={styles.paymnetHeading}>{data.paymentCategory === 'token' ? 'TOKEN' : 'PAYMENT'} {count + 1} ({data.type})</Text>
						{
							data.status != '' && <Text style={[styles.tileStatus, statusColor]}>{showStatus.label}</Text>
						}
					</View>
					<View style={styles.bottomLayer}>
						<Text style={styles.formatPrice}>{currencyConvert(data.installmentAmount != null ? data.installmentAmount : '')}</Text>
						<Text style={styles.totalPrice}>{formatPrice(data.installmentAmount)}</Text>
						<Text style={styles.priceDate}>{moment(data.createdAt).format('DD MMM YY - h:mm a')}</Text>
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
