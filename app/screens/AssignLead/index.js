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
import PickerComponent from '../../components/Picker';
import StaticData from '../../StaticData';
class AssignLead extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamMembers: [],
            loading: true,
            selected: false,
            selectedId: null,
            searchBy: 'myTeam',
        }
    }

    componentDidMount() {
        this.fetchTeam()
    }

    fetchTeam = () => {
        const { route } = this.props;
        const { searchBy } = this.state;
        const { type } = route.params
        const url = type === 'Investment' ? `/api/user/agents?leads=${true}&searchBy=${searchBy}` : `/api/user/agents?leads=${true}&rcm=${true}&searchBy=${searchBy}`
        axios.get(url)
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
        const { leadId, type } = route.params;
        let body = {
            userId: selectedId,
            leadId: [leadId],
            type: type ? type.toLowerCase() : ''
        }
        axios.patch(`/api/leads/assign`, body)
            .then(response => {
                if (response.status === 200) {
                    helper.successToast('LEAD ASSIGNED SUCCESSFULLY');
                    navigation.navigate('Leads');
                }
                else {
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

    changeSearchValue = (value) => {
        this.setState({ searchBy: value }, () => {
            this.fetchTeam()
        })
    }


    render() {
        const { teamMembers, loading, selected, selectedId, searchBy } = this.state
        const { user } = this.props;
        return (
            !loading ?
                <View style={[AppStyles.container, styles.container]}>
                    {
                        user.role === 'admin 3' || user.role === 'sub_admin 1' ?
                            <View style={styles.pickerMain}>
                                <PickerComponent
                                    placeholder={'Search By'}
                                    data={StaticData.searchTeamBy}
                                    customStyle={styles.pickerStyle}
                                    customIconStyle={styles.customIconStyle}
                                    onValueChange={this.changeSearchValue}
                                    selectedItem={searchBy}
                                />
                            </View>
                            : null
                    }

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
                                keyExtractor={(item, index) => item ? item.id.toString() : index.toString()}
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