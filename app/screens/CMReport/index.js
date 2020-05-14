import React from 'react';
import styles from './style'
import { View, ScrollView } from 'react-native';
import ReportFilterButton from '../../components/ReportFilterButton/index';
import ReportFooter from '../../components/ReportFooter/index';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import Ability from '../../hoc/Ability';
import helper from '../../helper';
import SquareContainer from '../../components/SquareContainer';
import RectangleContainer from '../../components/RectangleContainer';
import clientAddedImg from '../../../assets/img/client-added.png';
import leadsAssignedImg from '../../../assets/img/leads-assigned.png';
import leadsCreatedImg from '../../../assets/img/leads-created.png';
import amountPendingImg from '../../../assets/img/amount-pending.png';

class CMReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterLabel: 'Daily',
            footerLabel: 'Agent'
        }
    }

    componentDidMount() {
    }

    selectedFilterButton = (label) => {
        this.setState({ filterLabel: label })
    }

    selectedFooterButton = (label) => {
        this.setState({ footerLabel: label })
    }

    render() {
        const { filterLabel, footerLabel } = this.state

        return (
            <View style={[AppStyles.mb1, { backgroundColor: '#ffffff' }]}>
                <View style={styles.buttonsContainer}>
                    <View style={styles.btnView}>
                        <ReportFilterButton label='Daily' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Daily' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Daily' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Weekly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Weekly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Weekly' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Monthly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Monthly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Monthly' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Quaterly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Quaterly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Quaterly' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Yearly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Yearly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Yearly' ? { color: '#ffffff' } : null} />
                    </View>
                </View>
                <ScrollView style={styles.scrollContainer}>
                    <RectangleContainer targetPercent={60} targetNumber={'1,200,000'} totalTarget={'2,000,000'}/>
                    <View style={styles.sqaureView}>
                        <SquareContainer containerStyle={styles.squareRight} imagePath={clientAddedImg} label={'Clients Added'} total={72}/>
                        <SquareContainer imagePath={leadsAssignedImg} label={'Leads Assigned'} total={121}/>
                    </View>
                    <View style={styles.sqaureView}>
                        <SquareContainer containerStyle={styles.squareRight} imagePath={leadsCreatedImg} label={'Leads Created'} total={222}/>
                        <SquareContainer imagePath={amountPendingImg} label={'Amount Pending'} total={'15 Lac'}/>
                    </View>
                </ScrollView>
                <ReportFooter label={footerLabel} selectedFooterButton={this.selectedFooterButton} />
            </View>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(CMReport)