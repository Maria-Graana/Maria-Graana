import React from 'react';
import styles from './style'
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import TeamTile from '../../components/TeamTile'
import AppStyles from '../../AppStyles'
import axios from 'axios';

class TeamDiary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamDiary: []
        }
        this.fetchTeam()
    }

    fetchTeam = () => {
        axios.get('/api/user/agents')
            .then((res) => {
                this.setState({
                    teamDiary: res.data
                })
            })
            .catch((error) => {
                console.log(error)
                return null
            })
    }

    navigateTo = (data) => {
        this.props.navigation.navigate('Diary', { agentId: data.id, screen: 'TeamDiary', name: `${data.firstName} ${data.lastName}'s` })
    }

    render() {
        const { teamDiary } = this.state
        return (
            <View style={[AppStyles.container, styles.container]}>
                {
                    teamDiary.length ?
                        <FlatList
                            data={teamDiary}
                            renderItem={(item, index) => (
                                <TeamTile data={item} onPressItem={this.navigateTo} />
                            )}
                            keyExtractor={(item, index) => item.id.toString()}
                        />
                        :
                        <Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
                }
            </View>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(TeamDiary)