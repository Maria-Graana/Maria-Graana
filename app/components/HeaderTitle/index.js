/** @format */

import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import StaticData from '../../StaticData'

class HeaderTitle extends React.Component {
  constructor(props) {
    super(props)
  }

  leadSize = (unit) => {
    const { lead } = this.props
    let minSize = !lead.projectId && lead.size !== null && lead.size !== undefined ? lead.size : ''
    let maxSize =
      !lead.projectId && lead.max_size !== null && lead.max_size !== undefined ? lead.max_size : ''
    return (
      helper.convertSizeToStringV2(minSize, maxSize, StaticData.Constants.size_any_value, unit) +
      ' '
    )
  }

  render() {
    const { lead } = this.props
    let headerName = lead.customer && lead.customer.customerName && lead.customer.customerName
    if (!headerName && headerName === '') headerName = lead.customer && lead.customer.phone
    let leadSize = this.leadSize(lead.size_unit)
    return (
      <View style={styles.mainView}>
        <Text numberOfLines={1} style={styles.headerText}>
          {headerName}
        </Text>
        {!lead.projectId && !lead.projectName ? (
          <Text numberOfLines={1} style={[styles.detailText]}>
            {leadSize}
            {lead.subtype && helper.capitalize(lead.subtype)} {lead.purpose != null && 'to '}
            {lead.purpose === 'sale' ? 'Buy' : 'Rent'}
          </Text>
        ) : (
          <Text numberOfLines={1} style={[styles.detailText]}>
            {lead.project
              ? helper.capitalize(lead.project.name)
              : helper.capitalize(lead.projectName)}
            {lead.projectType ? ' - ' + helper.capitalize(lead.projectType) : ''}
          </Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    color: AppStyles.colors.primaryColor,
  },
  detailText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    color: AppStyles.colors.primaryColor,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(HeaderTitle)
