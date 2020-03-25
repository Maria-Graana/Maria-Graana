import React from 'react';
import styles from './style'
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ClientTile from '../../components/ClientTile'
import AppStyles from '../../AppStyles'
import axios from 'axios';
import Ability from '../../hoc/Ability';
import { Ionicons } from '@expo/vector-icons';
import { Fab } from 'native-base';

class Client extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.fetchCustomer()
    }

    fetchCustomer = () => {
        const { user } = this.props
        axios.get(`/api/customer/find?userId=${user.id}`)
            .then((res) => {
                console.log(res.data.rows)
                this.setState({
                    customers: res.data.rows
                })
            })
            .catch((error) => {
                console.log(error)
                return null
            })
    }

    navigateTo = () => {
        this.props.navigation.navigate('AddClient')
    }

    render() {
        const { customers } = this.state
        return (
            <View style={[AppStyles.container, styles.container]}>
                <Fab
                    active='true'
                    containerStyle={{ zIndex: 20 }}
                    style={{ backgroundColor: AppStyles.colors.primaryColor }}
                    position="bottomRight"
                    onPress={this.navigateTo}
                >
                    <Ionicons name="md-add" color="#ffffff" />
                </Fab>
                <FlatList
                    data={customers}
                    renderItem={(item, index) => (
                        <ClientTile data={item} />
                    )}
                    keyExtractor={(item, index) => item.id.toString()}
                />
            </View>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(Client)