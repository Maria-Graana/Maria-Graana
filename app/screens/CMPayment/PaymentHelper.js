/** @format */
import PaymentMethods from '../../PaymentMethods'
import helper from '../../helper'

const PaymentHelper = {
  createPearlObject(floor, area) {
    return {
      discount: 0,
      area: area,
      pricePerSqFt: floor.pricePerSqFt,
      category_charges: 0,
    }
  },
  clearFirstFormData(lead) {
    return {
      project: '',
      floor: '',
      unitType: '',
      pearl: '',
      unit: '',
      unitPrice: 0,
      cnic: lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null,
      paymentPlan: 'no',
      approvedDiscount: 0,
      approvedDiscountPrice: 0,
      finalPrice: 0,
      fullPaymentDiscountPrice: 0,
    }
  },
  refreshFirstFormData(firstForm, value, lead) {
    let copyFirstForm = PaymentHelper.clearFirstFormData(lead)
    if (value === 'project') {
      copyFirstForm['project'] = firstForm.project
    }
    if (value === 'floor') {
      copyFirstForm['project'] = firstForm.project
      copyFirstForm['floor'] = firstForm.floor
    }
    if (value === 'unitType') {
      copyFirstForm['project'] = firstForm.project
      copyFirstForm['floor'] = firstForm.floor
      copyFirstForm['unitType'] = firstForm.unitType
    }
    return copyFirstForm
  },
  findFloor(allFloors, value) {
    let oneFloor = {}
    if (allFloors && allFloors.length) {
      oneFloor = allFloors.find((item) => {
        return item.id == value && item
      })
    }
    return oneFloor
  },
  handleEmptyValue(value) {
    return value != null && value != '' ? Number(value) : 0
  },
  findPaymentPlanDiscount(lead, oneUnit) {
    let fullPaymentDiscount = lead.paidProject != null && lead.paidProject.full_payment_discount
    if (lead.installmentDue && lead.installmentDue.includes('Full Payment Disc')) {
      return PaymentMethods.findApprovedDiscountAmount(oneUnit, fullPaymentDiscount)
    } else {
      fullPaymentDiscount = 0
      return PaymentMethods.findApprovedDiscountAmount(oneUnit, fullPaymentDiscount)
    }
  },
  currencyConvert(x) {
    x = x.toString()
    var lastThree = x.substring(x.length - 3)
    var otherNumbers = x.substring(0, x.length - 3)
    if (otherNumbers != '') lastThree = ',' + lastThree
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
    return res
  },
  setPaymentPlanArray(lead, checkPaymentPlan) {
    const array = []
    if (
      checkPaymentPlan.investment === true &&
      lead.paidProject != null &&
      lead.paidProject != null
    ) {
      array.push({
        value: 'Sold on Investment Plan',
        name: `Investment Plan ${
          lead.paidProject.full_payment_discount > 0
            ? `(Full Payment Disc: ${lead.paidProject.full_payment_discount}%)`
            : ''
        }`,
      })
    }
    if (checkPaymentPlan.rental === true && lead.paidProject != null && lead.paidProject != null) {
      array.push({ value: 'Sold on Rental Plan', name: `Rental Plan` })
    }
    if (checkPaymentPlan.years != null) {
      array.push({
        value: 'Sold on Installments Plan',
        name: checkPaymentPlan.years + ' Years Quarterly Installments',
      })
    }
    if (checkPaymentPlan.monthly === true) {
      array.push({
        value: 'Sold on Monthly Installments Plan',
        name: checkPaymentPlan.years + ' Years Monthly Installments',
      })
    }
    return array
  },
  createPearl(data) {
    let { firstFormData, pearlUnitPrice, unitPearlDetailsData, lead, user } = data
    let downPayment = lead.paidProject != null ? lead.paidProject.down_payment : 0
    let totalDownPayment = (downPayment / 100) * pearlUnitPrice

    let fullPaymentDiscount = lead.paidProject != null ? lead.paidProject.full_payment_discount : 0
    let totalFullpaymentDiscount = (1 - fullPaymentDiscount / 100) * pearlUnitPrice

    let possessionCharges = lead.paidProject != null ? lead.paidProject.possession_charges : 0
    let totalpossessionCharges = (possessionCharges / 100) * pearlUnitPrice

    let installmentAmount = pearlUnitPrice - totalDownPayment - totalpossessionCharges

    let installmentPlan = lead.paidProject != null ? lead.paidProject.installment_plan : 1

    let numberOfQuarterlyInstallments = installmentPlan * 4
    let quarterlyInstallmentsAmount = installmentAmount / numberOfQuarterlyInstallments

    let numberOfMonthlyInstallments = installmentPlan * 12
    let monthlyInstallmentsAmount = installmentAmount / numberOfMonthlyInstallments

    let totalRent = unitPearlDetailsData.rentPerSqFt * firstFormData.pearl

    return {
      area: firstFormData.pearl,
      area_unit: 'sqft',
      bookingStatus: 'Available',
      category_charges: 0,
      unit_price: pearlUnitPrice,
      discount: 0,
      discount_amount: 0,
      discounted_price: pearlUnitPrice,
      down_payment: totalDownPayment,
      floorId: firstFormData.floor,
      full_payment_price: totalFullpaymentDiscount,
      possession_charges: totalpossessionCharges,
      installment_amount: installmentAmount,
      quarterly_installments: quarterlyInstallmentsAmount,
      monthly_installments: monthlyInstallmentsAmount,
      name: 'Shop # 4892',
      optional_fields: '{}',
      pricePerSqFt: unitPearlDetailsData.pricePerSqFt,
      projectId: firstFormData.project,
      rate_per_sqft: unitPearlDetailsData.pricePerSqFt,
      remarks: '',
      rent: totalRent,
      rentPerSqFt: unitPearlDetailsData.rentPerSqFt,
      reservation: unitPearlDetailsData.project.reservation_charges,
      type: 'pearl',
      userId: user.id,
      name: 'name',
    }
  },
  generateApiPayload(firstFormData, lead, unitId, CMPayment) {
    return {
      unitId: unitId,
      projectId: firstFormData.project,
      floorId: firstFormData.floor,
      unitDiscount:
        firstFormData.approvedDiscount === null || firstFormData.approvedDiscount === ''
          ? null
          : firstFormData.approvedDiscount,
      discounted_price:
        firstFormData.approvedDiscountPrice === null || firstFormData.approvedDiscountPrice === ''
          ? null
          : firstFormData.approvedDiscountPrice,
      discount_amount:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      unitStatus:
        CMPayment.paymentType === 'token' ? CMPayment.paymentCategory : firstFormData.paymentPlan,
      installmentDue: firstFormData.paymentPlan,
      finalPrice:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      installmentAmount: CMPayment.installmentAmount,
      type: CMPayment.type,
      pearl:
        firstFormData.pearl === null || firstFormData.pearl === '' ? null : firstFormData.pearl,
      cnic:
        lead.customer && lead.customer.cnic != null
          ? lead.customer.cnic
          : firstFormData.cnic.replace(/[^\w\s]/gi, ''),
      customerId: lead.customer.id,
      taxIncluded: CMPayment.taxIncluded,
    }
  },
  generateProductApiPayload(firstFormData, lead, unitId, CMPayment, oneProduct) {
    console.log('CMPayment: ', CMPayment)
    return {
      unitId: unitId,
      projectId: firstFormData.project,
      floorId: firstFormData.floor,
      unitDiscount:
        firstFormData.approvedDiscount === null || firstFormData.approvedDiscount === ''
          ? null
          : firstFormData.approvedDiscount,
      discounted_price:
        firstFormData.approvedDiscountPrice === null || firstFormData.approvedDiscountPrice === ''
          ? null
          : firstFormData.approvedDiscountPrice,
      discount_amount:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      unitStatus:
        CMPayment.paymentType === 'token' ? CMPayment.paymentCategory : firstFormData.paymentPlan,
      installmentDue: firstFormData.paymentPlan,
      finalPrice:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      installmentAmount: CMPayment.installmentAmount,
      type: CMPayment.type,
      pearl:
        firstFormData.pearl === null || firstFormData.pearl === '' ? null : firstFormData.pearl,
      cnic:
        lead.customer && lead.customer.cnic != null
          ? lead.customer.cnic
          : firstFormData.cnic.replace(/[^\w\s]/gi, ''),
      customerId: lead.customer.id,
      taxIncluded: CMPayment.taxIncluded,
      productId: firstFormData.productId,
      installmentFrequency: firstFormData.installmentFrequency,
      paymentPlan: firstFormData.paymentPlan,
      downPayment:
        firstFormData.paymentPlan === 'installments'
          ? PaymentMethods.calculateDownPayment(
              oneProduct,
              firstFormData.finalPrice,
              CMPayment.paymentCategory === 'Token' ? CMPayment.installmentAmount : 0
            )
          : null,
      noOfInstallment:
        firstFormData.paymentPlan === 'installments'
          ? PaymentMethods.calculateNoOfInstallments(oneProduct, firstFormData.installmentFrequency)
          : null,
      paymentPlanDuration: firstFormData.paymentPlanDuration
        ? Number(firstFormData.paymentPlanDuration)
        : null,
      remainingPayment:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice - CMPayment.installmentAmount,
    }
  },
  normalizeProjectProducts(products) {
    if (products) {
      let newProducts = products.map((item) => {
        const { projectProduct } = item
        return {
          value: projectProduct.id,
          name: projectProduct.name,
        }
      })
      return newProducts
    }
  },
  setProductPaymentPlan(oneProduct) {
    if (oneProduct) {
      if (oneProduct && oneProduct.projectProduct) {
        let { paymentPlan } = oneProduct.projectProduct
        if (paymentPlan === 'full_payment') return false
        if (paymentPlan === 'installments') return true
      }
    }
  },
  setInstallmentFrequency(oneProduct) {
    if (oneProduct) {
      if (oneProduct && oneProduct.projectProduct) {
        let { installmentFrequency } = oneProduct.projectProduct
        console.log('installmentFrequency: ', installmentFrequency)
        let newData =
          installmentFrequency &&
          installmentFrequency.map((item) => {
            return {
              name: helper.capitalize(item),
              value: item,
            }
          })
        return newData
      }
    }
  },
  setPaymentPlanDuration(oneProduct) {
    if (oneProduct) {
      if (oneProduct && oneProduct.projectProduct) {
        let { paymentPlanDuration } = oneProduct.projectProduct
        paymentPlanDuration = JSON.parse(paymentPlanDuration)
        if (
          paymentPlanDuration &&
          paymentPlanDuration.length > 1 &&
          Number(paymentPlanDuration[0]) === Number(paymentPlanDuration[1])
        ) {
          return [
            {
              name: paymentPlanDuration[0],
              value: paymentPlanDuration[0],
            },
          ]
        }
        let newData =
          paymentPlanDuration &&
          paymentPlanDuration.map((item) => {
            return {
              name: item,
              value: item,
            }
          })
        return newData
      }
    }
  },
}
module.exports = PaymentHelper
