import { FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Ability from '../../hoc/Ability'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import LandingButtonTile from '../../components/LandingButtonTile'
import PushNotification from '../../PushNotifications';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { getListingsCount } from '../../actions/listings'

class Landing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tiles: [],
			maxTiles: 3,
			tileNames: ['Team Diary', 'Diary', 'Leads', 'Inventory', 'Client', 'Targets']
		}
	}

	componentDidMount() {
		const { navigation, dispatch } = this.props;
		this._unsubscribe = navigation.addListener('focus', () => {
			this.fetchTiles()
			setTimeout(function () {
				dispatch(getListingsCount())
			}, 2000)
		});
	}

	componentWillUnmount() {
		this._unsubscribe();
	}

	fetchTiles = () => {
		const { user, count } = this.props
		const { maxTiles, tileNames } = this.state
		let counter = 0
		let tileData = []

		for (let tile of tileNames) {
			let label = tile
			tile = tile.replace(/ /g, "")
			if (Ability.canView(user.role, tile)) {
				if (label === 'Inventory') label = 'Properties'
				if (counter < maxTiles) {
					let oneTile = {
						id: counter,
						label: label.toUpperCase(),
						pagePath: tile,
						buttonImg: helper.tileImage(tile),
						screenName: tile
					}
					if (tile.toLocaleLowerCase() in count) oneTile.badges = count[tile.toLocaleLowerCase()]
					else oneTile.badges = 0
					tileData.push(oneTile)
					counter++
				}
			}
		}

		this.setState({ tiles: tileData })
	}

	// ****** Navigate Function
	navigateFunction = (name, screenName) => {
		const { navigation } = this.props
		navigation.navigate(name, { screen: screenName })
	}

	render() {
		const { user, count } = this.props
		const { tiles } = this.state

		return (
			// <ScrollView contentContainerStyle={[AppStyles.container, { paddingLeft: wp('5%'), paddingRight: wp('5%'), justifyContent: 'space-between' }]} >
			<SafeAreaView style={[AppStyles.container, { paddingLeft: wp('5%'), paddingRight: wp('5%'), justifyContent: 'space-between' }]}>
				<PushNotification />
				{
					tiles.length ?
						< FlatList
							data={tiles}
							renderItem={(item, index) => (
								<LandingButtonTile navigateFunction={this.navigateFunction} label={item.item.label} pagePath={item.item.pagePath} screenName={item.item.screenName} buttonImg={item.item.buttonImg} badges={item.item.badges} />
							)}
							keyExtractor={(item, index) => item.id.toString()}
						/>
						: null
				}
			</SafeAreaView>
			// </ScrollView>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		count: store.listings.count
	}
}

export default connect(mapStateToProps)(Landing)