/** @format */

import moment from 'moment'

export const minArray = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55',
  // '60min',
  '',
]

export const hourArray = [
  '12AM',
  '1AM',
  '2AM',
  '3AM',
  '4AM',
  '5AM',
  '6AM',
  '7AM',
  '8AM',
  '9AM',
  '10AM',
  '11AM',
  '12PM',
  '1PM',
  '2PM',
  '3PM',
  '4PM',
  '5PM',
  '6PM',
  '7PM',
  '8PM',
  '9PM',
  '10PM',
  '11PM',
]

export const _format = 'YYYY-MM-DD'
export const _today = moment(new Date()).format(_format)
export const _tomorrow = moment(_today, _format).add(1, 'days').format(_format)
export const _dayAfterTomorrow = moment(_today, _format).add(2, 'days').format(_format)
