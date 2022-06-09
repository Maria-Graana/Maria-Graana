/** @format */
import PaymentMethods from '../../PaymentMethods'
import helper from '../../helper'
import _ from 'underscore'

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
      unitName: '',
      projectName: '',
      floorName: '',
      installmentFrequency: '',
      possessionCharges: 0,
      possessionChargesPercentage: '',
      downPayment: 0,
      downPaymentPercentage: '',
      noOfInstallment: '',
    }
  },
  refreshFirstFormData(firstForm, value, lead) {
    let copyFirstForm = PaymentHelper.clearFirstFormData(lead)
    if (value === 'project') {
      copyFirstForm['project'] = firstForm.project
      copyFirstForm['clientName'] = firstForm.clientName
      copyFirstForm['parkingAvailable'] = firstForm.parkingAvailable
      copyFirstForm['parkingCharges'] = firstForm.parkingCharges
      copyFirstForm['projectSiteId'] = firstForm.projectSiteId
    }
    if (value === 'floor') {
      copyFirstForm['project'] = firstForm.project
      copyFirstForm['floor'] = firstForm.floor
      copyFirstForm['clientName'] = firstForm.clientName
      copyFirstForm['parkingAvailable'] = firstForm.parkingAvailable
      copyFirstForm['parkingCharges'] = firstForm.parkingCharges
    }
    if (value === 'unitType') {
      copyFirstForm['project'] = firstForm.project
      copyFirstForm['floor'] = firstForm.floor
      copyFirstForm['unitType'] = firstForm.unitType
      copyFirstForm['clientName'] = firstForm.clientName
      copyFirstForm['parkingAvailable'] = firstForm.parkingAvailable
      copyFirstForm['parkingCharges'] = firstForm.parkingCharges
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
  generateApiPayload(
    firstFormData,
    lead,
    unitId,
    CMPayment,
    instrument,
    isPrimary,
    selectedClient
  ) {
    return {
      parkingChargesApply: firstFormData.parkingAvailable,
      unitId: unitId,
      projectId: firstFormData.project,
      floorId: firstFormData.floor,
      unitDiscount:
        firstFormData.approvedDiscount === null || firstFormData.approvedDiscount === ''
          ? null
          : firstFormData.approvedDiscount,
      discounted_price:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      discount_amount:
        firstFormData.approvedDiscountPrice === null || firstFormData.approvedDiscountPrice === ''
          ? null
          : firstFormData.approvedDiscountPrice,
      unitStatus: 'hold',
      reasons: 'pending_token',
      installmentDue: firstFormData.paymentPlan,
      finalPrice:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      installmentAmount: CMPayment.installmentAmount,
      type: CMPayment.type,
      pearl:
        firstFormData.pearl === null || firstFormData.pearl === '' ? null : firstFormData.pearl,
      cnic: firstFormData.cnic,
      customerId: selectedClient ? selectedClient.id : lead.customer.id,
      taxIncluded: CMPayment.taxIncluded,
      instrumentId: instrument.id,
      isPrimary,
      purchaserId: selectedClient ? selectedClient.id : lead.customer.id,
      possessionChargesPercentage:
        firstFormData.paymentPlan === 'installments'
          ? Number(firstFormData.possessionChargesPercentage)
          : null,
      downPaymentPercentage:
        firstFormData.paymentPlan === 'installments'
          ? Number(firstFormData.downPaymentPercentage)
          : null,
    }
  },
  generateProductApiPayload(
    firstFormData,
    lead,
    unitId,
    CMPayment,
    oneProduct,
    instrument,
    isPrimary,
    selectedClient
  ) {
    const { projectProduct } = oneProduct
    return {
      parkingChargesApply: firstFormData.parkingAvailable,
      unitId: unitId,
      projectId: firstFormData.project,
      floorId: firstFormData.floor,
      unitDiscount:
        firstFormData.approvedDiscount === null || firstFormData.approvedDiscount === ''
          ? null
          : firstFormData.approvedDiscount,
      discounted_price:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      discount_amount:
        firstFormData.approvedDiscountPrice === null || firstFormData.approvedDiscountPrice === ''
          ? null
          : firstFormData.approvedDiscountPrice,
      unitStatus: 'hold',
      reasons: 'pending_token',
      installmentDue: firstFormData.paymentPlan,
      finalPrice:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,
      installmentAmount: CMPayment.installmentAmount,
      type: firstFormData.unitType === 'fullUnit' ? 'regular' : 'pearl',
      pearl:
        firstFormData.pearl === null || firstFormData.pearl === '' ? null : firstFormData.pearl,
      cnic: firstFormData.cnic,
      customerId: selectedClient ? selectedClient.id : lead.customer.id,
      taxIncluded: CMPayment.taxIncluded,
      productId: firstFormData.productId,
      installmentFrequency: Number(firstFormData.installmentFrequency),
      paymentPlan: firstFormData.paymentPlan,
      downPayment:
        firstFormData.paymentPlan === 'installments' ? Number(firstFormData.downPayment) : null,
      noOfInstallment:
        firstFormData.paymentPlan === 'installments' ? firstFormData.noOfInstallment : null,
      paymentPlanDuration: firstFormData.paymentPlanDuration
        ? Number(firstFormData.paymentPlanDuration)
        : null,
      remainingPayment:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice - CMPayment.installmentAmount,
      instrumentId: instrument.id,
      isPrimary,
      possessionCharges:
        firstFormData.paymentPlan === 'installments'
          ? Number(firstFormData.possessionCharges)
          : null,
      purchaserId: selectedClient ? selectedClient.id : lead.customer.id,
      possessionChargesPercentage:
        firstFormData.paymentPlan === 'installments'
          ? Number(firstFormData.possessionChargesPercentage)
          : null,
      downPaymentPercentage:
        firstFormData.paymentPlan === 'installments'
          ? Number(firstFormData.downPaymentPercentage)
          : null,
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
    // console.log(oneProduct)
    if (oneProduct) {
      if (oneProduct && oneProduct.projectProduct) {
        let { installmentFrequency } = oneProduct.projectProduct
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
              name: paymentPlanDuration[0].toString(),
              value: paymentPlanDuration[0].toString(),
            },
          ]
        }
        let newData = []
        if (paymentPlanDuration) {
          for (
            let i = Number(paymentPlanDuration[0]);
            i <= Number(paymentPlanDuration[paymentPlanDuration.length - 1]);
            i++
          ) {
            newData.push({
              name: i.toString(),
              value: i.toString(),
            })
          }
        }
        return newData
      }
    }
  },
  firstFormValidation(lead, firstFormData, cnicValidate, leftPearlSqft, unitPearlDetailsData) {
    const { noProduct } = lead
    if (!noProduct) {
      if (firstFormData.pearl != null) {
        if (
          (firstFormData.pearl <= unitPearlDetailsData.pearlArea &&
            firstFormData.pearl >= 50 &&
            firstFormData.cnic != null &&
            firstFormData.cnic != '' &&
            firstFormData.projectSiteId != null &&
            cnicValidate === false &&
            firstFormData.paymentPlan === 'full_payment' &&
            firstFormData.productId) ||
          (firstFormData.pearl <= unitPearlDetailsData.pearlArea &&
            firstFormData.pearl >= 50 &&
            firstFormData.cnic != null &&
            firstFormData.cnic != '' &&
            cnicValidate === false &&
            firstFormData.projectSiteId != null &&
            firstFormData.paymentPlan != 'no' &&
            firstFormData.productId &&
            firstFormData.noOfInstallment &&
            firstFormData.downPayment !== '' &&
            firstFormData.possessionCharges !== '' &&
            firstFormData.installmentFrequency &&
            firstFormData.paymentPlanDuration)
        ) {
          if (leftPearlSqft < 50 && leftPearlSqft > 0) {
            return {
              firstFormValidate: true,
              openFirstScreenModal: false,
            }
          } else {
            return {
              firstFormValidate: false,
              openFirstScreenModal: true,
            }
          }
        } else {
          return {
            firstFormValidate: true,
            openFirstScreenModal: false,
          }
        }
      } else {
        if (
          (firstFormData.project != null &&
            firstFormData.floor != null &&
            firstFormData.unit != null &&
            firstFormData.paymentPlan != 'no' &&
            firstFormData.type != '' &&
            firstFormData.cnic != null &&
            firstFormData.cnic != '' &&
            firstFormData.projectSiteId != null &&
            cnicValidate === false &&
            firstFormData.productId &&
            firstFormData.noOfInstallment &&
            firstFormData.downPayment !== '' &&
            firstFormData.possessionCharges !== '' &&
            firstFormData.installmentFrequency) ||
          (firstFormData.project != null &&
            firstFormData.floor != null &&
            firstFormData.unit != null &&
            firstFormData.projectSiteId != null &&
            firstFormData.paymentPlan === 'full_payment' &&
            firstFormData.type != '' &&
            firstFormData.cnic != null &&
            firstFormData.cnic != '' &&
            cnicValidate === false &&
            firstFormData.productId)
        ) {
          return {
            firstFormValidate: false,
            openFirstScreenModal: true,
          }
        } else {
          return {
            firstFormValidate: true,
            openFirstScreenModal: false,
          }
        }
      }
    } else {
      if (firstFormData.pearl != null) {
        if (
          firstFormData.pearl <= unitPearlDetailsData.pearlArea &&
          firstFormData.pearl >= 50 &&
          firstFormData.cnic != null &&
          firstFormData.cnic != '' &&
          firstFormData.projectSiteId != null &&
          cnicValidate === false &&
          firstFormData.paymentPlan != 'no'
        ) {
          if (leftPearlSqft < 50 && leftPearlSqft > 0) {
            return {
              firstFormValidate: true,
              openFirstScreenModal: false,
            }
          } else {
            return {
              firstFormValidate: false,
              openFirstScreenModal: true,
            }
          }
        } else {
          return {
            firstFormValidate: true,
            openFirstScreenModal: false,
          }
        }
      } else {
        if (
          firstFormData.project != null &&
          firstFormData.floor != null &&
          firstFormData.unit != null &&
          firstFormData.paymentPlan != 'no' &&
          firstFormData.projectSiteId != null &&
          firstFormData.type != '' &&
          firstFormData.cnic != null &&
          firstFormData.cnic != '' &&
          cnicValidate === false
        ) {
          return {
            firstFormValidate: false,
            openFirstScreenModal: true,
          }
        } else {
          return {
            firstFormValidate: true,
            openFirstScreenModal: false,
          }
        }
      }
    }
  },
  createPearlSchedule(
    lead,
    user,
    firstFormData,
    pearlUnitPrice,
    unitPearlDetailsData,
    oneProductData,
    CMPayment,
    selectedClient,
    addInstrument,
    isPrimary
  ) {
    const { projectProduct } = oneProductData
    let body = PaymentHelper.createPearl({
      firstFormData,
      pearlUnitPrice,
      unitPearlDetailsData,
      lead,
      user,
    })
    body = {
      ...body,
      finalPrice:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice,

      installmentFrequency: Number(firstFormData.installmentFrequency),
      paymentPlan: firstFormData.paymentPlan,
      downPayment:
        firstFormData.paymentPlan === 'installments' ? Number(firstFormData.downPayment) : null,
      noOfInstallment:
        firstFormData.paymentPlan === 'installments' ? Number(firstFormData.noOfInstallment) : null,
      paymentPlanDuration: firstFormData.paymentPlanDuration
        ? Number(firstFormData.paymentPlanDuration)
        : null,
      remainingPayment:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice - CMPayment.installmentAmount,
      instrumentId: addInstrument.id,
      isPrimary,
      possessionCharges:
        firstFormData.paymentPlan === 'installments'
          ? Number(firstFormData.possessionCharges)
          : null,
      possessionChargesPercentage: projectProduct.possessionChargesPercentage,
      downPaymentPercentage: projectProduct.downPaymentPercentage,
      productId: firstFormData.productId,
      remainingPayment:
        firstFormData.finalPrice === null || firstFormData.finalPrice === ''
          ? null
          : firstFormData.finalPrice - CMPayment.installmentAmount,
      unitStatus: 'hold',
      reasons: 'pending_token',
      installmentAmount: CMPayment.installmentAmount,
      purchaserId: selectedClient ? selectedClient.id : lead.customer.id,
      downPaymentMax: projectProduct.downPaymentMax,
      downPaymentMin: projectProduct.downPaymentMin,
      installmentFrequencyMax: Number(projectProduct.installmentFrequencyMax),
      installmentFrequencyMin: Number(projectProduct.installmentFrequencyMin),
      noInstallmentsMax: projectProduct.noInstallmentsMax,
      noInstallmentsMin: projectProduct.noInstallmentsMin,
      possessionChargesMax: projectProduct.possessionChargesMax,
      possessionChargesMin: projectProduct.possessionChargesMin,
    }
    return body
  },
  setOfficeLocation(locations, project) {
    if (locations && locations.length > 0) {
      let allLocations = []
      if (project.externalProject === true) {
        let externalProjectObj = _.find(locations, (item) => {
          return item.externalProject === true
        })
        if (externalProjectObj) {
          allLocations.push({ name: externalProjectObj.name, value: externalProjectObj.id })
        }
      } else {
        allLocations = locations.map((item) => {
          return {
            name: item.name,
            value: item.id,
          }
        })
      }
      return allLocations
    }
  },
  generateKFIPayload(singleLeadRecord) {
    let discountedAmount =
      (singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.unit_price) -
      (singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.finalPrice)
    let investmentDuration =
      singleLeadRecord &&
      singleLeadRecord.projectProduct &&
      singleLeadRecord.projectProduct.investmentDuration
    let discount =
      (100 * discountedAmount) /
      (singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.unit_price)
    let discountParseValue = discount > 0 ? Number(discount).toFixed(2) : 0
    let num = 12312312
    let templateData = {
      ClientName:
        singleLeadRecord && singleLeadRecord.customer && singleLeadRecord.customer.customerName
          ? singleLeadRecord && singleLeadRecord.customer && singleLeadRecord.customer.customerName
          : '--',
      ClientCNIC:
        singleLeadRecord && singleLeadRecord.unit !== null
          ? helper.normalizeCnic(
              singleLeadRecord && singleLeadRecord.customer && singleLeadRecord.customer.cnic
            )
          : '--',
      ProjectName:
        singleLeadRecord && singleLeadRecord.paidProject !== null
          ? singleLeadRecord && singleLeadRecord.paidProject && singleLeadRecord.paidProject.name
          : singleLeadRecord && singleLeadRecord.project && singleLeadRecord.project.name,
      FloorName:
        singleLeadRecord && singleLeadRecord.floor !== null
          ? singleLeadRecord && singleLeadRecord.floor && singleLeadRecord.floor.name
          : '--',
      UnitName:
        singleLeadRecord && singleLeadRecord.unit !== null
          ? singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.name
          : '--',
      Size:
        singleLeadRecord && singleLeadRecord.unit !== null
          ? helper.currencyConvert(
              Number(singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.area)
            )
          : '--',
      RatePerSqft:
        singleLeadRecord && singleLeadRecord.unit !== null
          ? helper.currencyConvert(
              Number(PaymentMethods.findRatePerSqft(singleLeadRecord && singleLeadRecord.unit))
            )
          : '--',
      UnitPrice:
        singleLeadRecord && singleLeadRecord.unit !== null
          ? helper.currencyConvert(
              Math.ceil(
                Number(
                  singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.unit_price
                )
              )
            )
          : '--',
      ProductName:
        Object.keys(singleLeadRecord && singleLeadRecord.projectProduct).length !== 0
          ? singleLeadRecord && singleLeadRecord.projectProduct.name
          : '--',
      PaymentPlan: helper.capitalizeWordsWithoutUnderscore(
        singleLeadRecord &&
          singleLeadRecord.projectProduct &&
          singleLeadRecord.projectProduct.paymentPlan
      ),
      PlanDuration:
        singleLeadRecord &&
        singleLeadRecord.projectProduct &&
        singleLeadRecord.projectProduct.paymentPlanDuration !== null
          ? singleLeadRecord &&
            singleLeadRecord.projectProduct &&
            singleLeadRecord.projectProduct.paymentPlanDuration &&
            singleLeadRecord &&
            singleLeadRecord.projectProduct &&
            singleLeadRecord.projectProduct.paymentPlanDuration[1] + ' - ' + singleLeadRecord &&
            singleLeadRecord.projectProduct &&
            singleLeadRecord.projectProduct.paymentPlanDuration[3] + ' Years'
          : '--',
      InstallmentFrequency:
        singleLeadRecord && singleLeadRecord.installmentFrequency !== null
          ? helper.capitalize(singleLeadRecord && singleLeadRecord.installmentFrequency)
          : '--',
      ReservationAmount:
        singleLeadRecord &&
        singleLeadRecord.projectProduct &&
        singleLeadRecord.projectProduct.value !== null
          ? singleLeadRecord &&
            singleLeadRecord.projectProduct &&
            singleLeadRecord.projectProduct.reservationAmount === 'percentage'
            ? `${
                singleLeadRecord &&
                singleLeadRecord.projectProduct &&
                singleLeadRecord.projectProduct.value
              } %`
            : `${helper.currencyConvert(
                Math.ceil(
                  Number(
                    singleLeadRecord &&
                      singleLeadRecord.projectProduct &&
                      singleLeadRecord.projectProduct.value
                  )
                )
              )}`
          : '--',
      Downpayment:
        singleLeadRecord &&
        singleLeadRecord.projectProduct &&
        singleLeadRecord.projectProduct.downPayment,
      DownPaymentValue:
        singleLeadRecord &&
        singleLeadRecord.projectProduct &&
        singleLeadRecord.projectProduct.downPayment === 0
          ? null
          : helper.currencyConvert(
              Math.ceil(Number(singleLeadRecord && singleLeadRecord.downPayment))
            ),
      PossessionCharges:
        singleLeadRecord &&
        singleLeadRecord.projectProduct &&
        singleLeadRecord.projectProduct.possessionCharges,

      Discount: discountParseValue,
      DiscountAmount:
        discount === 0 || discount < 0
          ? null
          : `${helper.currencyConvert(
              Math.ceil(
                Number(
                  (singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.unit_price) -
                    (singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.finalPrice)
                )
              )
            )}`,
      DiscountedAmount: helper.currencyConvert(
        Math.ceil(
          Number(singleLeadRecord && singleLeadRecord.unit && singleLeadRecord.unit.finalPrice)
        )
      ),
      InvestmentDurationValue:
        investmentDuration === 'limited'
          ? `${
              singleLeadRecord &&
              singleLeadRecord.projectProduct &&
              singleLeadRecord.projectProduct.investmentDurationPeriod
            } Months`
          : 'Unlimited',
      AnnualProfit:
        singleLeadRecord &&
        singleLeadRecord.projectProduct &&
        singleLeadRecord.projectProduct.annualProfit !== null
          ? singleLeadRecord &&
            singleLeadRecord.projectProduct &&
            singleLeadRecord.projectProduct.annualProfit
          : '--',
      AnnualRent:
        singleLeadRecord &&
        singleLeadRecord.projectProduct &&
        singleLeadRecord.projectProduct.monthlyRent !== null
          ? singleLeadRecord &&
            singleLeadRecord.projectProduct &&
            singleLeadRecord.projectProduct.monthlyRent
          : '--',
    }
    return templateData
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
}
module.exports = PaymentHelper
