/** @format */

import React from 'react'
import { connect } from 'react-redux'
import { View, FlatList, Animated, TouchableOpacity, Text } from 'react-native'
import _ from 'underscore'
import fuzzy from 'fuzzy'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import {
  getAreas,
  clearAreas,
  setAreaLoader,
  setSelectedAreas,
  getAreasByZone,
} from '../../actions/areas'
import styles from './styles'
import Search from '../../components/Search'
import MyCheckBox from '../../components/MyCheckBox'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class AreaPickerScreen extends React.Component {
  areaIds = []
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      selectedAreaIds: this.areaIds,
    }
  }

  componentDidMount() {
    const { route, dispatch, selectedAreaIds } = this.props
    const { cityId, screenName } = route.params
    dispatch(setAreaLoader(true))
    if (screenName === 'CreateUser') {
      // FROM CREATE USER SCREEN THE AREA ASSIGNMENT FLOW IS DIFFERENT SO HANDLING IT DIFFERENTLY
      dispatch(getAreasByZone())
    } else {
      dispatch(getAreas(cityId))
    }

    if (route.params.isEditMode) {
      this.areaIds = [...selectedAreaIds]

      this.setState({ selectedAreaIds: this.areaIds })
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    const { selectedAreaIds } = this.state

    // Set Areas selected and update redux store
    dispatch(setSelectedAreas(selectedAreaIds))
    dispatch(clearAreas())
  }

  setSelectedArea = (obj) => {
    this.areaIds = [...this.state.selectedAreaIds]
    if (this.areaIds.includes(obj.value)) {
      this.areaIds = _.without(this.areaIds, obj.value)
    } else {
      this.areaIds.push(obj.value)
    }
    this.setState({ selectedAreaIds: this.areaIds }, () => {})
  }

  setStatus = (item) => {
    return _.contains(this.areaIds, item.value) ? true : false
  }

  renderListWithMultipleSelectOptions = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.setSelectedArea(item)}>
        <View style={styles.rowContainerMultipleStyle}>
          <Text style={styles.rowTextStyle}>{item.name}</Text>
          <MyCheckBox status={this.setStatus(item)} onPress={() => this.setSelectedArea(item)} />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { searchText } = this.state
    const { areas, loading } = this.props
    let data = []

    if (searchText !== '' && data.length === 0) {
      data = fuzzy.filter(searchText, areas, { extract: (e) => e.name + ' ' })
      data = data.map((item) => item.original)
    } else {
      data = areas
    }
    return !loading ? (
      <View
        style={[
          AppStyles.container,
          { paddingHorizontal: 0, backgroundColor: AppStyles.bgcWhite.backgroundColor },
        ]}
      >
        <Search
          placeholder="Search areas..."
          searchText={searchText}
          setSearchText={(value) => this.setState({ searchText: value })}
        />
        <AnimatedFlatList
          data={data}
          renderItem={this.renderListWithMultipleSelectOptions}
          keyExtractor={(item, index) => String(index)}
          scrollIndicatorInsets={{ top: 0 }}
        />
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

export default connect((store) => {
  return {
    areas: store.areasReducer.areas,
    loading: store.areasReducer.areaLoader,
    selectedAreaIds: store.areasReducer.selectedAreas,
  }
})(AreaPickerScreen)
