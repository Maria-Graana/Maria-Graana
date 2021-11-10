/** @format */

import helper from '../../helper'
import _ from 'underscore'
import moment from 'moment'

const DiaryHelper = {
  removeUnderscore(str) {
    var i,
      frags = str.split('_')
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
    }
    return frags.join(' ')
  },

  showTaskType(val) {
    let finalValue = ''
    if (val) {
      finalValue = DiaryHelper.removeUnderscore(val)
      return finalValue
    } else {
      return finalValue
    }
  },

  showClientName(diary) {
    if (
      diary &&
      diary.armsProjectLeadId &&
      diary.armsProjectLead &&
      diary.armsProjectLead.customer
    ) {
      return `-${diary.armsProjectLead.customer.first_name} ${diary.armsProjectLead.customer.last_name}`
    } else if (diary && diary.armsLeadId && diary.armsLead && diary.armsLead.customer) {
      return `-${diary.armsLead.customer.first_name} ${diary.armsLead.customer.last_name}`
    } else {
      return ''
    }
  },

  checkLeadType(diary) {
    if (diary && diary.armsProjectLeadId) {
      return 'Invest'
    } else if (diary && diary.armsLeadId && diary.armsLead) {
      if (diary.armsLead.purpose === 'sale') {
        return 'Buy'
      } else {
        return 'Rent'
      }
    } else if (diary.wantedId) {
      return 'Wanted'
    } else {
      return ''
    }
  },

  checkLeadCategory(diary) {
    if (diary && diary.armsProjectLead && diary.armsProjectLead.leadCategory) {
      return diary.armsProjectLead.leadCategory
    } else if (diary && diary.armsLeadId && diary.armsLead && diary.armsLead.leadCategory) {
      return diary.armsLead.leadCategory
    } else {
      return 'Not Defined'
    }
  },

  setLeadCategoryColor(diary) {
    if (diary && diary.armsProjectLead && diary.armsProjectLead.leadCategory) {
      const { leadCategory } = diary.armsProjectLead
      if (leadCategory === 'Hot') {
        return '#e63434'
      } else if (leadCategory === 'Cold') {
        return '#1688db'
      } else if (leadCategory === 'Warm') {
        return '#ff6c00'
      }
    } else if (diary && diary.armsLead && diary.armsLead && diary.armsLead.leadCategory) {
      const { leadCategory } = diary.armsLead
      if (leadCategory === 'Hot') {
        return '#e63434'
      } else if (leadCategory === 'Cold') {
        return '#1688db'
      } else if (leadCategory === 'Warm') {
        return '#ff6c00'
      }
    } else {
      return 'grey'
    }
  },

  showRequirements(diary) {
    const { armsProjectLeadId, armsLeadId, armsLead, armsProjectLead, wantedId, wanted } = diary
    if (diary && armsProjectLeadId) {
      if (armsProjectLead && armsProjectLead.projectType) {
        return `${armsProjectLead.projectType} in ${armsProjectLead.projectName}`
      } else if (armsProjectLead && armsProjectLead.projectId && armsProjectLead.projectName) {
        return `${armsProjectLead.projectName}`
      } else {
        return ''
      }
    } else if (diary && armsLeadId) {
      if (armsLead) {
        return `${armsLead.size} ${helper.capitalize(armsLead.size_unit)} ${helper.capitalize(
          armsLead.subtype
        )} in ${armsLead.city.name}`
      }
    } else if (wantedId) {
      if (wanted) {
        return `${wanted.size} ${helper.capitalize(wanted.size_unit)} ${helper.capitalize(
          wanted.subtype
        )} in ${wanted.city.name}`
      }
    } else {
      return ''
    }
  },

  getLeadId(diary) {
    if (diary.armsLeadId) {
      return `ID:${diary.armsLeadId}`
    } else if (diary.armsProjectLeadId) {
      return `ID:${diary.armsProjectLeadId}`
    } else if (diary.wantedId) {
      return `ID:${diary.wantedId}`
    } else {
      return ''
    }
  },

  calculateTimeDifference(diary) {
    if (diary && diary.start && diary.end) {
      // calculate total duration
      let start = moment(diary.start)
      let end = moment(diary.end)
      var duration = moment.duration(end.diff(start))
      let hoursDifference = parseInt(duration.asHours())
      let minsDifference = parseInt(duration.asMinutes()) % 60
      if (hoursDifference >= 1) {
        return `(${hoursDifference} h)`
      } else {
        return `(${minsDifference} m)`
      }
    } else {
      return ''
    }
  },
  displayTaskColor(diary) {
    if (diary) {
      const { taskType } = diary
      if (diary.status === 'completed') {
        return '#9A9A9A'
      } else if (taskType === 'meeting') {
        return '#006FF2'
      } else if (taskType === 'follow_up') {
        return '#FFC61B'
      } else if (taskType === 'connect') {
        return '#7BB461'
      } else if (taskType === 'viewing') {
        return '#006FF2'
      } else if (taskType === 'daily_meeting') {
        return '#73C2FE'
      } else if (taskType === 'morning_meeting') {
        return '#73C2FE'
      }
    }
  },
}

module.exports = DiaryHelper
