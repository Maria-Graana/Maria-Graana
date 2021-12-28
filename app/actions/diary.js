/** @format */

import * as types from '../types'
import axios from 'axios'
import helper from '../helper.js'
import _ from 'underscore'

export const FEEDBACK_ACTIONS = {
  ADD_MEETING: 'Add Meeting',
  BOOK_UNIT: 'Book a Unit',
  SETUP_VIEWING: 'Setup Viewing',
  ASSIGN: 'Assign',
  RESCHEDULE_MEETING: 'Reschedule Meeting',
  SETUP_ANOTHER_MEETING: 'Setup Another Meeting',
  RESCHEDULE_VIEWING: 'Reschedule Viewings',
  SHORTLIST_PROPERTIES: 'Shortlist Properties',
  SETUP_MORE_VIEWING: 'Setup More Viewings',
  OFFER: 'Offer',
  PROPSURE: 'Propsure',
  SELECT_PROPERTY_FOR_TRANSACTION: 'Select Property for Transaction',
  CLIENT_IS_INTERESTED_IN_INVESTMENT: 'Client is interested in Investment',
}

export function getDiaryTasks(data) {
  return (dispatch, getsState) => {
    let endPoint = ``
    let diaryRows = []
    const { page, pageSize, diaries } = getsState().diary.diary
    const { sort, isFilterApplied } = getsState().diary
    const {
      selectedDate = null,
      agentId = null,
      overdue = false,
      leadId = null,
      leadType = null,
      fromDate = null,
      toDate = null,
    } = data

    if (isFilterApplied) {
      // if filter is applied
      const { filters } = getsState().diary
      if (overdue) delete filters.date
      let urlValue = mapFiltersToQuery(filters)
      if (overdue) {
        endPoint = `/api/diary/all?overdue=${overdue}&status=pending&orderBy=${sort}&page=${page}&pageSize=${pageSize}&agentId=${agentId}&${urlValue}`
      } else {
        endPoint = `/api/diary/all?agentId=${agentId}&${urlValue}&orderBy=${sort}&page=${page}&pageSize=${pageSize}`
        // console.log('endPoint=>', endPoint)
      }
    } else if (leadId === null && leadType === null && fromDate === null && toDate === null) {
      if (overdue) {
        endPoint = `/api/diary/all?overdue=${overdue}&status=pending&agentId=${agentId}&orderBy=${sort}&page=${page}&pageSize=${pageSize}`
        // console.log('overdue=>', endPoint)
      } else {
        endPoint = `/api/diary/all?date[]=${selectedDate}&agentId=${agentId}&orderBy=${sort}&page=${page}&pageSize=${pageSize}`
        //console.log(endPoint)
      }
    } else if (fromDate && toDate) {
      endPoint = `/api/diary/all?fromDate=${fromDate}&toDate=${toDate}`
    } else {
      if (leadType === 'invest') {
        endPoint = `/api/diary/all?page=1&pageSize=100&projectId=${leadId}&status=pending`
      } else if (leadType === 'buyRent') {
        endPoint = `/api/diary/all?page=1&pageSize=100&buyrentId=${leadId}&status=pending`
      } else if (leadType === 'wanted') {
        endPoint = `/api/diary/all?page=1&pageSize=100&wantedId=${leadId}&status=pending`
      }
    }

    //console.log('endpoint', endPoint)

    if (page === 1) {
      dispatch({
        type: types.SET_DIARY_LOADER,
        payload: true,
      })
    }

    axios
      .get(`${endPoint}`)
      .then((res) => {
        if (res.data) {
          diaryRows = page === 1 ? res.data.rows : [...diaries.rows, ...res.data.rows]
          dispatch({
            type: types.GET_DIARIES,
            payload: {
              rows: diaryRows,
              count: res.data.count,
            },
          })
        }
      })

      .catch((error) => {
        console.log(error)
        dispatch({
          type: types.SET_DIARY_LOADER,
          payload: false,
        })
      })
      .finally(() => {
        dispatch(setOnEndReachedLoader(false))
      })
  }
}

export function clearDiaries() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.CLEAR_DIARIES,
      payload: {
        rows: [],
        count: null,
      },
    })
  }
}

export function getDiaryFeedbacks(payload) {
  return (dispatch, getsState) => {
    const { leadType = null, taskType = null, actionType = null } = payload
    const { selectedDiary } = getsState().diary.diary
    let url = `/api/feedbacks/fetch?taskType=${
      taskType === 'follow_up' ? 'Connect' : capitalizeWordsWithoutUnderscore(taskType, true)
    }&actionType=${actionType}&leadType=${leadType}`
    axios
      .get(url)
      .then((response) => {
        if (response) {
          dispatch({
            type: types.SET_DIARY_FEEDBACKS,
            payload: formatFeedBacks(
              response.data,
              capitalizeWordsWithoutUnderscore(taskType, true),
              selectedDiary.status
            ),
          })
        }
      })
      .catch((error) => {})
  }
}

export function setConnectFeedback(data) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_CONNECT_FEEDBACK,
      payload: data,
    })
    return Promise.resolve(true)
  }
}

const formatFeedBacks = (diaryFeedbacks, taskType, taskStatus) => {
  const FA = FEEDBACK_ACTIONS
  let additionalActions = null
  let actionAdded = false
  let updatedDiaryFeedbacks = diaryFeedbacks
  let rejectFeedback = null
  let noActionRequired = null

  // filter actions on base of task type
  diaryFeedbacks &&
    Object.keys(diaryFeedbacks).map((key, i) => {
      if (key === 'Actions' && diaryFeedbacks[key]) {
        additionalActions = diaryFeedbacks[key].filter((action) => {
          let tags = JSON.parse(action.tags[0])
          if (taskType === 'Meeting' && taskStatus === 'completed')
            return FA.SETUP_ANOTHER_MEETING in tags
          else if (taskType === 'Meeting' && taskStatus !== 'completed')
            return FA.RESCHEDULE_MEETING in tags
          else if (taskType === 'Viewing' && taskStatus === 'completed')
            return FA.SHORTLIST_PROPERTIES in tags
          else if (taskType === 'Viewing' && taskStatus !== 'completed')
            return FA.RESCHEDULE_VIEWING in tags
          else return true
        })
        delete diaryFeedbacks[key]
      }
    })
  // sorting
  if (additionalActions) {
    updatedDiaryFeedbacks = diaryFeedbacks
    diaryFeedbacks &&
      Object.keys(diaryFeedbacks).map((key, i) => {
        if (
          (key.indexOf('No Action Required') > -1 || key.indexOf('Reject') > -1) &&
          !actionAdded
        ) {
          updatedDiaryFeedbacks['Actions'] = additionalActions
          actionAdded = true
        }
        if (key.indexOf('Reject') > -1) {
          rejectFeedback = diaryFeedbacks[key]
          delete diaryFeedbacks[key]
        } else if (key.indexOf('No Action Required') > -1) {
          noActionRequired = diaryFeedbacks[key]
          delete diaryFeedbacks[key]
        } else updatedDiaryFeedbacks[key] = diaryFeedbacks[key]
      })
    if (noActionRequired) updatedDiaryFeedbacks['No Action Required'] = noActionRequired
    if (rejectFeedback) updatedDiaryFeedbacks['Reject'] = rejectFeedback
  }
  return updatedDiaryFeedbacks
}

export const saveOrUpdateDiaryTask = (taskData) => {
  let promise
  if ('id' in taskData) {
    promise = axios.patch(`/api/diary/update?id=${taskData.id}`, taskData)
  } else {
    promise = axios.post(`/api/leads/task`, taskData)
  }
  return promise
}

export function clearDiaryFeedbacks() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.CLEAR_DIARY_FEEDBACKS,
    })
  }
}

export function initiateConnectFlow() {
  return (dispatch, getsState) => {
    const { connectFeedback } = getsState().diary
    const { selectedLead } = getsState().diary.diary
    if (selectedLead && selectedLead.customer) {
      let contactsInformation = helper.createContactPayload(selectedLead.customer)
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          contactsInformation,
        })
      )
    } else {
      return Promise.reject()
    }
    return Promise.resolve(true)
  }
}

export const capitalizeWordsWithoutUnderscore = (str, skip = false) => {
  return (
    str &&
    str.replace(/(^|_)./g, function (txt) {
      let withOut = txt.replace(/_/, ' ')
      if (skip) return withOut.charAt(0).toUpperCase() + withOut.substr(1)
      else return withOut.charAt(0).toUpperCase() + withOut.substr(1).toUpperCase()
    })
  )
}

export function setSelectedDiary(diary) {
  return (dispatch, getsState) => {
    let lead = null
    if (diary.armsProjectLeadId) {
      lead = { ...diary.armsProjectLead }
    } else if (diary.armsLeadId) {
      lead = { ...diary.armsLead }
    } else if (diary.wantedId) {
      lead = { ...diary.wanted }
    }
    dispatch({
      type: types.SET_SELECTED_DIARY,
      payload: {
        diary,
        lead,
      },
    })
  }
}

export function setOnEndReachedLoader(value) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DIARY_ON_END_REACHED_LOADER,
      payload: value,
    })
  }
}

export function setDairyFilterApplied(value) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DAIRY_FILTER_APPLIED,
      payload: value,
    })
    return Promise.resolve(true)
  }
}

export function setPageCount(count) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DIARY_PAGE_COUNT,
      payload: count,
    })
  }
}

export function setDiaryFilterReason(reason) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DIARY_FILTER_REASON,
      payload: reason,
    })
  }
}

export const mapFiltersToQuery = (filters) => {
  if (filters) {
    for (let key in filters) {
      if (filters[key] === '' || !filters[key]) {
        delete filters[key]
      }
    }
    const qs = Object.keys(filters)
      .map((key) => {
        if (key === 'date') {
          return `date[]=${filters[key]}`
        } else if (key === 'feedbackId') {
          return filters[key].map((item) => `&feedbacksId[]=${item}`)
        } else {
          return `${key}=${filters[key]}`
        }
      })
      .join('&')
      .replace(/,/g, '')
    return qs
  }
}

export function setDiaryFilter(data) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DIARY_FILTER,
      payload: data,
    })
  }
}

export function clearDiaryFilter() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.CLEAR_DIARY_FILTER,
    })
  }
}

export function getOverdueCount(agentId) {
  return (dispatch, getsState) => {
    let endPoint = ``
    endPoint = `/api/diary/overdue/count?userID=${agentId}`
    axios
      .get(`${endPoint}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: types.SET_DIARY_OVERDUE_COUNT,
            payload: res.data.count,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

export const setClassificationModal = (value) => {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_CLASSIFICATION_MODAL,
      payload: value,
    })
  }
}

export const setSortValue = (value) => {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DIARY_SORT,
      payload: value,
    })
    return Promise.resolve(true)
  }
}

export function setCategory(data) {
  return (dispatch, getsState) => {
    const { selectedLead } = getsState().diary.diary
    const { category, selectedDate = null, agentId = null, overdue = false, leadType = null } = data
    if (selectedLead) {
      let endPoint = ``
      let body = {
        leadCategory: category,
      }
      endPoint = selectedLead.projectId ? `/api/leads/project` : `api/leads`
      var leadId = []
      leadId.push(selectedLead.id)
      axios
        .patch(endPoint, body, { params: { id: leadId } })
        .then((res) => {
          dispatch(setClassificationModal(false))
          if (res.status === 200) {
            helper.successToast(`Lead Category added`)
            dispatch(
              getDiaryTasks({ selectedDate, agentId, overdue, leadId: selectedLead.id, leadType })
            )
          } else {
            helper.successToast(`Something went wrong!`)
          }
        })
        .catch((error) => {
          console.log('/api/leads/project - Error', error)
          dispatch(setClassificationModal(false))
        })
    }
  }
}

export const markDiaryTaskAsDone = (data) => {
  return (dispatch, getsState) => {
    const { selectedDiary } = getsState().diary.diary
    const {
      selectedDate = null,
      agentId = null,
      overdue = false,
      leadId = null,
      leadType = null,
    } = data
    let endPoint = ``
    endPoint = `/api/diary/update?id=${selectedDiary.id}`
    if (
      selectedDiary &&
      selectedDiary.taskType === 'morning_meeting' &&
      selectedDiary.taskType === 'daily_update' &&
      selectedDiary.taskType === 'meeting_with_pp'
    ) {
      axios
        .patch(endPoint, {
          status: 'completed',
        })
        .then(function (response) {
          if (response.status == 200) {
            dispatch(getDiaryTasks({ selectedDate, agentId, overdue, leadId, leadType }))
            helper.successToast(`Task completed`)
            //helper.deleteLocalNotification(data.id)
          }
        })
    } else {
      // diary feedback flow - > meeting, viewing
    }
  }
}

export const deleteDiaryTask = (data) => {
  return (dispatch, getsState) => {
    const { selectedDiary } = getsState().diary.diary
    const {
      selectedDate = null,
      agentId = null,
      overdue = false,
      leadId = null,
      leadType = null,
    } = data
    let endPoint = ``
    endPoint = `/api/diary/delete?id=${selectedDiary.id}`
    axios
      .delete(endPoint)
      .then(function (response) {
        if (response.status === 200) {
          helper.successToast('TASK DELETED SUCCESSFULLY!')
          dispatch(getDiaryTasks({ selectedDate, agentId, overdue, leadId, leadType }))
          // helper.deleteLocalNotification(data.id)
        }
      })
      .catch(function (error) {
        helper.successToast(error.message)
      })
  }
}

export const cancelDiaryViewing = (data) => {
  return (dispatch, getsState) => {
    const { selectedDiary, selectedLead } = getsState().diary.diary
    const {
      selectedDate = null,
      agentId = null,
      overdue = false,
      leadId = null,
      leadType = null,
    } = data
    if (selectedDiary.propertyId) {
      axios
        .delete(
          `/api/diary/delete?id=${selectedDiary.id}&propertyId=${selectedDiary.id}&leadId=${selectedLead.id}`
        )
        .then((res) => {
          dispatch(getDiaryTasks({ selectedDate, agentId, overdue, leadId, leadType }))
          //helper.deleteLocalNotification(property.diaries[0].id)
          //this.fetchProperties()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}

export const cancelDiaryMeeting = (data) => {
  return (dispatch, getsState) => {
    const { selectedDiary, selectedLead } = getsState().diary.diary
    const {
      selectedDate = null,
      agentId = null,
      overdue = false,
      leadId = null,
      leadType = null,
    } = data
    axios
      .delete(`/api/diary/delete?id=${selectedDiary.id}&cmLeadId=${selectedLead.id}`)
      .then((res) => {
        dispatch(getDiaryTasks({ selectedDate, agentId, overdue, leadId, leadType }))
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

// ARMS-2448 start
export const getDiaryStats = (userId, day, startTime, endTime) => {
  return (dispatch, getsState) => {
    let endPoint = `/api/diary/stats?userId=${userId}&day=${day}&startTime=${startTime}&endTime=${endTime}`
    axios
      .get(endPoint)
      .then((response) =>
        dispatch({
          type: types.GET_DIARY_STATS,
          payload: response.data,
        })
      )
      .catch((error) => {
        //console.log(endPoint)
        console.log('error', error)
      })
  }
}
// ARMS-2448 end
