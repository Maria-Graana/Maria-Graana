import React from 'react';
import styles from './style'
import { View } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
class Viewing extends React.Component {
	constructor(props) {
		super(props)
    }

	render() {
		return (
            <View style={[AppStyles.container, styles.container]}>
            </View>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user
	}
}

export default connect(mapStateToProps)(Viewing)