import React from 'react';
import styles from './style'
import { View, ScrollView, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import ReportFilterButton from '../../components/ReportFilterButton/index';
import ReportFooter from '../../components/ReportFooter/index';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import Ability from '../../hoc/Ability';
import helper from '../../helper';
import SquareContainer from '../../components/SquareContainer';
import RegionFilter from '../../components/RegionFilter';
import AgentFilter from '../../components/AgentFilter';
import ZoneFilter from '../../components/ZoneFilter';
import clientAddedImg from '../../../assets/img/client-added.png';
import leadsAssignedImg from '../../../assets/img/leads-assigned.png';
import leadsCreatedImg from '../../../assets/img/leads-created.png';
import comissionRevenueImg from '../../../assets/img/commission-revenue-icon.png';
import viewingConductedImg from '../../../assets/img/viewing-conducted.png';
import viewingOverdueImg from '../../../assets/img/viewing-overdue.png';
import listIconImg from '../../../assets/img/list-icon.png';
import calendarImg from '../../../assets/img/calendar-s.png';
import CalendarComponent from '../../components/CalendarComponent';
import MonthPicker from '../../components/MonthPicker';
import YearPicker from '../../components/YearPicker';
import QuarterPicker from '../../components/QuarterPicker';
import _ from 'underscore';
import axios from 'axios';
import moment from 'moment';
import { Menu } from 'react-native-paper';
import { BarChart } from "react-native-chart-kit";

const _today = moment(new Date().dateString).format(_format);
const _format = 'YYYY-MM-DD';

class RCMReport extends React.Component {
    constructor(props) {
        const date = new Date();
        super(props)
        this.state = {
            fiddu: false,
            quarters: [{ value: 1, name: 'Q1' }, { value: 2, name: 'Q2' }, { value: 3, name: 'Q3' }, { value: 4, name: 'Q4' }],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            startYear: 2000,
            endYear: 2050,
            selectedQuarter: 1,
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth() + 1,
            showCalendar: false,
            selectedDate: moment(_today).format(_format),
            filterLabel: 'Daily',
            footerLabel: 'Agent',
            showRegionFilter: false,
            showAgentFilter: false,
            showZoneFilter: false,
            checkValidation: false,
            dateText: '',
            regionText: '',
            regions: [],
            zones: [],
            agents: [],
            organizations: [{ value: 'Graana', name: 'Graana' }, { value: 'Agency21', name: 'Agency21' }],
            regionFormData: {
                organization: '',
                region: ''
            },
            agentFormData: {
                organization: '',
                region: '',
                zone: '',
                agent: ''
            },
            zoneFormData: {
                organization: '',
                region: '',
                zone: '',
            },
        }
    }

    componentDidMount() {
        this.fetchRegions()
    }

    fetchRegions = () => {
        axios.get('/api/cities/regions?active=true')
            .then((res) => {
                let regions = []
                res && res.data.items.length && res.data.items.map((item, index) => { return (regions.push({ value: item.id, name: item.name })) })
                this.setState({ regions, zones: [], agents: [] })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    fetchZones = (value) => {
        const { agentFormData } = this.state
        let armsZone = false
        if (agentFormData.organizations === 'Agency21') armsZone = true
        axios.get(`/api/areas/zones?status=active&armsZone=${armsZone}&all=true&regionId=${value}`)
            .then((res) => {
                let zones = []
                res && res.data.items.length && res.data.items.map((item, index) => { return (zones.push({ value: item.id, name: item.zone_name })) })
                this.setState({ zones, agents: [] })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    fetchAgents = (zone) => {
        axios.get(`/api/user/agents?zoneId=${zone}`)
            .then((res) => {
                let agents = []
                res && res.data.length && res.data.map((item, index) => { return (agents.push({ value: item.id, name: item.firstName + ' ' + item.lastName })) })
                this.setState({ agents })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    selectedFilterButton = (label) => { this.setState({ filterLabel: label }, () => { this.checkDate() }) }

    selectedFooterButton = (label) => { this.setState({ footerLabel: label }) }

    openRegionFilter = () => { this.setState({ showRegionFilter: true }) }

    openAgentFilter = () => { this.setState({ showAgentFilter: true }) }

    openZoneFilter = () => { this.setState({ showZoneFilter: true }) }

    closeFilters = () => { this.setState({ showRegionFilter: false, showAgentFilter: false, showZoneFilter: false, regionText: '' }) }

    handleRegionForm = (value, name) => {
        const { regionFormData } = this.state
        regionFormData[name] = value
        this.setState({ regionFormData })
    }

    handleAgentForm = (value, name) => {
        const { agentFormData } = this.state
        let x = _.clone(agentFormData)
        x[name] = value
        agentFormData[name] = value
        if (name === 'region') agentFormData.zone = ''; agentFormData.agent = ''
        if (name === 'zone') agentFormData.agent = ''
        console.log('name: ', name)
        console.log('value: ', value)
        console.log('agentFormData: ', x)
        this.setState({ agentFormData: x })
    }

    handleZoneForm = (value, name) => {
        const { zoneFormData } = this.state
        zoneFormData[name] = value
        if (name === 'region') agentFormData.zone = '';
        this.setState({ zoneFormData })
    }

    submitRegionFilter = () => {
        const { regionFormData, regions } = this.state
        if (!regionFormData.organization || !regionFormData.region) { this.setState({ checkValidation: true }) }
        else {
            let region = _.find(regions, function (item) { return item.value === regionFormData.region })
            this.setState({ showRegionFilter: false, checkValidation: false, regionText: region.name + ', ' + regionFormData.organization })
        }
    }

    submitAgentFilter = () => {
        const { agentFormData, regions, zones, agents } = this.state
        if (!agentFormData.organization || !agentFormData.region || !agentFormData.zone || !agentFormData.agent) { this.setState({ checkValidation: true }) }
        else {
            let region = _.find(regions, function (item) { return item.value === agentFormData.region })
            let zone = _.find(zones, function (item) { return item.value === agentFormData.zone })
            let agent = _.find(agents, function (item) { return item.value === agentFormData.agent })

            this.setState({ showAgentFilter: false, checkValidation: false, regionText: agent.name + ', ' + zone.name + ', ' + region.name + ', ' + agentFormData.organization })
        }
    }

    submitZoneFilter = () => {
        const { zoneFormData, regions, zones } = this.state
        if (!zoneFormData.organization || !zoneFormData.region || !zoneFormData.zone) { this.setState({ checkValidation: true }) }
        else {
            let region = _.find(regions, function (item) { return item.value === zoneFormData.region })
            let zone = _.find(zones, function (item) { return item.value === zoneFormData.zone })

            console.log(zoneFormData)
            this.setState({ showZoneFilter: false, checkValidation: false, regionText: zone.name + ', ' + region.name + ', ' + zoneFormData.organization })
        }
    }

    openFilter = () => {
        const { footerLabel } = this.state
        if (footerLabel === 'Region') this.openRegionFilter()
        else if (footerLabel === 'Agent') this.openAgentFilter()
        else if (footerLabel === 'Team') this.openZoneFilter()
        else this.openZoneFilter()
    }

    updateDay = (day) => {
        const { dateString } = day
        let newDate = moment(dateString).format(_format)
        this.setState({
            selectedDate: newDate,
            showCalendar: false
        })
    }

    showDate = () => {
        const { filterLabel } = this.state
        if (filterLabel === 'Daily') this._toggleShow()
        if (filterLabel === 'Monthly') this.showPicker()
        if (filterLabel === 'Quarterly') this.showQuarterPicker()
        if (filterLabel === 'Yearly') this.showYearPicker()
        else { }
    }

    showPicker = () => {
        const { startYear, endYear, selectedYear, selectedMonth } = this.state;
        this.picker
            .show({ startYear, endYear, selectedYear, selectedMonth })
            .then(({ year, month }) => {
                this.setState({
                    selectedYear: year,
                    selectedMonth: month,
                }, () => {
                    this.checkDate()
                    console.log(this.state.selectedYear, this.state.selectedMonth)
                })
            })
    }

    showQuarterPicker = () => {
        const { startYear, endYear, selectedYear, selectedQuarter } = this.state;
        this.quarterPicker
            .show({ startYear, endYear, selectedYear, selectedQuarter })
            .then(({ year, quarter }) => {
                this.setState({
                    selectedYear: year,
                    selectedQuarter: quarter,
                }, () => {
                    this.checkDate()
                    console.log(this.state.selectedYear, this.state.selectedQuarter)
                })
            })
    }

    showYearPicker = () => {
        const { startYear, endYear, selectedYear } = this.state;
        this.yearPicker
            .show({ startYear, endYear, selectedYear })
            .then(({ year }) => {
                this.setState({
                    selectedYear: year,
                }, () => {
                    this.checkDate()
                    console.log(this.state.selectedYear)
                })
            })
    }

    checkDate = () => {
        const { filterLabel, selectedYear, selectedMonth, months, selectedQuarter, quarters } = this.state
        if (filterLabel === 'Daily') this.setState({ selectedDate: moment(_today).format(_format) })
        if (filterLabel === 'Monthly') this.setState({ selectedDate: months[selectedMonth - 1] + ' ' + selectedYear })
        if (filterLabel === 'Yearly') this.setState({ selectedDate: selectedYear })
        if (filterLabel === 'Quarterly') {
            let quarter = _.find(quarters, function (item) { return item.value === selectedQuarter })
            this.setState({ selectedDate: quarter.name + ', ' + selectedYear })
        }
        else { }
    }

    setfiddu = () => {
        this.setState({ fiddu: !this.state.fiddu })
    }

    _toggleShow = () => { this.setState({ showCalendar: !this.state.showCalendar }) }

    render() {
        const { showCalendar, selectedDate, agents, zones, filterLabel, footerLabel, showRegionFilter, showAgentFilter, showZoneFilter, organizations, regionFormData, checkValidation, regionText, regions, agentFormData, zoneFormData } = this.state
        const width = Dimensions.get('window').width - 25
        const height = 220
        let chartConfig = {
            backgroundColor: "white",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgb(66, 164, 245, 10)`,
            labelColor: (opacity = 1) => `black`,
            style: {
                backgroundGradientFrom: "#fb8c00",
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: AppStyles.colors.subTextColor
            },
            propsForDots: {
                r: "0",
                strokeWidth: "0",
                stroke: "#ffa726",
            },
        }
        const graphStyle = {
            marginVertical: 8,
            ...chartConfig.style
        }

        return (
            <View style={[AppStyles.mb1, { backgroundColor: '#ffffff' }]}>
                <View style={styles.buttonsContainer}>
                    <View style={styles.btnView}>
                        <ReportFilterButton label='Daily' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Daily' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Daily' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Weekly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Weekly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Weekly' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Monthly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Monthly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Monthly' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Quarterly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Quarterly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Quarterly' ? { color: '#ffffff' } : null} />
                        <ReportFilterButton label='Yearly' selectedFilterButton={this.selectedFilterButton} buttonStyle={filterLabel === 'Yearly' ? styles.selectedBtn : null} textPropStyle={filterLabel === 'Yearly' ? { color: '#ffffff' } : null} />
                    </View>
                </View>

                <RegionFilter regions={regions} checkValidation={checkValidation} submitRegionFilter={this.submitRegionFilter} handleRegionForm={this.handleRegionForm} formData={_.clone(regionFormData)} organizations={organizations} openPopup={showRegionFilter} closeFilters={this.closeFilters} />
                <AgentFilter agents={agents} fetchAgents={this.fetchAgents} zones={zones} fetchZones={this.fetchZones} regions={regions} checkValidation={checkValidation} submitAgentFilter={this.submitAgentFilter} handleAgentForm={this.handleAgentForm} formData={_.clone(agentFormData)} organizations={organizations} openPopup={showAgentFilter} closeFilters={this.closeFilters} />
                <ZoneFilter zones={zones} fetchZones={this.fetchZones} regions={regions} checkValidation={checkValidation} submitZoneFilter={this.submitZoneFilter} handleZoneForm={this.handleZoneForm} formData={_.clone(zoneFormData)} organizations={organizations} openPopup={showZoneFilter} closeFilters={this.closeFilters} />

                <View style={styles.inputView}>
                    <View style={styles.regionStyle}>
                        <View style={styles.textView}>
                            <Text style={styles.textStyle}>{regionText}</Text>
                        </View>
                        <Menu
                            visible={this.state.fiddu}
                            onDismiss={this.setfiddu}
                            style={{ marginTop: 30 }}
                            contentStyle={{ width: 150 }}
                            anchor={
                                <TouchableOpacity style={styles.inputBtn} onPress={() => { this.openFilter() }}>
                                    <Image source={listIconImg} style={styles.regionImg} />
                                </TouchableOpacity>
                            }
                        >
                            <Menu.Item onPress={() => { }} title="Graana" />
                            <Menu.Item onPress={() => { }} title="Agency21" />
                        </Menu>
                    </View>
                    <View style={styles.dateView}>
                        <View style={styles.textView}>
                            <Text style={styles.textStyle}>{selectedDate}</Text>
                        </View>
                        <TouchableOpacity style={styles.inputBtn} onPress={() => this.showDate()}>
                            <Image source={calendarImg} style={styles.calendarImg} />
                        </TouchableOpacity>
                    </View>
                </View>

                <MonthPicker ref={(picker) => this.picker = picker} />
                <YearPicker ref={(picker) => this.yearPicker = picker} />
                <QuarterPicker ref={(picker) => this.quarterPicker = picker} />

                {
                    showCalendar ?
                        < CalendarComponent startDate={selectedDate} updateDay={this.updateDay} onPress={this._toggleShow} />
                        :
                        null
                }

                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.sqaureView}>
                        <SquareContainer containerStyle={styles.squareRight} imagePath={comissionRevenueImg} label={'Comission Revenue'} total={72} />
                        <SquareContainer imagePath={leadsAssignedImg} label={'Leads Assigned'} total={121} />
                    </View>
                    <View style={styles.sqaureView}>
                        <SquareContainer containerStyle={styles.squareRight} imagePath={leadsCreatedImg} label={'Leads Created'} total={222} />
                        <SquareContainer imagePath={clientAddedImg} label={'Clients Added'} total={72} />
                    </View>
                    <View style={styles.sqaureView}>
                        <SquareContainer containerStyle={styles.squareRight} imagePath={viewingConductedImg} label={'Viewings Conducted'} total={121} />
                        <SquareContainer imagePath={viewingOverdueImg} label={'Viewings Overdue'} total={'15'} />
                    </View>
                    <BarChart
                        verticalLabelRotation={15}
                        showValuesOnTopOfBars={true}
                        useShadowColorFromDataset={true}
                        withInnerLines={false}
                        withDots={false}
                        fromZero={true}
                        withHorizontalLabels={true}
                        showBarTops={true}
                        width={width}
                        height={height}
                        data={StaticData.rcmBarCharData}
                        chartConfig={chartConfig}
                        style={graphStyle}
                    />
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

export default connect(mapStateToProps)(RCMReport)