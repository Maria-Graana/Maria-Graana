/** @format */

import * as types from '../types'
import axios from 'axios'
import helper from '../helper.js'

export function getDiaryTasks(selectedDate, agentId = null, overdue = false) {
  return (dispatch, getsState) => {
    let endPoint = ``
    if (overdue) {
      endPoint = `/api/diary/all?overdue=${overdue}&agentId=${agentId}`
    } else {
      endPoint = `/api/diary/all?date[]=${selectedDate}&agentId=${agentId}`
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
