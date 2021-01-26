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
}
module.exports = PaymentMethods
