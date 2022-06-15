/** @format */

import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  FlatList,
  Animated,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
  Image,
} from 'react-native'
import _ from 'underscore'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import styles from './styles'
import fuzzy from 'fuzzy'
import AppStyles from '../../AppStyles'
import backArrow from '../../../assets/img/backArrow.png'
import MyCheckBox from '../MyCheckBox'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class AreaPicker extends React.Component {
  areaIds = []
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      selectedAreaIds: this.areaIds,
      loading: true,
    }
  }

  componentDidMount() {
    this.props.onRef(this)
    this.updateSelectedAreas()
  }

  updateSelectedAreas = () => {
    const { selectedAreaIds } = this.props
    this.areaIds = [...selectedAreaIds]
    this.setState({ selectedAreaIds: [...selectedAreaIds] })
  }

  emptyList = () => {
    this.areaIds = []
    this.setState({ selectedAreaIds: [] })
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

  submit = () => {
    const { selectedAreaIds } = this.state
    this.props.handleForm(selectedAreaIds, 'leadAreas')
    this.props.openModal()
  }

  setStatus = (item) => {
    return _.contains(this.areaIds, item.value) ? true : false
  }

  renderListWithMultipleSelectOptions = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.setSelectedArea(item)}>
        <View
          style={{
            width: wp('100%'),
            paddingTop: hp('1.5%'),
            paddingBottom: hp('1.5%'),
            flexDirection: 'row',
            alignItems: 'center',
            borderTopColor: '#ddd',
            borderTopWidth: 0.5,
            alignSelf: 'stretch',
          }}
        >
          <Text
            style={{
              color: AppStyles.colors.textColor,
              marginLeft: wp('2.5%'),
              fontSize: 18,
              width: wp('80%'),
            }}
          >
            {item.name}
          </Text>
          <MyCheckBox onPress={() => this.setSelectedArea(item)} status={this.setStatus(item)} />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { searchText, loading } = this.state
    const { isVisible, areas } = this.props
    let data = []

    if (searchText !== '' && data.length === 0) {
      data = fuzzy.filter(searchText, areas, { extract: (e) => e.name })
      data = data.map((item) => item.original)
    } else {
      data = areas
    }
    return (
      // !loading ?
      <Modal visible={isVisible} animationType="slide" onRequestClose={isVisible}>
        <SafeAreaView style={[AppStyles.mb1, {}]}>
          <View
            style={{ flexDirection: 'row', marginHorizontal: 10, justifyContent: 'space-between' }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.openModal()
              }}
            >
              <Image source={backArrow} style={[styles.backImg]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.submit()}>
              <Text
                style={{ paddingTop: 10, fontSize: 16, fontFamily: AppStyles.fonts.defaultFont }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              AppStyles.container,
              { paddingHorizontal: 10, backgroundColor: AppStyles.bgcWhite.backgroundColor },
            ]}
          >
            <View
              style={[
                AppStyles.formControl,
                AppStyles.inputPadLeft,
                {
                  justifyContent: 'center',
                  marginTop: 15,
                  marginBottom: 15,
                  borderColor: 'grey',
                  borderWidth: 0.5,
                },
              ]}
            >
              <TextInput
                placeholderTextColor={'#a8a8aa'}
                placeholder=" Type to filter "
                value={searchText}
                onChangeText={(value) => this.setState({ searchText: value })}
              />
            </View>
            <AnimatedFlatList
              data={data}
              renderItem={this.renderListWithMultipleSelectOptions}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{ paddingTop: 0 }}
              scrollIndicatorInsets={{ top: 0 }}
            />
          </View>
        </SafeAreaView>
      </Modal>
      // :
      // <Loader loading={loading} />
    )
  }
}

export default connect((store) => {
  return {}
})(AreaPicker)
