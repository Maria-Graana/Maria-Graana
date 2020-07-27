import React from 'react';
import styles from './style'
import { View, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import ClientTile from '../../components/ClientTile'
import AppStyles from '../../AppStyles'
import axios from 'axios';
import Ability from '../../hoc/Ability';
import { Ionicons } from '@expo/vector-icons';
import { Fab, ActionSheet } from 'native-base';
import helper from '../../helper';
import Loader from '../../components/loader';
import fuzzy from 'fuzzy'
import Search from '../../components/Search';
import NoResultsComponent from '../../components/NoResultsComponent';
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent';
import _ from 'underscore';

var BUTTONS = ['Delete', 'Cancel'];
var CANCEL_INDEX = 1;

class Client extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: [],
            totalCustomers: 0,
            loading: true,
            page: 1,
            pageSize: 20,
            onEndReachedLoader: false,
            searchText: '',
            isSelected: false,
        }
    }

    componentDidMount() {
        const { navigation, route } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.fetchCustomer();
        })
    }

    componentWillUnmount() {
        this.clearStateValues();
        this._unsubscribe();
    }

    clearStateValues = () => {
        this.setState({
            page: 1,
            totalCustomers: 0,
        })
    }

    checkIsSelected = (selectedClient) => {
        // this function is only called for drop down selection of client.
        const copyCustomers = [...this.state.customers];
        const newCustomers = copyCustomers.map(customer => (
            { ...customer, isSelected: customer.id === selectedClient.id }
        ))
        this.setState({ customers: newCustomers })
    }

    fetchCustomer = () => {
        const { customers, page, pageSize } = this.state;
        const { selectedClient } = this.props.route.params;
        const url = `/api/customer/find?pageSize=${pageSize}&page=${page}`
        axios.get(url)
            .then((res) => {
                this.setState({
                    customers: page === 1 ? res.data.rows : [...customers, ...res.data.rows],
                    totalCustomers: res.data.count,
                    onEndReachedLoader: false,
                    loading: false
                }, () => {
                    if (selectedClient) {
                        this.checkIsSelected(selectedClient);
                    }
                });
            })
            .catch((error) => {
                console.log(error)
                return null
            })
    }

    navigateTo = (data) => {
        const { route, navigation } = this.props;
        const { isFromDropDown = false, screenName } = route.params; // user can by default move to detail screen if param is undefined or null
        if (isFromDropDown) {
            // This is the case for dropdown value selection
            navigation.navigate(screenName, { 'client': data, name: data.firstName + ' ' +  data.lastName })

        }
        else {
            // by default flow of client screen
            navigation.navigate('ClientDetail', { client: data})
        }
    }

    addClient = () => {
        const { route, navigation } = this.props;
        const { screenName, isFromDropDown = false } = route.params;
        navigation.navigate('AddClient', { 'update': false, isFromDropDown, screenName })
    }

    handleLongPress = (val) => {
        const { route, navigation } = this.props;
        const { isFromDropDown = false } = route.params;
        if(!isFromDropDown){
            ActionSheet.show(
                {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: 'Select an Option',
                },
                buttonIndex => {
                    if (buttonIndex === 0) {
                        //Delete
                        this.showDeleteDialog(val);
                    }
                }
            );
        }
    }

    deleteClient = (val) => {
        let endPoint = ``
        let that = this;
        endPoint = `api/customer/remove?id=${val.id}`
        axios.delete(endPoint).then(function (response) {
            if (response.status === 200) {
                if (response.data.message) {
                    helper.errorToast(response.data.message)
                }
                else {
                    helper.successToast('CLIENT DELETED SUCCESSFULLY!')
                    that.fetchCustomer();
                }

            }
        }).catch(function (error) {
            helper.errorToast(error.message)
        })
    }

    showDeleteDialog(val) {
        Alert.alert('Delete Client', 'Are you sure you want to delete this Client ?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => this.deleteClient(val) },
        ],
            { cancelable: false })
    }

    render() {
        const { customers, loading, totalCustomers, onEndReachedLoader, searchText } = this.state
        const { user } = this.props
        let data = [];
        if (searchText !== '' && data.length === 0) {
            data = fuzzy.filter(searchText, customers, { extract: (e) => (e.firstName + e.lastName) })
            data = data.map((item) => item.original)
        }
        else {
            data = customers;
        }
        return (
            !loading ?
                <View style={[AppStyles.container, styles.container]}>
                    <Search placeholder='Search clients here' searchText={searchText} setSearchText={(value) => this.setState({ searchText: value })} />
                    {
                        Ability.canAdd(user.subRole, 'Client') ?
                            <Fab
                                active='true'
                                containerStyle={{ zIndex: 20 }}
                                style={{ backgroundColor: AppStyles.colors.primaryColor }}
                                position="bottomRight"
                                onPress={this.addClient}
                            >
                                <Ionicons name="md-add" color="#ffffff" />
                            </Fab>
                            :
                            null
                    }
                    {
                        data.length > 0 ?
                            <FlatList
                                data={data}
                                renderItem={(item, index) => (
                                    <ClientTile data={item} handleLongPress={this.handleLongPress} onPress={this.navigateTo} />
                                )}
                                onEndReached={() => {
                                    if (customers.length < totalCustomers) {
                                        this.setState({
                                            page: this.state.page + 1,
                                            onEndReachedLoader: true
                                        }, () => {
                                            this.fetchCustomer();
                                        });
                                    }
                                }}
                                onEndReachedThreshold={0.5}
                                keyExtractor={(item, index) => item.id.toString()}
                            />
                            :
                            <NoResultsComponent imageSource={require('../../../assets/images/no-result2.png')} />
                    }

                    <OnLoadMoreComponent style={{ backgroundColor: 'white' }} onEndReached={onEndReachedLoader} />
                </View>
                :
                <Loader loading={loading} />
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(Client)