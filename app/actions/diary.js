/** @format */

import * as types from '../types'
import axios from 'axios'
import helper from '../helper.js'
import _ from 'underscore'

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
    } else if (leadId === null && leadType === null) {
      if (overdue) {
        endPoint = `/api/diary/all?overdue=${overdue}&status=pending&agentId=${agentId}&orderBy=${sort}&page=${page}&pageSize=${pageSize}`
        // console.log('overdue=>', endPoint)
      } else {
        endPoint = `/api/diary/all?date[]=${selectedDate}&agentId=${agentId}&orderBy=${sort}&page=${page}&pageSize=${pageSize}`
        //console.log(endPoint)
      }
    } else {
      if (leadType === 'invest') {
        endPoint = `/api/diary/all?page=1&pageSize=100&projectId=${leadId}&status=pending`
      } else if (leadType === 'buyRent') {
        endPoint = `/api/diary/all?page=1&pageSize=100&buyrentId=${leadId}&status=pending`
      }
    }

    // console.log('endpoint', endPoint)

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
