import React from 'react';
import styles from './style'
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import TeamTile from '../../components/TeamTile'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import axios from 'axios';

class TeamDiary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamDiary: [],
            loading: true
        }
        this.fetchTeam()
    }

    fetchTeam = () => {
        axios.get('/api/user/agents')
            .then((res) => {
                this.setState({
                    teamDiary: res.data
                }, () => {
                    this.setState({ loading: false });
                })
            })
            .catch((error) => {
                console.log(error)
                this.setState({ loading: false });
                return null
            })
    }

    navigateTo = (data) => {
        const {user} = this.props;
        this.props.navigation.navigate('Diary', { agentId: data.id, screen: 'TeamDiary', managerId: user.id , name: `${data.firstName} ${data.lastName}'s` })
    }

    render() {
        const { teamDiary, loading } = this.state
        return (
            !loading ?
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

export default connect(mapStateToProps)(TeamDiary)