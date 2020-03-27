import React from 'react';
import styles from './style'
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ability from '../../hoc/Ability';
import { Button } from 'native-base';

class LeadDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    navigateTo = () => {
        const { navigation } = this.props
        navigation.navigate('LeadTabs')
    }

    render() {
        const { route, user } = this.props;
        // const {client}= route.params
        return (
            <View style={[AppStyles.container, styles.container, {backgroundColor: AppStyles.colors.backgroundColor}]}>
                <View style={styles.outerContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.headingText}> Lead Type</Text>
                        <Text style={styles.labelText}> Buy </Text>
                        <Text style={styles.headingText}> Client Name </Text>
                        <Text style={styles.labelText}> Jamil Malik </Text>
                        <Text style={styles.headingText}> Requirement </Text>
                        <Text style={styles.labelText}> 12 Marla House </Text>
                        <Text style={styles.headingText}> Area </Text>
                        <Text style={styles.labelText}> F-10 Markaz, Islamabad </Text>
                        <Text style={styles.headingText}> Price Range </Text>
                        <Text style={styles.labelText}> PKR 2 Core - 2.5 Corer </Text>
                        <View style={styles.underLine} />
                        <Text style={styles.headingText}> Created Date </Text>
                        <Text style={styles.labelText}> 25 March, 2020 </Text>
                        <Text style={styles.headingText}> Modified Date </Text>
                        <Text style={styles.labelText}> 26 March, 2020 </Text>
                        <Text style={styles.headingText}> Lead Source </Text>
                        <Text style={styles.labelText}> Online Marketing </Text>
                        <Text style={styles.headingText}> Additional Information </Text>
                        <Text style={styles.labelText}> Walk-in lead </Text>
                    </View>
                    <View style={styles.pad}>
                        <Text style={[styles.headingText, styles.padLeft]}> Status </Text>
                        {
                            Ability.canEdit(user.role, 'Client') && <MaterialCommunityIcons onPress={() => {this.navigateTo()}} name="square-edit-outline" size={26} color={AppStyles.colors.primaryColor} />
                        }
                    </View>
                </View>
                <View style={[AppStyles.mainInputWrap]}>
					<Button
						onPress={() => { this.navigateTo() }}
						style={[AppStyles.formBtn, styles.btn1]}>
						<Text style={AppStyles.btnText}>MATCH PROPERTIES</Text>
					</Button>
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

export default connect(mapStateToProps)(LeadDetail)