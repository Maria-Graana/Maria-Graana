import React from 'react';
import styles from './style'
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ability from '../../hoc/Ability';
import helper from '../../helper';

class ClientDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        const { route } = this.props
    }

    navigateTo = () => {
        const { route } = this.props
        const { client } = route.params
        this.props.navigation.navigate('AddClient', { client: client, update: true })
    }

    render() {
        const { route, user } = this.props;
        const { client } = route.params

        return (
            <View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                <View style={styles.outerContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.headingText}>First Name </Text>
                        <Text style={styles.labelText}>{client.firstName} </Text>
                        <Text style={styles.headingText}>Last Name </Text>
                        <Text style={styles.labelText}>{client.lastName} </Text>
                        <Text style={styles.headingText}>Contact Number </Text>
                        <Text style={styles.labelText}>{client.contact1} </Text>
                        {
                            client.email ?
                                <View>
                                    <Text style={styles.headingText}>Email </Text>
                                    <Text style={styles.labelText}>{client.email} </Text>
                                </View>
                                :
                                null
                        }

                        {
                            client.cnic ?
                                <View>
                                    <Text style={styles.headingText}>CNIC </Text>
                                    <Text style={styles.labelText}>{client.cnic && helper.normalizeCnic(client.cnic)}</Text>
                                </View>
                                :
                                null
                        }
                        {
                            client.address ?
                                <View>
                                    <Text style={styles.headingText}>Address </Text>
                                    <Text style={styles.labelText}>{client.address} </Text>
                                </View>
                                :
                                null
                        }
                        {
                            client.secondary_address ?
                                <View>
                                    <Text style={styles.headingText}>Secondary Address</Text>
                                    <Text style={styles.labelText}>{client.secondary_address} </Text>
                                </View>
                                : null
                        }

                    </View>
                    <View style={styles.pad}>
                        {
                            Ability.canEdit(user.role, 'Client') && <MaterialCommunityIcons onPress={() => { this.navigateTo() }} name="square-edit-outline" size={26} color={AppStyles.colors.primaryColor} />
                        }
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

export default connect(mapStateToProps)(ClientDetail)