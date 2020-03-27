import React from 'react';
import styles from './style'
import { View, TextInput, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import PickerComponent from '../../components/Picker/index';
import { Fab, Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import SortImg from '../../../assets/img/sort.png'
import fire from '../../../assets/images/fire.png'
import LeadTile from '../../components/LeadTile'
import PropertyImg from '../../../assets/img/property.jpg'
import phone from '../../../assets/img/phone.png'


class Inventory extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			language: '',
			active: false,
			dotsDropDown: false,
			dropDownId: '',
			selectInventory: [],
			febDrawer: false,
			activeTab: 'all',
		}

		this.staticData = [
			{
				id: '1',
				propertyName: '10 marla house for sale',
				action: 'Token',
				price: '10 Crore',
				address: 'G/11, Islamabad',
				location: 'G/11, Islamabad',
			},
			{
				id: '2',
				propertyName: '40 marla house for sale',
				action: 'Deal Done',
				price: '20 Crore',
				address: 'i8/4, Islamabad',
				location: 'i8/4, Islamabad',
			},
			{
				id: '3',
				propertyName: '16 marla house for sale',
				action: 'Deal Done',
				price: '13 Crore',
				address: 'G2/11, Islamabad',
				location: 'G2/11, Islamabad',
			},
			{
				id: '4',
				propertyName: '5 marla house for sale',
				action: 'Token',
				price: '2 Crore',
				address: 'H1/11, Islamabad',
				location: 'H1/11, Islamabad',
			}
		]
	}

	showDropdown = (id) => {
		this.setState({
			dropDownId: id,
			dotsDropDown: !this.state.dotsDropDown
		})
	}

	selectInventory = (id) => {
		const { selectInventory } = this.state
		this.setState({
			selectInventory: [...selectInventory, id]
		})
	}

	unSelectInventory = (id) => {
		const { selectInventory } = this.state
		let index = selectInventory.indexOf(id)
		selectInventory.splice(index, 1)
		this.setState({
			selectInventory: selectInventory,
		})
	}

	goToFormPage = (status) => {
		const { navigation } = this.props;
		navigation.navigate('AddLead', { 'pageName': status });
	}

	changeTab = (status) => {
		this.setState({ activeTab: status })
	}

	navigateTo = (data) => {
		this.props.navigation.navigate('LeadDetail', {lead: data})
	}

	render() {
		const { selectInventory, dropDownId, activeTab } = this.state
		return (
			<View>

				{/* ******************* TAb BUTTON VIEW ******* */}
				<View style={styles.mainTopTabs}>
					<View style={styles.mainTabs}>
						<TouchableOpacity style={[styles.tabBtnStyle, activeTab === 'all' && styles.activeTab]} onPress={() => { this.changeTab('all') }}>
							<Text style={AppStyles.textCenter}>ALL</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.mainTabs}>
						<TouchableOpacity style={[styles.tabBtnStyle, activeTab === 'buy' && styles.activeTab]} onPress={() => { this.changeTab('buy') }}>
							<Text style={AppStyles.textCenter}>BUY</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.mainTabs}>
						<TouchableOpacity style={[styles.tabBtnStyle, activeTab === 'rent' && styles.activeTab]} onPress={() => { this.changeTab('rent') }}>
							<Text style={AppStyles.textCenter}>RENT</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.mainTabs}>
						<TouchableOpacity style={[styles.tabBtnStyle, activeTab === 'invest' && styles.activeTab]} onPress={() => { this.changeTab('invest') }}>
							<Text style={AppStyles.textCenter}>INVEST</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* ******************* TOP FILTER MAIN VIEW ********** */}
				<View style={[styles.mainFilter]}>
					<View style={styles.pickerMain}>
						<PickerComponent placeholder={'Lead Status'} customStyle={styles.pickerStyle} customIconStyle={styles.customIconStyle} />
					</View>
					<View style={styles.stylesMainSort}>
						<TouchableOpacity style={styles.sortBtn}>
							<Image source={SortImg} style={[styles.sortImg]} />
							<Text style={styles.sortText}>Sort</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={[styles.CustomContainer]}>
					<Fab
						active={this.state.active}
						direction="up"
						containerStyle={{ zIndex: 20 }}
						style={{ backgroundColor: '#333' }}
						position="bottomRight"
						onPress={() => this.setState({ active: !this.state.active })}>
						<Ionicons name="md-add" color="#ffffff" />
						<Button style={{ backgroundColor: '#333' }} onPress={() => { this.goToFormPage('RCM') }}>
							<Icon name="logo-whatsapp" />
						</Button>
						<Button style={{ backgroundColor: '#333' }} onPress={() => { this.goToFormPage('CM') }}>
							<Icon name="logo-facebook" />
						</Button>
					</Fab>
					<View style={styles.mainInventoryTile}>

						<FlatList
							data={this.staticData}
							renderItem={({ item }) => (
								
								<LeadTile
									showDropdown={this.showDropdown}
									dotsDropDown={this.state.dotsDropDown}
									selectInventory={this.selectInventory}
									selectedInventory={selectInventory}
									data={item}
									dropDownId={dropDownId}
									unSelectInventory={this.unSelectInventory}
									goToInventoryForm={this.goToInventoryForm}
								/>
							)}
						/>
					</View>
				</View>

			</View>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user
	}
}

export default connect(mapStateToProps)(Inventory)