import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import noData from '../../../assets/images/no-result2.png'

class LoadingNoResult extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { loading } = this.props
		return (
			<View>
				{
					loading === true ?
						<Text>Loading...</Text>
						:
						<Image source={noData} style={styles.noResultImg}/>
				}
			</View>
		)
	}
}

export default LoadingNoResult;