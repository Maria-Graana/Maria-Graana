import React from "react";
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import helper from '../../helper';

class HeaderTitle extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { lead } = this.props
        let headerName = lead.customer && lead.customer.customerName && lead.customer.customerName
        if (!headerName && headerName === '') headerName = lead.customer && lead.customer.phone

        return (
            <View style={styles.mainView}>
                <Text style={styles.headerText}>{headerName}</Text>
                {
                    !lead.projectId ?
                        < Text style={[styles.detailText, AppStyles.darkColor,]}>
                            {lead.size && lead.size !== 0 ? lead.size + ' ' : null}
                            {lead.size_unit && lead.size_unit !== null ? helper.capitalize(lead.size_unit) + ' ' : null}
                            {lead.subtype && helper.capitalize(lead.subtype)} {lead.purpose != null && 'to '}
                            {lead.purpose === 'sale' ? 'Buy' : 'Rent'}
                        </Text>
                        :
                        < Text style={[styles.detailText, AppStyles.darkColor,]}>
                            {lead.projectName && lead.projectName} {+"- " + lead.projectType && lead.projectType}
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
