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
import {
  deleteDiaryTask,
  getDiaryTasks,
  increasePageCount,
  markDiaryTaskAsDone,
  setCategory,
  setClassificationModal,
  setOnEndReachedLoader,
  setPageCount,
  setSelectedDiary,
} from '../../actions/diary'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import moment from 'moment'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
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
    this.getDiaries()
  }

  componentWillUnmount() {
    const { navigation, dispatch, route } = this.props
    const { agentId } = route.params
    dispatch(getDiaryTasks(_today, agentId, false))
  }

  handleMenuActions = (action) => {
    const { navigation, diary, dispatch } = this.props
    const { selectedDiary } = diary
    const { agentId } = this.state
    if (action === 'mark_as_done') {
      dispatch(markDiaryTaskAsDone(null, agentId, true))
    } else if (action === 'cancel_viewing') {
    } else if (action === 'task_details') {
      navigation.navigate('TaskDetails', { diary: selectedDiary })
    } else if (action === 'edit_task') {
    } else if (action === 'refer_lead') {
      this.navigateToReferAssignLead('refer')
    } else if (action === 'reassign_lead') {
      this.navigateToReferAssignLead('reassign')
    } else if (action === 'delete') {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task ?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => dispatch(deleteDiaryTask(null, agentId, true)) },
        ],
        { cancelable: false }
      )
    }
  }

  navigateToReferAssignLead = (mode) => {
    const { navigation } = this.props
    const { selectedLead, selectedDiary } = this.props.diary
    let type = null
    if (selectedDiary.armsProjectLeadId) {
      type = 'investment'
    } else if (selectedDiary.armsLeadId) {
      type = selectedLead.purpose
    }
    navigation.navigate('AssignLead', {
      leadId: selectedLead.id,
      type: type,
      purpose: mode,
      screenName: 'Diary',
    })
  }

  navigateToLeadDetail = (data) => {
    const { navigation } = this.props
    let lead = null
    let purposeTab = null
    if (data.armsProjectLeadId) {
      lead = { ...data.armsProjectLead }
      purposeTab = 'invest'
    } else if (data.armsLeadId) {
      lead = { ...data.armsLead }
      purposeTab = lead.purpose
    } else if (data.wantedId) {
      lead = { ...data.wanted }
      purposeTab = lead.purpose
    }
    navigation.navigate('LeadDetail', { lead, purposeTab })
  }

  navigateToFiltersScreen = () => {
    const { navigation } = this.props
    const { agentId, selectedDate } = this.state
    navigation.navigate('DiaryFilter', { agentId, isOverdue: true, selectedDate })
  }

  getDiaries = () => {
    const { dispatch, user, route } = this.props
    const { agentId } = route.params
    dispatch(getDiaryTasks(null, agentId, true))
  }

  showMenuOptions = (data) => {
    const { dispatch } = this.props
    dispatch(setSelectedDiary(data))
    this.setState({ showMenu: true })
  }

  hideMenu = () => {
    this.setState({ showMenu: false })
  }

  render() {
    const { selectedDate, showMenu, agentId } = this.state
    const { diary, dispatch } = this.props
    const {
      diaries,
      loading,
      selectedDiary,
      selectedLead,
      showClassificationModal,
      onEndReachedLoader,
      page,
    } = diary
    return (
      <SafeAreaView style={styles.container}>
        <AddLeadCategoryModal
          visible={showClassificationModal}
          toggleCategoryModal={(value) => {
            dispatch(setClassificationModal(value))
          }}
          onCategorySelected={(value) => dispatch(setCategory(value, selectedDate, agentId))}
          selectedCategory={
            selectedLead && selectedLead.leadCategory ? selectedLead.leadCategory : null
          }
        />

        <View style={styles.rowOne}>
          <View style={styles.filterSortView}>
            <TouchableOpacity onPress={() => this.navigateToFiltersScreen()}>
              <Image source={require('../../../assets/img/filter.png')} style={styles.filterImg} />
            </TouchableOpacity>

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
                handleMenuActions={(action) => this.handleMenuActions(action)}
                setClassification={(diary) => {
                  dispatch(setSelectedDiary(diary))
                  dispatch(setClassificationModal(true))
                }}
                goToLeadDetails={this.navigateToLeadDetail}
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
            onEndReached={() => {
              if (diaries.rows.length < diaries.count) {
                //console.log(diaries.count, diaries.rows.length)
                dispatch(setOnEndReachedLoader())
                dispatch(setPageCount(page + 1))
                dispatch(getDiaryTasks(null, agentId, true, false))
              }
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => item.id.toString()}
          />
        )}
        {<OnLoadMoreComponent onEndReached={onEndReachedLoader} />}
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
    selectedDiary: store.diary.selectedDiary,
    selectedLead: store.diary.selectedLead,
    page: store.diary.page,
    pageSize: store.diary.pageSize,
  }
}

export default connect(mapStateToProps)(OverdueTasks)
