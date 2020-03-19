import React from 'react';
import styles from './style'
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import TeamTile from '../../components/TeamTile'
import AppStyles from '../../AppStyles'
import { StackActions } from '@react-navigation/native';
import StaticData from '../../StaticData';

class TeamDiary extends React.Component {
	constructor(props) {
		super(props)   
		this.state = {
        }
    }

    navigateTo = (data) => {
        console.log(data)
    }

	render() {
		return (
            <View style={[AppStyles.container, styles.container]}>
                <FlatList
                    data={StaticData.teamDiaryRows}
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