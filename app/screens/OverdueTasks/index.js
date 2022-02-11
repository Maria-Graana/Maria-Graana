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
  Alert,
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
  addInvestmentGuide,
  cancelDiaryMeeting,
  cancelDiaryViewing,
  clearDiaries,
  clearDiaryFilter,
  deleteDiaryTask,
  getActivityHistory,
  getDiaryFeedbacks,
  getDiaryTasks,
  increasePageCount,
  initiateConnectFlow,
  markDiaryTaskAsDone,
  setCategory,
  setClassificationModal,
  setConnectFeedback,
  setDairyFilterApplied,
  setMultipleModalVisible,
  setOnEndReachedLoader,
  setPageCount,
  setReferenceGuideData,
  setSelectedDiary,
  setSortValue,
} from '../../actions/diary'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import moment from 'moment'
import { DiarySortModal } from '../../components/DiarySortModal'
import { clearSlotDiaryData, setSlotData, setSlotDiaryData } from '../../actions/slotManagement'
import HistoryModal from '../../components/HistoryModal'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import diaryHelper from '../Diary/diaryHelper'
import ReferenceGuideModal from '../../components/ReferenceGuideModal'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
class OverdueTasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLeadCategoryModalVisible: false,
      showMenu: false,
      selectedDiary: null,
      isSortModalVisible: false,
      activityHistoryData: [],
      isActivityHistoryModalVisible: false,
    }
  }
  componentDidMount() {
    const { navigation, dispatch, route } = this.props
    const { count, agentName } = route.params
    navigation.setOptions({
      title: agentName ? `${agentName} Tasks (${count})` : `Overdue Tasks(${count})`,
    })
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getDiaries()
    })
  }

  componentWillUnmount() {
    const { navigation, dispatch, route } = this.props
    const { agentId } = route.params
    dispatch(setDairyFilterApplied(false))
    dispatch(clearDiaryFilter())
    dispatch(setPageCount(1))
    dispatch(setSortValue('')).then((result) => {
      dispatch(getDiaryTasks({ selectedDate: _today, agentId }))
    })
  }

  handleMenuActions = (action) => {
    const {
      navigation,
      diary,
      dispatch,
      connectFeedback,
      referenceGuide,
      selectedDiary,
      selectedLead,
      route,
    } = this.props
    const { agentId } = route?.params
    const { selectedDate } = this.state
    if (action === 'mark_as_done') {
      if (selectedDiary.taskCategory === 'simpleTask') {
        dispatch(markDiaryTaskAsDone({ agentId, overdue: true }))
      } else {
        dispatch(
          setConnectFeedback({
            ...connectFeedback,
            id: selectedDiary.id,
          })
        ).then((res) => {
          if (selectedDiary.taskType === 'meeting') {
            dispatch(
              getDiaryFeedbacks({
                taskType: selectedDiary.taskType,
                leadType: diaryHelper.getLeadType(selectedDiary),
                actionType: 'Done',
              })
            ).then((res) => {
              navigation.navigate('DiaryFeedback', { actionType: 'Done' })
            })
          } else {
            // for all other cases
            dispatch(
              getDiaryFeedbacks({
                taskType: selectedDiary.taskType,
                leadType: diaryHelper.getLeadType(selectedDiary),
                actionType: 'Done',
              })
            ).then((res) => {
              navigation.navigate('DiaryFeedback', { actionType: 'Done' })
            })
          }
        })
      }
    } else if (action === 'cancel_viewing') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          id: selectedDiary.id,
        })
      )
      dispatch(
        getDiaryFeedbacks({
          taskType: 'viewing',
          leadType: diaryHelper.getLeadType(selectedDiary),
          actionType: 'Cancel',
        })
      ).then((res) => {
        navigation.navigate('DiaryFeedback', { actionType: 'Cancel' })
      })
    } else if (action === 'cancel_meeting') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          id: selectedDiary.id,
        })
      )
      dispatch(
        getDiaryFeedbacks({
          taskType: 'meeting',
          leadType: diaryHelper.getLeadType(selectedDiary),
          actionType: 'Cancel',
        })
      ).then((res) => {
        navigation.navigate('DiaryFeedback', { actionType: 'Cancel' })
      })
    } else if (action === 'task_details') {
      const { selectedDate } = this.state
      dispatch(clearDiaries())
      if (selectedDiary) {
        dispatch(
          setSlotData(
            moment(selectedDiary.date).format('YYYY-MM-DD'),
            selectedDiary.start,
            selectedDiary.end,
            []
          )
        )
      }
      navigation.navigate('TaskDetails', {
        diary: selectedDiary,
        selectedDate,
        agentId,
        overdue: true,
      })
    } else if (action === 'edit_task') {
      this.goToAddEditDiaryScreen(true, selectedDiary)
    } else if (action === 'refer_lead') {
      this.navigateToReferAssignLead('refer')
    } else if (action === 'reassign_lead') {
      this.navigateToReferAssignLead('reassign')
    } else if (action === 'activity_history') {
      getActivityHistory(selectedLead, diaryHelper.getLeadType(selectedDiary)).then((res) => {
        if (res) {
          this.setState({ isActivityHistoryModalVisible: true, activityHistoryData: res.data })
        }
      })
    } else if (action === 'delete') {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task ?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => {
              dispatch(deleteDiaryTask({ agentId, overdue: true }))
              dispatch(clearSlotDiaryData())
              // dispatch(setSlotDiaryData(selectedDate))
              this.setState({ isDelete: true })
            },
          },
        ],
        { cancelable: false }
      )
    } else if (action === 'add_investment_guide') {
      dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: true }))
    }
  }
  navigateToReferAssignLead = (mode) => {
    const { navigation, selectedLead, selectedDiary } = this.props
    let type = null
    if (selectedDiary.armsProjectLeadId) {
      type = 'Investment'
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
    const { navigation, route } = this.props
    const { agentId } = route?.params
    const { selectedDate } = this.state
    navigation.navigate('DiaryFilter', {
      agentId,
      isOverdue: true,
      selectedDate,
    })
  }

  getDiaries = () => {
    const { dispatch, user, route } = this.props
    const { agentId } = route.params
    dispatch(getDiaryTasks({ agentId, overdue: true }))
  }

  showMenuOptions = (data) => {
    const { dispatch } = this.props
    dispatch(setSelectedDiary(data))
    this.setState({ showMenu: true })
  }

  hideMenu = () => {
    this.setState({ showMenu: false })
  }

  showSortModalVisible = (value) => {
    this.setState({ isSortModalVisible: value })
  }

  goToAddEditDiaryScreen = (update, data = null) => {
    const { navigation, dispatch } = this.props
    const { selectedDate } = this.state
    dispatch(clearDiaries())
    if (data) {
      dispatch(setSlotData(moment(data.date).format('YYYY-MM-DD'), data.start, data.end, []))
    }
    navigation.navigate('AddDiary', { update, data, selectedDate })
  }

  showMultiPhoneModal = (value) => {
    const { dispatch } = this.props
    dispatch(setMultipleModalVisible(value))
  }

  render() {
    const {
      selectedDate,
      showMenu,
      isSortModalVisible,
      isActivityHistoryModalVisible,
      activityHistoryData,
    } = this.state
    const {
      diary,
      dispatch,
      route,
      onEndReachedLoader,
      sortValue,
      isFilterApplied,
      isMultiPhoneModalVisible,
      navigation,
      referenceGuide,
      selectedDiary,
      selectedLead,
      user,
      page,
    } = this.props
    const { agentId, count } = route.params
    const { diaries, loading, showClassificationModal } = diary
    return (
      <SafeAreaView style={styles.container}>
        <AddLeadCategoryModal
          visible={showClassificationModal}
          toggleCategoryModal={(value) => {
            dispatch(setClassificationModal(value))
          }}
          onCategorySelected={(value) =>
            dispatch(
              setCategory({
                category: value,
                overdue: true,
              })
            )
          }
          selectedCategory={
            selectedLead && selectedLead.leadCategory ? selectedLead.leadCategory : null
          }
        />

        <DiarySortModal
          isSortModalVisible={isSortModalVisible}
          isOverdue={true}
          isFiltered={isFilterApplied}
          selectedDate={selectedDate}
          agentId={agentId}
          sortValue={sortValue}
          showSortModalVisible={(value) => this.showSortModalVisible(value)}
        />

        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          showMultiPhoneModal={(value) => this.showMultiPhoneModal(value)}
          navigation={navigation}
        />

        <ReferenceGuideModal
          isReferenceModalVisible={referenceGuide.isReferenceModalVisible}
          hideReferenceGuideModal={() =>
            dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: false }))
          }
          addInvestmentGuide={(guideNo, attachments) =>
            dispatch(addInvestmentGuide({ guideNo, attachments })).then((res) => {
              this.getDiaries()
            })
          }
          referenceGuideLoading={referenceGuide.referenceGuideLoading}
          referenceErrorMessage={referenceGuide.referenceErrorMessage}
        />

        <HistoryModal
          navigation={navigation}
          data={activityHistoryData}
          closePopup={(value) => this.setState({ isActivityHistoryModalVisible: value })}
          openPopup={isActivityHistoryModalVisible}
        />

        <View style={styles.rowOne}>
          <View style={styles.filterSortView}>
            <TouchableOpacity onPress={() => this.navigateToFiltersScreen()}>
              <Image
                source={
                  !isFilterApplied
                    ? require('../../../assets/img/filter.png')
                    : require('../../../assets/img/filter_blue.png')
                }
                style={styles.filterImg}
              />
            </TouchableOpacity>

            <FontAwesome5
              name="sort-amount-down-alt"
              size={24}
              color={sortValue === '' ? 'black' : AppStyles.colors.primaryColor}
              onPress={() => this.showSortModalVisible(true)}
            />
          </View>
        </View>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: diaries && diaries.rows.length - 1 ? 15 : 0 }}
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
                initiateConnectFlow={(diary) => {
                  dispatch(setSelectedDiary(diary))
                  dispatch(initiateConnectFlow()).then((res) => {
                    this.showMultiPhoneModal(true)
                  })
                }}
                isOwnDiaryView={agentId === user.id}
                assignedToMe={
                  selectedDiary &&
                  selectedDiary.armsLead &&
                  user &&
                  selectedDiary.armsLead.assigned_to_armsuser_id === user.id
                    ? true
                    : false
                }
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
            onEndReached={() => {
              if (diaries.rows.length < count && onEndReachedLoader === false) {
                dispatch(setOnEndReachedLoader(true))
                dispatch(setPageCount(page + 1))
                dispatch(getDiaryTasks({ agentId, overdue: true }))
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
    overdueCount: store.diary.overdueCount,
    page: store.diary.page,
    userShifts: store.slotManagement.userTimeShifts,
    diaryStat: store.diary.diaryStats,
    sortValue: store.diary.sort,
    isMultiPhoneModalVisible: store.diary.isMultiPhoneModalVisible,
    onEndReachedLoader: store.diary.onEndReachedLoader,
    isFilterApplied: store.diary.isFilterApplied,
    slotDiary: store.slotManagement.slotDiaryData,
    connectFeedback: store.diary.connectFeedback,
    filters: store.diary.filters,
    referenceGuide: store.diary.referenceGuide,
  }
}

export default connect(mapStateToProps)(OverdueTasks)
