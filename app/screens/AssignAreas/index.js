import * as RootNavigation from '../../navigation/RootNavigation'
import { Alert, FlatList, Image, Text, View } from 'react-native'
import Ability from '../../hoc/Ability'
import AppStyles from '../../AppStyles'
import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import helper from '../../helper'
import styles from './style'
import AssignAreasTile from '../../components/AssignAreasTile'
import Loader from '../../components/loader'


class AssignAreas extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			assignedAreas: [],
			loading: false
		}
	}

	componentDidMount() {
		this.fetchAssignedAreas();
	}

	fetchAssignedAreas = () => {
		const { user } = this.props
		const { loading } = this.state
		this.setState({
			loading: true
		})
		axios.get(`/api/user/userAreaGroups?userId=${user.id}`)
			.then((res) => {
				this.setState({
					assignedAreas: res.data,
					loading: false,
				})
			})
	}

	render() {
		const { assignedAreas, loading } = this.state
		return (
			<View style={styles.mainContainer}>
				<View style={styles.scrollView}>

					{
						assignedAreas &&
							assignedAreas.length > 0 &&
							loading === false
							?
							< FlatList
								data={assignedAreas}
								renderItem={({ item, index }) => (
									<AssignAreasTile
										data={item}
										index={index}
										loading={loading}
									/>
								)}
							/>
							: 

						<Loader loading={loading}/>
					}

				</View>
			</View>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		contacts: store.contacts.contacts,
	}
}

export default connect(mapStateToProps)(AssignAreas)
