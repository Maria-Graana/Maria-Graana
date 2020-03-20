import React from 'react';
import styles from './style'
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import TeamTile from '../../components/TeamTile'
import AppStyles from '../../AppStyles'
import StaticData from '../../StaticData';
import axios from 'axios';

class TeamDiary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
        }
        this.fetchTeam()
    }

    fetchTeam = () => {
        axios.get('/api/user/agents')
        .then((res) =>{
           // console.log(res.data)
            this.setState({
                teamDiary: res.data
            })
        })
        .catch ((error) => {
            console.log(error)
            return null
        })
    }

    navigateTo = (data) => {
        console.log(data)
        this.props.navigation.navigate('Diary', {agentId: data.id, screen: 'TeamDiary'})
    }

	render() {
        const {teamDiary}= this.state
		return (
            <View style={[AppStyles.container, styles.container]}>
                <FlatList
                    data={teamDiary}
                    renderItem={(item, index) => (
                        <TeamTile data={item} onPressItem= {this.navigateTo}/>
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

export default connect(mapStateToProps)(TeamDiary)