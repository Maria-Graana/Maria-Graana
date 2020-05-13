import React from 'react';
import styles from './styles'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { Button } from "native-base";
import { connect } from 'react-redux';
import TeamTile from '../../components/TeamTile'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import axios from 'axios';
import helper from '../../helper'

class AssignLead extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamMembers: [],
            loading: true,
            selected: false,
            selectedId: null
        }
        this.fetchTeam()
    }

    fetchTeam = () => {
        axios.get('/api/user/agents')
            .then((res) => {
                this.setState({
                    teamMembers: res.data
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

    assignLeadToSelectedMember = () => {
        const { navigation, route } = this.props;
        const { selectedId } = this.state;
        const { leadId } = route.params;
        let body = {
            userId: selectedId
        }

        axios.patch(`/api/leads/assign/${leadId}`, body)
            .then(response => {
                if(response.status===200){
                    helper.successToast('LEAD ASSIGNED SUCCESSFULLY');
                    navigation.navigate('Leads');
                }
                else{
                    helper.errorToast('SOMETHING WENT WRONG');
                }
                
            }).catch(error => {
                console.log(error);
                helper.errorToast(error.message);
            })


    }

    onPressItem = (item) => {
        this.setSelected(item.id);
    }

    setSelected = (id) => {
        const { selected } = this.state;
        this.setState({
            selected: !selected,
            selectedId: id,
        })
    }


    render() {
        const { teamMembers, loading, selected, selectedId } = this.state
        return (
            !loading ?
                <View style={[AppStyles.container, styles.container]}>
                    {
                        teamMembers.length ?
                            <FlatList
                                data={teamMembers}
                                renderItem={(item, index) => (
                                    <TeamTile
                                        data={item}
                                        onPressItem={(item) => this.onPressItem(item)}
                                        selected={selected}
                                        selectedId={selectedId}
                                    />
                                )}
                                keyExtractor={(item, index) => item.id.toString()}
                            />
                            :
                            <Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
                    }
                    <TouchableOpacity
                        disabled={!selected}
                        onPress={() => this.assignLeadToSelectedMember()}
                        style={styles.assignButtonStyle}>
                        <Text style={AppStyles.btnText}> ASSIGN LEAD </Text>
                    </TouchableOpacity>
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

export default connect(mapStateToProps)(AssignLead)