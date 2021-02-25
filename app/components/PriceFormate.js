/** @format */

export const formatPrice = (price) => {
  if (price / 10000000 >= 1) {
    const r = price / 10000000
    return isFloat(r) ? `${r.toFixed(2)} Crore` : `${r} Crore`
  } else if (price / 100000 >= 1) {
    const r = price / 100000
    return isFloat(r) ? `${r.toFixed(2)} Lac` : `${r} Lac`
  } else if (price === 0) {
    return `Call`
  } else {
    return `${price}`
  }
}

export const intFormatPrice = (price) => {
  if (price / 10000000 >= 1) {
    const r = price / 10000000
    return isFloat(r) ? `${parseInt(r)} Crore` : `${r} Crore`
  } else if (price / 100000 >= 1) {
    const r = price / 100000
    return isFloat(r) ? `${parseInt(r)} Lac` : `${r} Lac`
  } else if (price === 0) {
    return `Call`
  } else {
    return `${price}`
  }
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0
}

var a = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
]
var b = ['', '10', '20', '30', '40', '50', '60', '70', '80', '90']

export const formatPrice2 = (num) => {
  if ((num = num.toString()).length > 9) return num
  var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
  if (!n) return
  var str = ''
  str += !(n[1] === '00')
    ? (a[Number(n[1])] || parseInt(b[n[1][0]]) + parseInt(a[n[1][1]])) + ' Crore '
    : ''
  str += !(n[2] === '00')
    ? (a[Number(n[2])] || parseInt(b[n[2][0]]) + parseInt(a[n[2][1]])) + ' Lac '
    : ''
  return str
}
