/** @format */

import moment from 'moment'

export const minArray = [
  '05min',
  '10min',
  '15min',
  '20min',
  '25min',
  '30min',
  '35min',
  '40min',
  '45min',
  '50min',
  '55min',
]

export const hourArray = [
  '8:00AM',
  '9:00AM',
  '10:00AM',
  '11:00AM',
  '12:00PM',
  '1:00PM',
  '2:00PM',
  '3:00PM',
  '4:00PM',
  '5:00PM',
  '6:00PM',
  '7:00PM',
  '8:00PM',
  '9:00PM',
  '10:00PM',
  '11:00PM',
  '12:00PM',
  '1:00PM',
  '2:00PM',
  '3:00PM',
  '4:00PM',
  '5:00PM',
  '6:00PM',
  '7:00PM',
]

export const _format = 'YYYY-MM-DD'
export const _today = moment(new Date()).format(_format)
export const _tomorrow = moment(_today, _format).add(1, 'days').format(_format)
export const _dayAfterTomorrow = moment(_today, _format).add(2, 'days').format(_format)
