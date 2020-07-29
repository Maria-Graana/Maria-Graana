import React from 'react';
import styles from './style'
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ability from '../../hoc/Ability';
import helper from '../../helper';
import axios from 'axios';
import Loader from '../../components/loader';

class ClientDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            client: {},
            loading: true,
        }
    }

    componentDidMount() {
        this.fetchCustomer()
    }

    navigateTo = () => {
        const { route } = this.props
        const { client } = route.params
        this.props.navigation.navigate('AddClient', { client: client, update: true })
    }

    fetchCustomer = () => {
        const { route } = this.props
        const { client } = route.params
        const url = `api/customer/${client.id}`
        axios.get(url)
            .then((res) => {
                this.setState({ client: res.data, loading: false })
            })
            .catch((error) => {
                console.log(`URL: ${url}`)
                console.log(error)
            })
    }

    checkClient = () => {
        const { user } = this.props;
        const { client } = this.state

        if (!client.originalOwner) {
            if (client.assigned_to_armsuser_id && client.assigned_to_armsuser_id === user.id) return 'Personal Client'
            else return client.assigned_to_organization ? client.assigned_to_organization : ''
        }
        else {
            if (client.originalOwner.id === user.id) return 'Personal Client'
            else {
                if (client.originalOwner.organization) return client.originalOwner.organization.name
                else return client.originalOwner.firstName + ' ' + client.originalOwner.lastName
            }
        }
    }

    render() {
        const { user } = this.props;
        const { client, loading } = this.state
        let belongs = this.checkClient()

        return (
            !loading ?
                <View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                    <View style={styles.outerContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.headingText}>First Name</Text>
                            <Text style={styles.labelText}>{client.first_name}</Text>
                            <Text style={styles.headingText}>Last Name</Text>
                            <Text style={styles.labelText}>{client.last_name}</Text>
                            <Text style={styles.headingText}>Contact Number</Text>
                            <Text style={styles.labelText}>{client.phone}</Text>
                            <Text style={styles.headingText}>Email</Text>
                            <Text style={styles.labelText}>{client.email}</Text>
                            <Text style={styles.headingText}>CNIC</Text>
                            <Text style={styles.labelText}>{client.cnic && helper.normalizeCnic(client.cnic)}</Text>
                            <Text style={styles.headingText}>Address</Text>
                            <Text style={styles.labelText}>{client.address}</Text>
                            <Text style={styles.headingText}>Secondary Address</Text>
                            <Text style={styles.labelText}>{client.secondary_address}</Text>
                            <Text style={styles.headingText}>Belongs To</Text>
                            <Text style={styles.labelText}>{belongs}</Text>
                        </View>
                        <View style={styles.pad}>
                            {
                                Ability.canEdit(user.subRole, 'Client') && belongs === 'Personal Client' && <MaterialCommunityIcons onPress={() => { this.navigateTo() }} name="square-edit-outline" size={26} color={AppStyles.colors.primaryColor} />
                            }
                        </View>
                    </View>
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

export default connect(mapStateToProps)(ClientDetail)