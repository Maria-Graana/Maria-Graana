/** @format */

const PaymentMethods = {
  addPropsureReportPrices(reports) {
    let total = 0
    if (reports && reports.length) {
      reports.map((item, index) => {
        total = Number(total) + Number(item.fee)
      })
      return total
    } else {
      return total
    }
  },
  handleEmptyValue(value) {
    return value != null && value != '' ? Number(value) : 0
  },
  findRatePerSqft(unit) {
    if (unit) {
      let { pricePerSqFt, category_charges } = unit
      pricePerSqFt = PaymentMethods.handleEmptyValue(pricePerSqFt)
      category_charges = PaymentMethods.handleEmptyValue(category_charges)
      console.log('findRatePerSqft pricePerSqFt: ', pricePerSqFt)
      console.log('findUnitPrice category_charges: ', category_charges)
      return pricePerSqFt * (1 + category_charges / 100)
    }
  },
  findUnitPrice(unit) {
    if (unit) {
      let { area } = unit
      area = PaymentMethods.handleEmptyValue(area)
      console.log('findUnitPrice: ', area)
      return area * PaymentMethods.findRatePerSqft(unit)
    }
  },
  findDiscountAmount(unit) {
    if (unit) {
      let { discount } = unit
      discount = PaymentMethods.handleEmptyValue(discount)
      return (PaymentMethods.findUnitPrice(unit) * discount) / 100
    }
  },
  findDiscountPrice(unit) {
    if (unit) {
      return PaymentMethods.findUnitPrice(unit) - PaymentMethods.findDiscountAmount(unit)
    }
  },
  findRentAmount(unit, pearl) {
    if (unit) {
      let { rentPerSqFt } = unit
      pearl = PaymentMethods.handleEmptyValue(pearl)
      rentPerSqFt = PaymentMethods.handleEmptyValue(rentPerSqFt)
      return pearl * rentPerSqFt
    }
  },
  findApprovedDiscountAmount(unit, discount) {
    if (unit && discount) {
      discount = PaymentMethods.handleEmptyValue(discount)
      return (PaymentMethods.findUnitPrice(unit) * discount) / 100
    }
  },
  findApprovedDiscountPercentage(unit, price) {
    if (unit && price) {
      price = PaymentMethods.handleEmptyValue(price)
      return (price / PaymentMethods.findUnitPrice(unit)) * 100
    }
  },
  findFinalPrice(unit, approvedDiscountPrice, fullPaymentDiscountPrice) {
    if (unit) {
      approvedDiscountPrice = PaymentMethods.handleEmptyValue(approvedDiscountPrice)
      fullPaymentDiscountPrice = PaymentMethods.handleEmptyValue(fullPaymentDiscountPrice)
      let totalDiscountPrice = approvedDiscountPrice + fullPaymentDiscountPrice
      return PaymentMethods.findUnitPrice(unit) - totalDiscountPrice
    }
  },
}
module.exports = PaymentMethods
