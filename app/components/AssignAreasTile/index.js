import { Text, View } from 'react-native'
import React from 'react'
import styles from './style'
import Item from '../../../native-base-theme/components/Item'

class AssignAreas extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { data, index } = this.props
		return (
			<View style={styles.mainTile}>
				<View style={styles.leftWrap}>
					<Text style={styles.countStyle}>{index + 1}</Text>
				</View>
				<View style={styles.rightWrap}>
					{
						<Text style={styles.cityName}>{data.area.name}</Text>
					}
					<Text style={styles.areaName}>{data.area && data.area.city.name}</Text>
				</View>
			</View>


		)
	}
}

export default AssignAreas;
