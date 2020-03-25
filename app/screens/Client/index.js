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

var BUTTONS = ['Delete', 'Cancel'];
var CANCEL_INDEX = 1;

class Client extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.fetchCustomer()
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchCustomer = () => {
        const { user } = this.props
        axios.get(`/api/customer/find?userId=${user.id}`)
            .then((res) => {
                this.setState({
                    customers: res.data.rows,
                    loading: false
                })
            })
            .catch((error) => {
                console.log(error)
                return null
            })
    }

    navigateTo = (data) => {
        this.props.navigation.navigate('ClientDetail', { 'client': data })
    }

    addClient = () => {
        this.props.navigation.navigate('AddClient', { 'update': false })
    }

    handleLongPress = (val) => {
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

    deleteClient = (val) => {
        let endPoint = ``
        let that = this;
        endPoint = `api/customer/remove?id=${val.id}`
        axios.delete(endPoint).then(function (response) {
            if (response.status === 200) {
                helper.successToast('CLIENT DELETED SUCCESSFULLY!')
                that.fetchCustomer();
            }
        }).catch(function (error) {
            helper.successToast(error.message)
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
        const { customers, loading } = this.state
        const { user } = this.props
        return (
            !loading ?
            <View style={[AppStyles.container, styles.container]}>
                {
                    Ability.canAdd(user.role, 'Client') ?
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
                <FlatList
                    data={customers}
                    renderItem={(item, index) => (
                        <ClientTile data={item} handleLongPress={this.handleLongPress} onPress={this.navigateTo} />
                    )}
                    keyExtractor={(item, index) => item.id.toString()}
                />
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