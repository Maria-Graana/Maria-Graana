import React from "react";
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import helper from '../../helper';

class HeaderTitle extends React.Component {
    constructor(props) {
        super(props)
    }

    leadSize = () => {
        const { lead } = this.props
        let minSize = !lead.projectId && lead.size && lead.size !== 0 ? lead.size : ''
        let maxSize = !lead.projectId && lead.max_size && lead.max_size !== 0 ? lead.max_size : ''
        let size = ''
        if (minSize == maxSize) {
            size = minSize + ' '
        } else {
            maxSize = maxSize !== '' ? ' - ' + maxSize : maxSize
            size = minSize + maxSize + ' '
        }
        return size
    }

    render() {
        const { lead } = this.props
        let headerName = lead.customer && lead.customer.customerName && lead.customer.customerName
        if (!headerName && headerName === '') headerName = lead.customer && lead.customer.phone
        let leadSize = this.leadSize()
        return (
            <View style={styles.mainView}>
                <Text style={styles.headerText}>{headerName}</Text>
                {
                    !lead.projectId ?
                        < Text numberOfLines={1} style={[styles.detailText, AppStyles.darkColor,]}>
                            {leadSize}
                            {lead.size_unit && lead.size_unit !== null ? helper.capitalize(lead.size_unit) + ' ' : null}
                            {lead.subtype && helper.capitalize(lead.subtype)} {lead.purpose != null && 'to '}
                            {lead.purpose === 'sale' ? 'Buy' : 'Rent'}
                        </Text>
                        :
                        < Text numberOfLines={1} style={[styles.detailText, AppStyles.darkColor,]}>
                            {lead.project ? helper.capitalize(lead.project.name) : helper.capitalize(lead.projectName)}{lead.projectType ? ' - ' + helper.capitalize(lead.projectType) : ''}
                        </Text>
                }

            </View>

        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        fontFamily: AppStyles.fonts.boldFont,
        fontSize: 16
    },
    detailText: {
        fontFamily: AppStyles.fonts.defaultFont,
        fontSize: 14
    }
});

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        lead: store.lead.lead
    }
}

export default connect(mapStateToProps)(HeaderTitle)
