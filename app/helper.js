/** @format */

import { Linking } from 'react-native'
import { Toast, Content } from 'native-base'
import moment from 'moment-timezone'
import StaticData from './StaticData'
import { formatPrice } from './PriceFormate'
import AppStyles from './AppStyles'
import DiaryImg from '../assets/img/diary-icon-l.png'
import InventoryImg from '../assets/img/properties-icon-l.png'
import TeamDiaryImg from '../assets/img/teams-diary-icon-l.png'
import LeadsImg from '../assets/img/lead-icon-l.png'
import DashboardImg from '../assets/img/dashboard-icon-l.png'
import TargetsImg from '../assets/img/target-icon-l.png'
import ClientsImg from '../assets/img/clients-icon-l.png'
import * as Contacts from 'expo-contacts'
import * as Sentry from 'sentry-expo'
import _ from 'underscore'
import * as Notifications from 'expo-notifications'
import TimerNotification from './LocalNotifications'
import Ability from './hoc/Ability'

const helper = {
  successToast(message) {
    Toast.show({
      text: message,
      duration: 3000,
      type: 'success',
    })
  },
  errorToast(message) {
    Toast.show({
      text: message,
      duration: 3000,
      type: 'danger',
    })
  },
  warningToast(message) {
    Toast.show({
      text: message,
      duration: 3000,
      type: 'warning',
    })
  },
  internetToast(message) {
    Toast.show({
      text: message,
      duration: 3000,
      type: 'warning',
    })
  },
  normalizeCnic(value) {
    if (!value) {
      return value
    }
    const onlyNums = value && value.toString().replace(/[^\d]/g, '')
    if (onlyNums.length <= 5) {
      return onlyNums
    }
    if (onlyNums.length <= 12) {
      return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5)}`
    }
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 12)}-${onlyNums.slice(12, 13)}`
  },
  normalizePhone(value) {
    if (!value) {
      return value
    }
    const onlyNums = value && value.toString().replace(/[^\d]/g, '')
    if (onlyNums.length <= 4) {
      return onlyNums
    }
    if (onlyNums.length <= 9) {
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(11)}`
    }
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 11)}`
  },
  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },
  capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
  },
  convertTimeZoneTimeStamp(date) {
    let _format = 'YYYY-MM-DDTHH:mm'
    let paktz = moment.tz(date, 'Asia/Karachi').format(_format)
    var duration = moment.duration({ hours: 5, minutes: 15 })
    var sub = moment(paktz, _format).subtract(duration).format()

    return new Date(sub).valueOf()
  },
  convertTimeZone(date) {
    let _format = 'YYYY-MM-DDTHH:mm'
    let paktz = moment.tz(date, 'Asia/Karachi').format(_format)
    var duration = moment.duration({ hours: 5 })
    var sub = moment(paktz, _format).subtract(duration).format()
    return new Date(sub)
  },
  leadMenu(data) {
    let lead = []
    if (data.length) {
      data.map((item, index) => {
        item.menu = false
        lead.push(item)
      })
      return lead
    } else return []
  },
  propertyCheck(data) {
    let matches = []
    if (data.length) {
      data.map((item, index) => {
        if (item.graana_id) {
          item.images = item.property_images || []
        } else {
          item.images = item.armsPropertyImages || []
        }
        if ('armsuser' in item) {
          item.user = item.armsuser
          item.checkBox = false
          return matches.push(item)
        } else {
          item.checkBox = false
          return matches.push(item)
        }
      })
      return matches
    } else return []
  },
  propertyIdCheck(data) {
    let matches = []
    if (data.length) {
      data.map((item, index) => {
        if (item.graana_id) {
          item.images = item.property_images || []
          item.checkBox = false
          return matches.push(item)
        } else {
          item.images = item.armsPropertyImages || []
          item.checkBox = false
          item.user = item.armsuser
          return matches.push(item)
        }
      })
      return matches
    } else return []
  },
  setStatusText(val, todayDate) {
    let taskDate = moment(val.date).format('YYYY-MM-DD')
    if (val.taskCategory === 'simpleTask') {
      // simple task is reffered to task added from diary directly or through lead but taskcategory is simpleTask
      if (taskDate > todayDate && val.status !== 'inProgress' && val.status !== 'completed') {
        return 'To-do'
      } else if (
        taskDate < todayDate &&
        val.status !== 'inProgress' &&
        val.status !== 'completed'
      ) {
        return 'Overdue'
      } else if (val.status === 'inProgress') {
        return 'In Progress'
      } else if (val.status === 'completed') {
        return 'Completed'
      } else if (val.status === 'pending') {
        return 'To-do'
      }
    } else if (val.taskType === 'viewing') {
      if (val.status === 'completed') {
        return 'Viewing Done'
      } else {
        return 'Viewing Pending'
      }
    } else {
      // THIS IS DONE SPECIFICALLY FOR MEETING ADDED FROM INVESTMENT LEAD
      if (val.response) {
        switch (val.response) {
          case 'visited':
            return 'Visited'
          case 'deal_expected':
            return 'Deal Expected'
          case 'deal_signed':
            return 'Deal Signed'
          default:
            break
        }
      } else {
        return 'To-do'
      }
    }
  },
  checkStatusColor(val, todayDate) {
    let taskDate = moment(val.date).format('YYYY-MM-DD')
    if (val.taskCategory === 'simpleTask') {
      if (taskDate > todayDate && val.status !== 'inProgress' && val.status !== 'completed') {
        return 'red'
      }
      if (taskDate < todayDate && val.status !== 'inProgress' && val.status !== 'completed') {
        return AppStyles.colors.subTextColor
      } else if (val.status === 'inProgress') {
        return '#FDD835'
      } else if (val.status === 'completed') {
        return 'green'
      } else if (val.status === 'pending') {
        return 'red'
      } else {
        return 'black'
      }
    } else if (val.taskType === 'viewing') {
      if (val.status === 'completed') {
        return 'green'
      } else {
        return 'red'
      }
    } else {
      // THIS IS DONE SPECIFICALLY FOR MEETING ADDED FROM INVESTMENT LEAD
      if (val.response) {
        switch (val.response) {
          case 'visited':
            return 'green'
          case 'deal_expected':
            return '#FDD835'
          case 'deal_signed':
            return 'green'
          default:
            break
        }
      } else {
        return 'red'
      }
    }
  },
  tileImage(tile) {
    if (tile) {
      switch (tile) {
        case 'Diary':
          return DiaryImg
        case 'TeamDiary':
          return TeamDiaryImg
        case 'Leads':
          return LeadsImg
        case 'InventoryTabs':
          return InventoryImg
        case 'Client':
          return ClientsImg
        case 'Targets':
          return TargetsImg
        case 'Dashboard':
          return DashboardImg
        default:
          break
      }
    }
  },
  leadClosedToast() {
    Toast.show({
      text: 'Lead is already closed',
      duration: 3000,
      type: 'danger',
    })
  },
  leadNotAssignedToast() {
    Toast.show({
      text: 'Lead is not assigned to you',
      duration: 3000,
      type: 'danger',
    })
  },
  checkPrice(price, showPkr = false) {
    if (price === null || price === 0) {
      return '0'
    } else if (Number(price) === StaticData.Constants.any_value) {
      return 'Any'
    } else {
      return (showPkr ? 'PKR ' : '') + formatPrice(price)
    }
  },
  callNumber(body, contacts) {
    let url = body.url
    if (url && url != 'tel:null') {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            helper.errorToast(`No application available to dial phone number`)
            console.log("Can't handle url: " + url)
          } else {
            if (contacts) {
              let result = helper.contacts(body.phone, contacts)
              if (
                body.name &&
                body.name !== '' &&
                body.name !== ' ' &&
                body.phone &&
                body.phone !== ''
              )
                if (!result) helper.addContact(body)
            }
            return Linking.openURL(url)
          }
        })
        .catch((err) => console.error('An error occurred', err))
    } else {
      helper.errorToast(`No Phone Number`)
    }
  },
  contacts(targetNum, contacts) {
    let resultNum = null
    let phoneNumbers = _.flatten(_.pluck(contacts, 'phoneNumbers'), true)
    if (contacts.length) {
      for (let i = 0; i < phoneNumbers.length; i++) {
        if (phoneNumbers[i] && phoneNumbers[i] !== undefined) {
          let phone = phoneNumbers[i]
          if ('number' in phone && phone.number) {
            phone.number = phone.number.replace(/\s/g, '')
            if (targetNum === phone.number) {
              resultNum = phone
              return resultNum
            } else {
              if (phone.number[0] === '0') {
                let newNumber = phone.number.replace('0', '+92')
                if (newNumber === targetNum) {
                  resultNum = phone
                  return resultNum
                }
              }
              if (phone.number[0] === '+') {
                let newNumber = phone.number.replace('+92', '0')
                if (newNumber === targetNum) {
                  resultNum = phone
                  return resultNum
                }
              }
            }
          }
        }
      }
      return resultNum
    } else return resultNum
  },
  addContact(data) {
    if (data && data.name && data.name !== '' && data.name !== ' ') {
      const contact = {
        [Contacts.Fields.FirstName]: data.name + ' - ARMS',
        [Contacts.Fields.PhoneNumbers]: data.payload,
      }
      Contacts.addContactAsync(contact)
        .then((result) => {
          console.log('PhoneID: ', result)
        })
        .catch((error) => {
          console.log('Contacts Error: ', error)
        })
    }
  },
  formatDate(date) {
    return moment(date).format('YYYY-MM-DD')
  },
  formatTime(time) {
    return moment(time).format('hh:mm a')
  },
  formatDateAndTime(date, time) {
    return moment(date + moment(time).format('hh:mm a'), 'YYYY-MM-DDLT').format(
      'YYYY-MM-DDTHH:mm:ssZ'
    )
  },
  createContactPayload(customer) {
    let payload = []
    let primaryBol = false
    let contact = {
      phone: customer && customer.phone,
      name: customer && customer.customerName && helper.capitalize(customer.customerName),
      url: `tel:${customer && customer.phone}`,
    }
    if (customer && customer.customerContacts) {
      if (customer.customerContacts.length) {
        customer.customerContacts.map((item) => {
          if (customer.phone === item.phone) {
            payload.push({
              number: item.phone,
              label: 'mobile',
              isPrimary: true,
            })
            primaryBol = true
          } else {
            payload.push({
              number: item.phone,
              label: 'mobile',
            })
          }
        })
        if (!primaryBol) {
          payload.push({
            number: customer.phone,
            label: 'mobile',
            isPrimary: true,
          })
        }
      } else {
        payload.push({
          number: customer.phone,
          label: 'mobile',
          isPrimary: true,
        })
      }
      contact.payload = payload
      return contact
    } else return contact
  },
  deleteAndUpdateNotification(data, start, id) {
    Notifications.getAllScheduledNotificationsAsync().then((notifications) => {
      this.deleteNotification(notifications, id)
      TimerNotification(data, start)
    })
  },
  deleteLocalNotification(id) {
    Notifications.getAllScheduledNotificationsAsync().then((notifications) => {
      this.deleteNotification(notifications, id)
    })
  },
  deleteNotification(notifications, id) {
    let identifier = null
    if (notifications.length) {
      notifications.map((item) => {
        if (
          item.content &&
          item.content.data &&
          item.content.data.id &&
          item.content.data.id === id
        ) {
          identifier = item.identifier
        }
      })
    }
    if (identifier) {
      Notifications.cancelScheduledNotificationAsync(identifier)
        .then((notification) => {})
        .catch((error) => {
          console.log(error)
        })
    }
  },
  checkAssignedSharedStatus(user, lead) {
    if (user && lead) {
      if (
        lead.status === StaticData.Constants.lead_closed_lost ||
        lead.status === StaticData.Constants.lead_closed_won
      ) {
        this.leadClosedToast()
        return false
      }
      if (user.id === lead.assigned_to_armsuser_id || user.id === lead.shared_with_armsuser_id)
        return true
      else {
        this.leadNotAssignedToast()
        return false
      }
    } else return false
  },
  checkAssignedSharedStatusANDReadOnly(user, lead) {
    if (user && lead) {
      if (user.id === lead.assigned_to_armsuser_id || user.id === lead.shared_with_armsuser_id)
        return true
      else {
        this.leadNotAssignedToast()
        return false
      }
    } else return false
  },
  propertyCheckAssignedSharedStatus(user, lead) {
    if (user && lead) {
      if (
        lead.status === StaticData.Constants.lead_closed_lost ||
        lead.status === StaticData.Constants.lead_closed_won
      ) {
        return false
      }
      if (user.id === lead.assigned_to_armsuser_id || user.id === lead.shared_with_armsuser_id)
        return true
      else {
        return false
      }
    } else return false
  },
  createArray(N) {
    return Array.from({ length: N }, (_, index) => index + 1)
  },
  checkChannel(channel) {
    if (channel === 'production') return ''
    else if (channel === 'staging') return 'Staging '
    else return 'Dev '
  },
  offerPropertyIdCheck(data, user) {
    let matches = []
    if (data.length) {
      data.map((item, index) => {
        if (user.id !== item.assigned_to_armsuser_id && item.origin === 'arms') item.checkBox = true
        else item.checkBox = false
        if (item.graana_id) {
          item.images = item.property_images || []
          return matches.push(item)
        } else {
          item.images = item.armsPropertyImages || []
          item.user = item.armsuser
          return matches.push(item)
        }
      })
      return matches
    } else return []
  },
  showBedBathRangesString(start, end, maxValue) {
    if (start === 0 && end === 0) {
      return '0'
    } else if ((start === 0 && end === maxValue) || (start === maxValue && end === maxValue)) {
      return 'Any'
    } else if (start === 0 && end !== maxValue) {
      return `Upto ${end}`
    } else if (start !== 0 && end === maxValue) {
      return `${start} or more`
    } else if (start === end) {
      return `${start}`
    } else {
      return `${start} - ${end}`
    }
  },
  convertPriceToString(start, end, maxValue) {
    if (!start) start = 0
    if (!end) end = 0
    if (start === 0 && end === 0) {
      return 'PKR: 0'
    } else if ((start === 0 && end === maxValue) || (start === maxValue && end === maxValue)) {
      return `PKR: Any`
    } else if (start === 0 && end !== maxValue) {
      return `PKR: Upto ${formatPrice(end)}`
    } else if (start !== 0 && end === maxValue) {
      return `PKR: ${formatPrice(start)} or more`
    } else if (start === end) {
      return `PKR: ${formatPrice(start)} to ${formatPrice(end)}`
    } else {
      return `PKR: ${formatPrice(start)} - ${formatPrice(end)}`
    }
  },
  convertSizeToString(start, end, maxValue, unit) {
    let unitType = unit
    if (unitType) {
      if (unitType === 'marla') unitType = `${this.capitalize(unitType)}(s)`
      if (unitType === 'kanal') unitType = `${this.capitalize(unitType)}(s)`
      else unitType = this.capitalize(unitType)
    }
    if (start === 0 && end === 0) {
      return 'Size: 0'
    } else if ((start === 0 && end === maxValue) || (start === maxValue && end === maxValue)) {
      return `Size: Any`
    } else if (start === 0 && end !== maxValue) {
      return `Size: Upto ${end} ${this.capitalize(unitType)}`
    } else if (start !== 0 && end === maxValue) {
      return `Size: ${start} or more ${this.capitalize(unitType)}`
    } else if (start === end) {
      return `Size: ${start} ${this.capitalize(unitType)}`
    } else {
      return `Size: ${start} - ${end} ${this.capitalize(unitType)}`
    }
  },
  convertSizeToStringV2(start, end, maxValue, unit) {
    let unitType = unit
    if (unitType) {
      if (unitType === 'marla') unitType = `${this.capitalize(unitType)}(s)`
      if (unitType === 'kanal') unitType = `${this.capitalize(unitType)}(s)`
      else unitType = this.capitalize(unitType)
    }
    start = Number(start)
    end = Number(end)
    if (start === 0 && end === 0 && unitType) {
      return `0 ${unitType}`
    } else if ((start === 0 && end === maxValue) || (start === maxValue && end === maxValue)) {
      return ''
    } else if (start === 0 && end && end !== maxValue) {
      return `Upto ${end} ${unitType}`
    } else if (start === end && unitType) {
      return `${start} ${unitType}`
    } else if (start === '' && end && end !== '') {
      return `Upto ${end} ${unitType}`
    } else if (start !== 0 && end === maxValue) {
      return `${start} or more ${unitType}`
    } else if (start && end) {
      return `${start} - ${end} ${unitType}`
    } else {
      return ''
    }
  },
  isSellerOrBuyer(property, lead, user) {
    let subRole =
      property &&
      property.armsuser &&
      property.armsuser.armsUserRole &&
      property.armsuser.armsUserRole.subRole
    if (
      property.assigned_to_armsuser_id === user.id ||
      (lead.assigned_to_armsuser_id === user.id && property.origin !== 'arms') ||
      !Ability.canView(subRole, 'Leads')
    ) {
      return true // lead agent can have access to all functionality
    } else {
      return false // property agent
    }
  },
  removeHtmlTags(str) {
    if (str === null || str === '') return false
    else str = str.toString()
    return str.replace(/<[^>]*>/g, '')
  },
  AddPropsureReportsFee(pendingPropsures, type) {
    let total = 0
    if (pendingPropsures && pendingPropsures.length) {
      pendingPropsures.map((item) => {
        if (item.propsureReport && item.propsureReport.fee && item.addedBy === type) {
          total = Number(total) + Number(item.propsureReport.fee)
        }
      })
      return total
    } else {
      return 0
    }
  },
  propsurePendingStatuses(property, type) {
    if (property) {
      let pendingPropsures =
        property.propsures && property.propsures.length
          ? _.filter(
              property.propsures,
              (item) => item.status === 'pending' && item.addedBy === type
            )
          : null
      let totalFee = helper.AddPropsureReportsFee(property.propsures, type)
      let singlePayment = helper.propsurePaymentType(property, type)
      if (totalFee === 0 && pendingPropsures && pendingPropsures.length === 0) return 'VERIFIED'
      if (totalFee === 0 && pendingPropsures && pendingPropsures.length)
        return 'Pending Verification'
      if (pendingPropsures && pendingPropsures.length) {
        if (!singlePayment || (singlePayment && singlePayment.status !== 'cleared'))
          return 'Pending Verification and Payment'
        else return 'Pending Verification'
      }
      if (singlePayment) {
        if (singlePayment.status !== 'cleared') return 'Pending Payment'
        else return 'VERIFIED'
      } else {
        if (totalFee === 0) return 'VERIFIED'
        else return 'Pending Payment'
      }
    }
  },
  checkPropsureDocs(propsures, type) {
    let check = true
    if (propsures && propsures.length) {
      propsures.map((item) => {
        if (item.propsureDocs && item.propsureDocs.length && item.addedBy === type) check = false
      })
      return check
    } else return false
  },
  checkPropsureRequests(propsures, type) {
    let check = true
    if (propsures && propsures.length) {
      propsures.map((item) => {
        if (item && item.addedBy === type) check = false
      })
      return check
    } else return true
  },
  checkPP(user) {
    if (user) {
      const { organization } = user
      if (organization) return organization.isPP
      if (user.subRole === 'group_management') return false
    } else return false
  },
  checkMyDiary(property, user) {
    let check = false
    if (property && property.diaries && property.diaries.length) {
      property.diaries.map((item) => {
        if (item.userId === user.id) check = true
      })
      return check
    } else return check
  },
  propsurePaymentType(property, type) {
    let singlePayment = null
    if (property && property.cmInstallments && property.cmInstallments.length) {
      property.cmInstallments.map((item) => {
        if (item.addedBy === type) singlePayment = item
      })
      return singlePayment
    } else return singlePayment
  },
  checkClearedStatuses(lead) {
    let check = false
    let paymentCheck = true
    let propsureCheck = true
    let commissionsLength = 2
    let cleared = 0
    if (lead.commissionNotApplicableBuyer === true || lead.commissionNotApplicableSeller === true) {
      commissionsLength = 1
    }
    const { commissions, propsureOutstandingPayment } = lead
    if (commissions && commissions.length) {
      commissions.map((item) => {
        if (item.status !== 'cleared' && item.paymentCategory === 'commission') paymentCheck = false
        if (item.status === 'cleared' && item.paymentCategory === 'commission') cleared++
        if (item.status !== 'cleared' && item.paymentCategory === 'propsure_services')
          propsureCheck = false
      })
      if (
        paymentCheck &&
        propsureCheck &&
        propsureOutstandingPayment === 0 &&
        cleared === commissionsLength
      )
        check = true
      return check
    } else return check
  },
}

module.exports = helper
