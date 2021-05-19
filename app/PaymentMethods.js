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
      return pricePerSqFt * (1 + category_charges / 100)
    }
  },
  findUnitPrice(unit) {
    if (unit) {
      let { area, pricePerSqFt, category_charges } = unit
      area = PaymentMethods.handleEmptyValue(area)
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
  findProductDiscountAmount(unit, product) {
    if (unit && product) {
      let { discount } = product.projectProduct
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
      console.log('findApprovedDiscountAmount: ', discount)
      return (PaymentMethods.findUnitPrice(unit) * discount) / 100
    } else return 0
  },
  findApprovedDiscountPercentage(unit, price) {
    if (unit && price) {
      price = PaymentMethods.handleEmptyValue(price)
      return (price / PaymentMethods.findUnitPrice(unit)) * 100
    }
  },
  findFinalPrice(unit, approvedDiscountPrice, fullPaymentDiscountPrice, isPearl) {
    if (unit) {
      approvedDiscountPrice = PaymentMethods.handleEmptyValue(approvedDiscountPrice)
      fullPaymentDiscountPrice = PaymentMethods.handleEmptyValue(fullPaymentDiscountPrice)
      let totalDiscountPrice = approvedDiscountPrice + fullPaymentDiscountPrice
      if (isPearl) {
        return PaymentMethods.pearlCalculations(unit) - totalDiscountPrice
      } else {
        return PaymentMethods.findUnitPrice(unit) - totalDiscountPrice
      }
    }
  },
  pearlCalculations(unit) {
    if (unit) {
      let { area, pricePerSqFt } = unit
      area = PaymentMethods.handleEmptyValue(area)
      pricePerSqFt = PaymentMethods.handleEmptyValue(pricePerSqFt)
      return area * pricePerSqFt
    }
  },
  findTaxIncluded(payment, taxAmount) {
    payment = PaymentMethods.handleEmptyValue(payment)
    taxAmount = PaymentMethods.handleEmptyValue(taxAmount)
    return Math.ceil((taxAmount / (100 + taxAmount)) * payment)
  },
  findTaxNotIncluded(payment, taxAmount) {
    payment = PaymentMethods.handleEmptyValue(payment)
    taxAmount = PaymentMethods.handleEmptyValue(taxAmount)
    return Math.ceil(payment * (taxAmount / 100))
  },
  findRemaningPayment(payment, finalPrice) {
    finalPrice = PaymentMethods.handleEmptyValue(finalPrice)
    let totalPayments = 0
    let remainingTax = 0
    if (payment && payment.length) {
      payment.map((item) => {
        if (item.paymentCategory !== 'tax' && item.status !== 'notCleared') {
          let { taxAmount, installmentAmount } = item
          taxAmount = PaymentMethods.handleEmptyValue(taxAmount)
          installmentAmount = PaymentMethods.handleEmptyValue(installmentAmount)
          let itemPayment = 0
          let itemTax = 0
          if (item.taxIncluded) {
            itemPayment =
              installmentAmount - PaymentMethods.findTaxIncluded(installmentAmount, taxAmount)
          } else {
            itemTax = PaymentMethods.findTaxNotIncluded(installmentAmount, taxAmount)
            itemPayment = installmentAmount
          }
          totalPayments = totalPayments + itemPayment
          remainingTax = remainingTax + itemTax
        }
      })
      finalPrice = finalPrice - totalPayments
    }
    return { remainingPayment: finalPrice, remainingTax: remainingTax }
  },
  findRemainingTax(payment, outStandingTax) {
    outStandingTax = PaymentMethods.handleEmptyValue(outStandingTax)
    let totalPayments = 0
    if (payment && payment.length) {
      payment.map((item) => {
        if (item.paymentCategory === 'tax' && item.status !== 'notCleared') {
          totalPayments = totalPayments + item.installmentAmount
        }
      })
      outStandingTax = outStandingTax - totalPayments
    }
    return outStandingTax
  },
  findRemaningPaymentWithClearedStatus(payment, finalPrice) {
    finalPrice = PaymentMethods.handleEmptyValue(finalPrice)
    let totalPayments = 0
    let remainingTax = 0
    if (payment && payment.length) {
      payment.map((item) => {
        if (item.paymentCategory !== 'tax' && item.status === 'cleared') {
          let { taxAmount, installmentAmount } = item
          taxAmount = PaymentMethods.handleEmptyValue(taxAmount)
          installmentAmount = PaymentMethods.handleEmptyValue(installmentAmount)
          let itemPayment = 0
          let itemTax = 0
          if (item.taxIncluded) {
            itemPayment =
              installmentAmount - PaymentMethods.findTaxIncluded(installmentAmount, taxAmount)
          } else {
            itemTax = PaymentMethods.findTaxNotIncluded(installmentAmount, taxAmount)
            itemPayment = installmentAmount
          }
          totalPayments = totalPayments + itemPayment
          remainingTax = remainingTax + itemTax
        }
      })
      finalPrice = finalPrice - totalPayments
    }
    return { remainingPayment: finalPrice, remainingTax: remainingTax }
  },
  findRemainingTaxWithClearedStatus(payment, outStandingTax) {
    outStandingTax = PaymentMethods.handleEmptyValue(outStandingTax)
    let totalPayments = 0
    if (payment && payment.length) {
      payment.map((item) => {
        if (item.paymentCategory === 'tax' && item.status === 'cleared') {
          totalPayments = totalPayments + item.installmentAmount
        }
      })
      outStandingTax = outStandingTax - totalPayments
    }
    return outStandingTax
  },
  findPaymentClearedStatus(payment) {
    let checkCleared = false
    if (payment && payment.length) {
      payment.map((item) => {
        if (item.status === 'cleared') {
          checkCleared = true
        }
      })
    }
    return checkCleared
  },
  findPearlUnitPrice(data) {
    const { floor, unit } = data
    if (floor && unit) {
      let { area } = unit
      let { pricePerSqFt } = floor
      area = PaymentMethods.handleEmptyValue(area)
      pricePerSqFt = PaymentMethods.handleEmptyValue(pricePerSqFt)
      return area * pricePerSqFt
    } else {
      return 0
    }
  },
  calculateDownPayment(oneProduct, finalPrice, token) {
    if (oneProduct && finalPrice && token) {
      let { downPayment } = oneProduct.projectProduct
      downPayment = PaymentMethods.handleEmptyValue(downPayment)
      finalPrice = PaymentMethods.handleEmptyValue(finalPrice)
      token = PaymentMethods.handleEmptyValue(token)
      console.log(downPayment, finalPrice, token)
      return (finalPrice * downPayment) / 100 - token
    } else return null
  },
  calculateNoOfInstallments(oneProduct, frequency) {
    if (oneProduct && frequency) {
      let { investmentDurationPeriod } = oneProduct.projectProduct
      let value = 4
      investmentDurationPeriod = PaymentMethods.handleEmptyValue(investmentDurationPeriod)
      if (frequency === 'monthly') value = 12
      console.log(frequency, investmentDurationPeriod)
      console.log(value)
      return investmentDurationPeriod * value
    } else return null
  },
}
module.exports = PaymentMethods
