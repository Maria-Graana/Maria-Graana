export const formatPrice = (price) => {
  if ((price / 10000000) >= 1) {
    const r = price / 10000000;
    return isFloat(r) ? `${r.toFixed(2)} Crore` : `${r} Crore `

  } else if ((price / 100000) >= 1) {
    const r = price / 100000;
    return isFloat(r) ? `${r.toFixed(2)} Lac` : `${r} Lac`
  }  else {
    return `${price != '' ? parseFloat(price).toFixed(2) : ''}`
  }
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}


