/** @format */

import * as types from '../types'
import axios from 'axios'
import helper from '../helper.js'
import _ from 'underscore'

export function getDiaryTasks(
  selectedDate,
  agentId = null,
  overdue = false,
  isFilterApplied = false
) {
  return (dispatch, getsState) => {
    let endPoint = ``
    const { page, pageSize } = getsState().diary.diary

    if (isFilterApplied) {
      // if filter is applied
      const { filters } = getsState().diary
      if (overdue) delete filters.date
      let urlValue = mapFiltersToQuery(filters)
      if (overdue) {
        endPoint = `/api/diary/all?overdue=${overdue}&page=${page}&pageSize=${pageSize}&agentId=${agentId}&${urlValue}`
      } else {
        endPoint = `/api/diary/all?agentId=${agentId}&${urlValue}&page=${page}&pageSize=${pageSize}`
      }
    } else {
      if (overdue) {
        endPoint = `/api/diary/all?overdue=${overdue}&agentId=${agentId}&page=${page}&pageSize=${pageSize}`
      } else {
        endPoint = `/api/diary/all?date[]=${selectedDate}&agentId=${agentId}&page=${page}&pageSize=${pageSize}`
      }
    }

    dispatch({
      type: types.SET_DIARY_LOADER,
      payload: true,
    })

    axios
      .get(`${endPoint}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: types.GET_DIARIES,
            payload: res.data,
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
  }
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

export function setOnEndReachedLoader() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DIARY_ON_END_REACHED_LOADER,
    })
  }
}

export function increasePageCount() {
  return (dispatch, getsState) => {
    const { page } = getsState().diary.diary
    dispatch({
      type: types.SET_DIARY_PAGE_COUNT,
      payload: page + 1,
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
        } else if (key === 'feedbacksId') {
          return `feedbacksId[]=${filters[key].value}`
        } else {
          return `${key}=${filters[key]}`
        }
      })
      .join('&')
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

export function setCategory(category, selectedDate = null, agentId) {
  return (dispatch, getsState) => {
    const { selectedLead } = getsState().diary.diary
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
            dispatch(getDiaryTasks(selectedDate, agentId))
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

export const markDiaryTaskAsDone = (selectedDate, agentId) => {
  return (dispatch, getsState) => {
    const { selectedDiary } = getsState().diary.diary
    let endPoint = ``
    endPoint = `/api/diary/update?id=${selectedDiary.id}`
    axios
      .patch(endPoint, {
        status: 'completed',
      })
      .then(function (response) {
        if (response.status == 200) {
          dispatch(getDiaryTasks(selectedDate, agentId))
          helper.successToast(`Task completed`)
          //helper.deleteLocalNotification(data.id)
        }
      })
  }
}

export const deleteDiaryTask = (selectedDate, agentId) => {
  return (dispatch, getsState) => {
    const { selectedDiary } = getsState().diary.diary
    let endPoint = ``
    endPoint = `/api/diary/delete?id=${selectedDiary.id}`
    axios
      .delete(endPoint)
      .then(function (response) {
        if (response.status === 200) {
          helper.successToast('TASK DELETED SUCCESSFULLY!')
          dispatch(getDiaryTasks(selectedDate, agentId))
          // helper.deleteLocalNotification(data.id)
        }
      })
      .catch(function (error) {
        helper.successToast(error.message)
      })
  }
}
