/** @format */

import React from 'react'
import styles from './styles'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import { Button } from 'native-base'
import { connect } from 'react-redux'
import TeamTile from '../../components/TeamTile'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import axios from 'axios'
import helper from '../../helper'
import PickerComponent from '../../components/Picker'
import StaticData from '../../StaticData'
import Search from '../../components/Search'
import fuzzy from 'fuzzy'
class AssignLead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teamMembers: [],
      loading: true,
      selected: false,
      selectedId: null,
      searchBy: 'myTeam',
      searchText: '',
    }
  }

  componentDidMount() {
    const { route, navigation } = this.props
    const { screen, purpose } = route.params
    if (purpose === 'reassign') {
      // for Lead Assigning this function is used
      navigation.setOptions({ title: 'SELECT TEAM MEMBER' })
      this.fetchTeam()
    } else if (purpose === 'refer') {
      // For lead sharing we call this function
      navigation.setOptions({ title: 'SELECT AGENT' })
      this.fetchShareTeam()
    }
  }

  fetchTeam = () => {
    const { route } = this.props
    const { searchBy } = this.state
    const { type } = route.params
    const url =
      type === 'investment'
        ? `/api/user/agents?leads=${true}&searchBy=${searchBy}`
        : `/api/user/agents?leads=${true}&rcm=${true}&searchBy=${searchBy}`
    axios
      .get(url)
      .then((res) => {
        this.setState(
          {
            teamMembers: res.data,
          },
          () => {
            this.setState({ loading: false })
          }
        )
      })
      .catch((error) => {
        console.log(error)
        this.setState({ loading: false })
        return null
      })
  }

  assignLeadToSelectedMember = () => {
    const { navigation, route } = this.props
    const { selectedId } = this.state
    const { leadId, type, screenName } = route.params
    let body = {
      userId: selectedId,
      leadId: [leadId],
      type: type ? type.toLowerCase() : '',
    }
    axios
      .patch(`/api/leads/assign`, body)
      .then((response) => {
        if (response.status === 200) {
          helper.successToast('LEAD ASSIGNED SUCCESSFULLY')
          navigation.navigate(screenName)
        } else {
          helper.errorToast('SOMETHING WENT WRONG')
        }
      })
      .catch((error) => {
        console.log(error)
        helper.errorToast(error.message)
      })
  }

  fetchShareTeam = () => {
    const url = `/api/user/agents?sharing=${true}`
    axios
      .get(url)
      .then((res) => {
        this.setState({ teamMembers: res.data }, () => {
          this.setState({ loading: false })
        })
      })
      .catch((error) => {
        console.log(error)
        this.setState({ loading: false })
        return null
      })
  }

  shareLead = () => {
    const { navigation, route } = this.props
    const { user } = this.props
    const { selectedId } = this.state
    const { leadId, type, screenName } = route.params
    var leadid = []
    leadid.push(leadId)
    const url = type == 'investment' ? `/api/leads/project/shareLead` : `/api/leads/shareLead`
    const body = {
      sharedAt: new Date(),
      userId: selectedId,
      leadId,
      last_edited_by: user.id,
    }
    axios
      .post(url, body, { params: { id: leadid } })
      .then((res) => {
        if (res.data) {
          helper.successToast('LEAD SHARED SUCCESSFULLY')
          navigation.navigate(screenName)
        } else {
          helper.errorToast('SOMETHING WENT WRONG')
        }
      })
      .catch((error) => {
        helper.errorToast(error.message)
      })
  }

  onPressItem = (item) => {
    this.setSelected(item.id)
  }

  setSelected = (id) => {
    const { selected } = this.state
    this.setState({
      selected: !selected,
      selectedId: id,
    })
  }

  changeSearchValue = (value) => {
    this.setState({ searchBy: value, searchText: '' }, () => {
      this.fetchTeam()
    })
  }

  render() {
    const { teamMembers, loading, selected, selectedId, searchBy, searchText } = this.state
    const { user, route } = this.props
    const { screen, purpose } = route.params
    let data = []
    if (searchText !== '' && data && data.length === 0) {
      data = fuzzy.filter(searchText, teamMembers, {
        extract: (e) => (e.firstName ? e.firstName + ' ' + e.lastName : ''),
      })
      data = data.map((item) => item.original)
    } else {
      data = teamMembers
    }
    return !loading ? (
      <View style={[AppStyles.container, styles.container]}>
        <Search
          placeholder={purpose === 'reassign' ? 'Search team members here' : 'Search Agents here'}
          searchText={searchText}
          setSearchText={(value) => this.setState({ searchText: value })}
        />
        {user.role === 'admin 3' || user.role === 'sub_admin 1' ? (
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
        ) : null}

        {data.length ? (
          <FlatList
            data={data}
            renderItem={(item, index) => (
              <TeamTile
                data={item}
                onPressItem={(item) => this.onPressItem(item)}
                selected={selected}
                selectedId={selectedId}
              />
            )}
            keyExtractor={(item, index) => (item ? item.id.toString() : index.toString())}
          />
        ) : (
          <Image
            source={require('../../../assets/img/no-result-found.png')}
            resizeMode={'center'}
            style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }}
          />
        )}

        <TouchableOpacity
          disabled={!selected}
          onPress={() =>
            purpose == 'reassign' ? this.assignLeadToSelectedMember() : this.shareLead()
          }
          style={styles.assignButtonStyle}
        >
          <Text style={AppStyles.btnText}>
            {' '}
            {purpose == 'reassign' ? 'ASSIGN LEAD' : 'REFER LEAD'}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(AssignLead)
