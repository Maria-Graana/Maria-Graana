/** @format */
/** @format */

import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { Fab } from 'native-base'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'
import DiaryTile from '../../components/DiaryTile'
import AddLeadCategoryModal from '../../components/AddLeadCategoryModal'
import helper from '../../helper.js'
import Loader from '../../components/loader'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { getDiaryTasks } from '../../actions/diary'

class OverdueTasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLeadCategoryModalVisible: false,
      agentId: '',
      showMenu: false,
      selectedDiary: null,
    }
  }
  componentDidMount() {
    const { navigation, dispatch, route } = this.props
    const { count, agentId } = route.params
    navigation.setOptions({ title: `Overdue Tasks(${count})` })
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getDiaries()
    })
  }

  getDiaries = () => {
    const { dispatch, user, route } = this.props
    const { agentId } = route.params
    dispatch(getDiaryTasks(null, agentId, true))
  }

  showMenuOptions = (data) => {
    this.setState({ selectedDiary: data, showMenu: true })
  }

  hideMenu = () => {
    this.setState({ selectedDiary: null, showMenu: false })
  }

  onCategorySelected = (value) => {
    // const { lead, fetchLead } = this.props
    const { selectedDiary } = this.state
    let body = {
      leadCategory: value,
    }
    // var leadId = []
    // leadId.push(selectedDiary.id)
    this.setState({ isLeadCategoryModalVisible: false }, () => {
      helper.successToast(`Lead Category added`)
    })
    // axios
    //   .patch(`/api/leads/project`, body, { params: { id: leadId } })
    //   .then((res) => {
    //     this.setState({ isLeadCategoryModalVisible: false }, () => {
    //       helper.successToast(`Lead Category added`)
    //     })
    //   })
    //   .catch((error) => {
    //     console.log('/api/leads/project - Error', error)
    //     helper.errorToast('Closed lead API failed!!')
    //   })
  }
  render() {
    const { selectedDiary, showMenu, isLeadCategoryModalVisible } = this.state
    const { diaries, loading } = this.props.diary
    return (
      <SafeAreaView style={styles.container}>
        <AddLeadCategoryModal
          visible={isLeadCategoryModalVisible}
          toggleCategoryModal={(value) => {
            this.setState({ isLeadCategoryModalVisible: value })
          }}
          onCategorySelected={(value) => this.onCategorySelected(value)}
          selectedCategory={
            selectedDiary && selectedDiary.leadCategory ? selectedDiary.leadCategory : null
          }
        />

        <View style={styles.rowOne}>
          <View style={styles.filterSortView}>
            <Image source={require('../../../assets/img/filter.png')} style={styles.filterImg} />
            <FontAwesome5 name="sort-amount-down-alt" size={24} color="black" />
          </View>
        </View>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={diaries.rows}
            renderItem={({ item, index }) => (
              <DiaryTile
                diary={item}
                showMenu={showMenu}
                showMenuOptions={(value) => this.showMenuOptions(value)}
                selectedDiary={selectedDiary}
                screenName={'overduetasks'}
                hideMenu={() => this.hideMenu()}
                setClassification={(value) =>
                  this.setState({
                    isLeadCategoryModalVisible: true,
                    selectedDiary: value,
                  })
                }
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
          />
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyles.colors.backgroundColor,
    flex: 1,
  },
  rowOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
  },

  filterImg: {
    resizeMode: 'contain',
    width: 24,
    marginHorizontal: 20,
  },
  filterSortView: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    diary: store.diary.diary,
  }
}

export default connect(mapStateToProps)(OverdueTasks)
