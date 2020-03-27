import * as React from 'react';
import styles from './style'
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ability from '../../hoc/Ability';
import { Button } from 'native-base';
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import StaticData from '../../StaticData';

class LeadMatch extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    navigateTo = () => {
        const { route } = this.props
        const {client}= route.params
        this.props.navigation.navigate('AddClient', {client: client, update: true})
    }

    render() {
        const { route, user } = this.props
        const teamDiary= StaticData.teamDiaryRows
        // const {client}= route.params
        return (
            <View style={[AppStyles.container, styles.container, {backgroundColor: AppStyles.colors.backgroundColor}]}>
                <FlatList
                    data={teamDiary}
                    renderItem={(item, index) => (
                        // <MatchTile />
                        <AgentTile />
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

export default connect(mapStateToProps)(LeadMatch)