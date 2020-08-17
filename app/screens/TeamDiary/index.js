import React from 'react';
import styles from './style'
import { View, FlatList, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import TeamTile from '../../components/TeamTile'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import axios from 'axios';
import fuzzy from 'fuzzy'
import Search from '../../components/Search';

class TeamDiary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamDiary: [],
            loading: true,
            searchText: '',
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
        const { user } = this.props;
        this.props.navigation.navigate('Diary', { agentId: data.id, screen: 'TeamDiary', managerId: user.id, name: `${data.firstName} ${data.lastName}'s` })
    }

    render() {
        const { teamDiary, loading, searchText } = this.state
        let data = [];
        if (searchText !== '' && data.length === 0) {
            data = fuzzy.filter(searchText, teamDiary, { extract: (e) => (e.firstName ? e.firstName + e.lastName : '') })
            data = data.map((item) => item.original)
        }
        else {
            data = teamDiary;
        }
        return (
            !loading ?
                <View style={[AppStyles.container, styles.container]}>
                    <Search placeholder='Search agents here' searchText={searchText} setSearchText={(value) => this.setState({ searchText: value })} />
                    {
                        data.length ?
                            <FlatList
                                data={data}
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