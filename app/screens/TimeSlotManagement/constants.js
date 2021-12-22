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
  '60min',
]

export const hourArray = [
  '00:00AM',
  '01:00AM',
  '02:00AM',
  '03:00AM',
  '04:00AM',
  '05:00AM',
  '06:00AM',
  '07:00AM',
  '08:00AM',
  '09:00AM',
  '10:00AM',
  '11:00AM',
  '00:00PM',
  '01:00PM',
  '02:00PM',
  '03:00PM',
  '04:00PM',
  '05:00PM',
  '06:00PM',
  '07:00PM',
  '08:00PM',
  '09:00PM',
  '10:00PM',
  '11:00PM',
]

export const _format = 'YYYY-MM-DD'
export const _today = moment(new Date()).format(_format)
export const _tomorrow = moment(_today, _format).add(1, 'days').format(_format)
export const _dayAfterTomorrow = moment(_today, _format).add(2, 'days').format(_format)
