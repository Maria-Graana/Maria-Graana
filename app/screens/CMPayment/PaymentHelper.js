/** @format */
import PaymentMethods from '../../PaymentMethods'

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
      pearl: 0,
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
  findPaymentPlanDiscount(lead, oneUnit) {
    let fullPaymentDiscount = lead.paidProject != null && lead.paidProject.full_payment_discount
    return PaymentMethods.findApprovedDiscountAmount(oneUnit, fullPaymentDiscount)
  },
  currencyConvert(x) {
    x = x.toString()
    var lastThree = x.substring(x.length - 3)
    var otherNumbers = x.substring(0, x.length - 3)
    if (otherNumbers != '') lastThree = ',' + lastThree
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
    return res
  },
}
module.exports = PaymentHelper
