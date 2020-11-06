/** @format */

import React from 'react'
import styles from './style'
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import ReportFilterButton from '../../components/ReportFilterButton/index'
import ReportFooter from '../../components/ReportFooter/index'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import SquareContainer from '../../components/SquareContainer'
import RegionFilter from '../../components/RegionFilter'
import AgentFilter from '../../components/AgentFilter'
import ZoneFilter from '../../components/ZoneFilter'
import OrganizationFilter from '../../components/OrganizationFilter'
import clientsAddedImg from '../../../assets/img/client-added.png'
import leadsAssignedImg from '../../../assets/img/leads-assigned.png'
import leadsCreatedImg from '../../../assets/img/leads-created.png'
import comissionRevenueImg from '../../../assets/img/commission-revenue-icon.png'
import viewingConductedImg from '../../../assets/img/viewing-conducted.png'
import viewingOverdueImg from '../../../assets/img/viewing-overdue.png'
import listIconImg from '../../../assets/img/list-icon.png'
import calendarImg from '../../../assets/img/calendar-s.png'
import offersPlaced from '../../../assets/img/offersPlaced.png'
import firstCall from '../../../assets/img/firstCall.png'
import TotalCalls from '../../../assets/img/totalCalls.png'
import LeadClosed from '../../../assets/img/leadClosed.png'
import CalendarComponent from '../../components/CalendarComponent'
import MonthPicker from '../../components/MonthPicker'
import YearPicker from '../../components/YearPicker'
import QuarterPicker from '../../components/QuarterPicker'
import _ from 'underscore'
import axios from 'axios'
import moment from 'moment'
import { BarChart } from 'react-native-chart-kit'
import Loader from '../../components/loader'
import RectangleDaily from '../../components/RectangleDaily'

const _today = moment(new Date().dateString).format(_format)
const _format = 'YYYY-MM-DD'

class RCMReport extends React.Component {
  constructor(props) {
    const date = new Date()
    super(props)
    this.state = {
      showFooter: true,
      viewLoader: true,
      backCheck: false,
      loading: true,
      lastLabel: 'Organization',
      dashBoardData: {
        clientsAdded: 0,
        totalLeadsAdded: 0,
        totalleadsAssigned: 0,
        pendingAmount: 0,
        leadSigned: [],
      },
      showOrganizationFilter: false,
      quarters: [
        { value: 1, name: 'Q1', fromDate: '01-01', toDate: '03-31' },
        { value: 2, name: 'Q2', fromDate: '04-01', toDate: '06-30' },
        { value: 3, name: 'Q3', fromDate: '07-01', toDate: '09-30' },
        { value: 4, name: 'Q4', fromDate: '09-01', toDate: '12-31' },
      ],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      startYear: 2000,
      endYear: 2050,
      selectedOrganization: 2,
      regionText: 'Graana',
      selectedQuarter: 0,
      selectedYear: date.getFullYear(),
      selectedMonth: date.getMonth() + 1,
      showCalendar: false,
      selectedDate: moment(_today).format(_format),
      startWeek: moment(_today).startOf('isoWeek').format('YYYY-MM-DD'),
      endWeek: moment(_today).endOf('isoWeek').format('YYYY-MM-DD'),
      filterLabel: 'Monthly',
      footerLabel: 'Organization',
      showRegionFilter: false,
      showAgentFilter: false,
      showZoneFilter: false,
      checkValidation: false,
      dateText: '',
      regions: [],
      zones: [],
      agents: [],
      regionFormData: {
        organization: '',
        region: '',
      },
      agentFormData: {
        organization: '',
        region: '',
        zone: '',
        agent: '',
      },
      zoneFormData: {
        organization: '',
        region: '',
        zone: '',
      },
      organizationFormData: {
        organization: '',
      },
      fromDate: moment(_today).format(_format),
      toDate: moment(_today).format(_format),
      organizations: [],
      graphLabels: [
        'open',
        'called',
        'viewing',
        'offer',
        'propsure',
        'token',
        'payment',
        'closed_won',
        'closed_lost',
      ],
      leadsCount: 0,
    }
  }

  componentDidMount() {
    this.checkRole()
  }

  checkRole = () => {
    const { user } = this.props
    let { regionFormData, agentFormData, zoneFormData } = this.state
    let agentRole = [
      'area_manager',
      'sales_agent',
      'business_centre_agent',
      'call_centre_warrior',
      'call_centre_agent',
    ]
    if (agentRole.includes(user.subRole)) {
      this.setAgentView()
    }
    if (user.subRole === 'regional_head') {
      if ('region' in user && user.region) {
        regionFormData = {
          organization: user.organizationId,
          region: user.region.id,
        }
        this.setState(
          {
            organizations: [{ value: user.organizationId, name: user.organizationName }],
            regionFormData,
            lastLabel: 'Region',
            footerLabel: 'Region',
            regionText: user.region.name + ', ' + user.organizationName,
            regions: [{ value: user.region.id, name: user.region.name }],
          },
          () => {
            this.checkDate()
          }
        )
      } else helper.errorToast('Error: Displaying Dashboard')
    }
    if (
      user.subRole === 'zonal_manager' ||
      user.subRole === 'branch_manager' ||
      user.subRole === 'business_centre_manager' ||
      user.subRole === 'call_centre_manager'
    ) {
      let organizations = [{ value: user.organizationId, name: user.organizationName }]
      if ('region' in user && 'armsTeam' in user && user.armsTeam && user.region) {
        zoneFormData = {
          organization: user.organizationId,
          region: user.region.id,
          zone: user.armsTeam.id,
        }
        this.setState(
          {
            lastLabel: 'Team',
            footerLabel: 'Team',
            organizations,
            regionFormData,
            agentFormData,
            zoneFormData,
            regionText:
              user.armsTeam.teamName + ', ' + user.region.name + ', ' + user.organizationName,
            regions: [{ value: user.region.id, name: user.region.name }],
            zones: [{ value: user.armsTeam.id, name: user.armsTeam.teamName }],
          },
          () => {
            this.checkDate()
          }
        )
      } else helper.errorToast('Error: Displaying Dashboard')
    }
    if (
      user.subRole === 'country_head' ||
      user.subRole === 'group_head' ||
      user.subRole === 'group_management'
    ) {
      this.fetchOrganizations()
      this.checkDate()
    }
  }

  setAgentView = () => {
    const { user } = this.props
    if (user && 'region' in user && 'armsTeam' in user && user.armsTeam && user.region) {
      let organizations = [{ value: user.organizationId, name: user.organizationName }]
      let newAgentForm = {
        organization: user.organizationId,
        region: user.region.id,
        zone: user.armsTeam.id,
        agent: user.id,
      }
      this.setState(
        {
          showFooter: false,
          lastLabel: 'Agent',
          footerLabel: 'Agent',
          organizations,
          filterLabel: 'Daily',
          agentFormData: newAgentForm,
          regionText:
            user.firstName +
            ' ' +
            user.lastName +
            ', ' +
            user.armsTeam.teamName +
            ', ' +
            user.region.name +
            ', ' +
            user.organizationName,
          regions: [{ value: user.region.id, name: user.region.name }],
          zones: [{ value: user.armsTeam.id, name: user.armsTeam.teamName }],
          agents: [{ value: user.id, name: user.firstName + ' ' + user.lastName }],
        },
        () => {
          this.checkDate()
        }
      )
    } else helper.errorToast('Error: Displaying Dashboard')
  }

  graphData = (data) => {
    const { graphLabels } = this.state
    let graph = _.clone(StaticData.rcmBarCharData)
    let leadSigned = data.leadSigned || []
    let dataSets = []
    let labelCheck = false
    if (leadSigned.length) {
      for (let label of graphLabels) {
        labelCheck = false
        for (let item of leadSigned) {
          if (item.status === label) {
            labelCheck = true
            dataSets.push(item.totalDeals)
            break
          }
        }
        if (!labelCheck) {
          dataSets.push(0)
        }
      }
      graph.datasets[0].data = dataSets
      this.setState({ graph })
    } else {
      graph.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0]
      this.setState({ graph })
    }
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Fetch API's >>>>>>>>>>>>>>>>>>>>>>>>>

  fetchOrganizations = () => {
    const { user } = this.props
    if (user.organizationName && user.organizationName !== '') {
      let organizations = [{ value: user.organizationId, name: user.organizationName }]
      this.setState({
        organizations,
        regionText: organizations[0].name,
        selectedOrganization: user.organizationId,
      })
    } else {
      axios
        .get('/api/user/organizations?limit=2')
        .then((res) => {
          let organizations = []
          res &&
            res.data.rows.length &&
            res.data.rows.map((item, index) => {
              return organizations.push({ value: item.id, name: item.name })
            })
          this.setState({ organizations })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  fetchReport = (url) => {
    this.setState({ loading: true })
    axios
      .get(url)
      .then((res) => {
        let totalLeadsWithCommision = res.data.totalLeadsWithCommision
        this.graphData(res.data)
        this.setState({
          dashBoardData: res.data,
          loading: false,
          viewLoader: false,
          leadsCount:
            totalLeadsWithCommision || totalLeadsWithCommision === 0
              ? '(' + totalLeadsWithCommision + ')'
              : '',
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  fetchRegions = (value) => {
    const { user } = this.props
    let org = this.organizationName(value)
    if (
      user.subRole !== 'regional_head' &&
      user.subRole !== 'zonal_manager' &&
      user.subRole !== 'branch_manager' &&
      user.subRole !== 'business_centre_manager' &&
      user.subRole !== 'call_centre_manager'
    ) {
      axios
        .get(
          `/api/cities/regions?organization=${org.name.toLocaleLowerCase()}&active=true&all=true`
        )
        .then((res) => {
          let regions = []
          res &&
            res.data.items.length &&
            res.data.items.map((item, index) => {
              return regions.push({ value: item.id, name: item.name })
            })
          this.setState({ regions, zones: [], agents: [] })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  fetchZones = (value, check) => {
    const { zoneFormData, agentFormData } = this.state
    const { user } = this.props
    let armsZone = false
    let org = {}

    if (check === 'zone') org = this.organizationName(zoneFormData.organization)
    if (check === 'agent') org = this.organizationName(agentFormData.organization)
    if (org.name === 'Agency21') armsZone = true
    if (
      user.subRole !== 'zonal_manager' &&
      user.subRole !== 'branch_manager' &&
      user.subRole !== 'business_centre_manager' &&
      user.subRole !== 'call_centre_manager'
    ) {
      axios
        .get(`/api/user/teams?status=true&organizationId=${org.value}&all=true&regionId=${value}`)
        .then((res) => {
          let zones = []
          res &&
            res.data.rows.length &&
            res.data.rows.map((item, index) => {
              return zones.push({ value: item.id, name: item.teamName })
            })
          this.setState({ zones, agents: [], zoneFormData })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  fetchAgents = (zone) => {
    axios
      .get(`/api/user/all?searchBy=armsTeamId&q=${zone}&all=true`)
      .then((res) => {
        let agents = []
        res &&
          res.data.rows.length &&
          res.data.rows.map((item, index) => {
            return agents.push({
              value: item.id,
              name: item.firstName + ' ' + item.lastName,
            })
          })
        this.setState({ agents })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Daily >>>>>>>>>>>>>>>>>>>>>>>>>

  updateDay = (day) => {
    const { filterLabel } = this.state
    const { dateString } = day
    if (filterLabel === 'Weekly') {
      this.updateWeekDay(day)
    } else {
      let newDate = moment(dateString).format(_format)
      this.setState(
        {
          selectedDate: newDate,
          showCalendar: false,
        },
        () => {
          this.callReportApi()
        }
      )
    }
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Weekly >>>>>>>>>>>>>>>>>>>>>>>>>

  updateWeekDay = (day) => {
    const { dateString } = day
    let newDate = moment(dateString).format(_format)

    this.setState(
      {
        selectedDate:
          moment(newDate).startOf('isoWeek').format('LL') +
          ' - ' +
          moment(newDate).endOf('isoWeek').format('LL'),
        startWeek: moment(newDate).startOf('isoWeek').format('YYYY-MM-DD'),
        endWeek: moment(newDate).endOf('isoWeek').format('YYYY-MM-DD'),
        showCalendar: false,
      },
      () => {
        this.callReportApi()
      }
    )
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Monthly >>>>>>>>>>>>>>>>>>>>>>>>>

  showPicker = () => {
    const { startYear, endYear, selectedYear, selectedMonth } = this.state
    this.picker
      .show({ startYear, endYear, selectedYear, selectedMonth })
      .then(({ year, month }) => {
        this.setState(
          {
            selectedYear: year,
            selectedMonth: month,
          },
          () => {
            this.checkDate()
          }
        )
      })
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Quarter >>>>>>>>>>>>>>>>>>>>>>>>>

  showQuarterPicker = () => {
    const { startYear, endYear, selectedYear, selectedQuarter } = this.state
    this.quarterPicker
      .show({ startYear, endYear, selectedYear, selectedQuarter })
      .then(({ year, quarter }) => {
        this.setState(
          {
            selectedYear: year,
            selectedQuarter: quarter,
          },
          () => {
            this.checkDate()
          }
        )
      })
  }

  setDefaultQuarter = () => {
    const { selectedQuarter } = this.state
    const date = new Date()
    let newQaurter = selectedQuarter
    if (newQaurter === 0) {
      if (date.getMonth() + 1 > 3 && date.getMonth() + 1 <= 6) return 2
      if (date.getMonth() + 1 > 6 && date.getMonth() + 1 <= 9) return 3
      if (date.getMonth() + 1 > 9 && date.getMonth() + 1 <= 13) return 4
      else return 1
    } else return selectedQuarter
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Yearly >>>>>>>>>>>>>>>>>>>>>>>>>

  showYearPicker = () => {
    const { startYear, endYear, selectedYear } = this.state
    this.yearPicker.show({ startYear, endYear, selectedYear }).then(({ year }) => {
      this.setState(
        {
          selectedYear: year,
        },
        () => {
          this.checkDate()
        }
      )
    })
  }

  // *********************** Agents ******************************

  openAgentFilter = () => {
    this.setState({ showAgentFilter: true })
  }

  handleAgentForm = (value, name) => {
    const { agentFormData } = this.state
    if (name === 'organization') {
      agentFormData.region = ''
      agentFormData.zone = ''
      agentFormData.agent = ''
      this.fetchRegions(value)
    }
    if (name === 'zone') agentFormData.agent = ''
    agentFormData[name] = value
    this.setState({ agentFormData })
  }

  submitAgentFilter = () => {
    const { agentFormData, regions, zones, agents } = this.state
    if (
      !agentFormData.organization ||
      !agentFormData.region ||
      !agentFormData.zone ||
      !agentFormData.agent
    ) {
      this.setState({ checkValidation: true })
    } else {
      let region = _.find(regions, function (item) {
        return item.value === agentFormData.region
      })
      let zone = _.find(zones, function (item) {
        return item.value === agentFormData.zone
      })
      let agent = _.find(agents, function (item) {
        return item.value === agentFormData.agent
      })
      let org = this.organizationName(agentFormData.organization)
      this.setState({
        backCheck: true,
        showAgentFilter: false,
        checkValidation: false,
        regionText: agent.name + ', ' + zone.name + ', ' + region.name + ', ' + org.name,
      })
      this.agentUrl()
    }
  }

  agentUrl = () => {
    let {
      agentFormData,
      filterLabel,
      selectedDate,
      selectedMonth,
      selectedYear,
      quarters,
      startWeek,
      endWeek,
    } = this.state
    let url = ''
    if (filterLabel === 'Monthly') {
      if (selectedMonth.toString().length === 1) selectedMonth = '0' + selectedMonth
      url = `/api/leads/reports?scope=agent&q=${
        agentFormData.agent
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&month=${selectedYear}-${selectedMonth}`
    }
    if (filterLabel === 'Daily')
      url = `/api/leads/reports?scope=agent&q=${
        agentFormData.agent
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedDate}`
    if (filterLabel === 'Yearly')
      url = `/api/leads/reports?scope=agent&q=${
        agentFormData.agent
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&year=${selectedDate}`
    if (filterLabel === 'Weekly')
      url = `/api/leads/reports?scope=agent&q=${
        agentFormData.agent
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${startWeek}&toDate=${endWeek}`
    if (filterLabel === 'Quarterly') {
      let newQaurter = this.setDefaultQuarter()
      let quarter = _.find(quarters, function (item) {
        return item.value === newQaurter
      })
      this.setState({
        selectedDate: quarter.name + ', ' + selectedYear,
        selectedQuarter: newQaurter,
      })
      url = `/api/leads/reports?scope=agent&q=${
        agentFormData.agent
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedYear}-${
        quarter.fromDate
      }&toDate=${selectedYear}-${quarter.toDate}`
    }
    this.fetchReport(url)
  }

  // *********************** Zones ******************************

  openZoneFilter = () => {
    this.setState({ showZoneFilter: true })
  }

  handleZoneForm = (value, name) => {
    const { zoneFormData } = this.state
    zoneFormData[name] = value
    if (name === 'organization') {
      zoneFormData.region = ''
      zoneFormData.zone = ''
      this.fetchRegions(value)
    }
    if (name === 'region') zoneFormData.zone = ''
    this.setState({ zoneFormData })
  }

  submitZoneFilter = () => {
    const { zoneFormData, regions, zones } = this.state
    if (!zoneFormData.organization || !zoneFormData.region || !zoneFormData.zone) {
      this.setState({ checkValidation: true })
    } else {
      let region = _.find(regions, function (item) {
        return item.value === zoneFormData.region
      })
      let zone = _.find(zones, function (item) {
        return item.value === zoneFormData.zone
      })
      let org = this.organizationName(zoneFormData.organization)
      this.setState({
        backCheck: true,
        showZoneFilter: false,
        checkValidation: false,
        regionText: zone.name + ', ' + region.name + ', ' + org.name,
      })
      this.teamUrl()
    }
  }

  teamUrl = () => {
    let {
      zoneFormData,
      filterLabel,
      selectedDate,
      selectedMonth,
      selectedYear,
      quarters,
      startWeek,
      endWeek,
    } = this.state
    let url = ''
    if (filterLabel === 'Monthly') {
      if (selectedMonth.toString().length === 1) selectedMonth = '0' + selectedMonth
      url = `/api/leads/reports?scope=team&q=${
        zoneFormData.zone
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&month=${selectedYear}-${selectedMonth}`
    }
    if (filterLabel === 'Daily')
      url = `/api/leads/reports?scope=team&q=${
        zoneFormData.zone
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedDate}`
    if (filterLabel === 'Yearly')
      url = `/api/leads/reports?scope=team&q=${
        zoneFormData.zone
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&year=${selectedDate}`
    if (filterLabel === 'Weekly')
      url = `/api/leads/reports?scope=team&q=${
        zoneFormData.zone
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${startWeek}&toDate=${endWeek}`
    if (filterLabel === 'Quarterly') {
      let newQaurter = this.setDefaultQuarter()
      let quarter = _.find(quarters, function (item) {
        return item.value === newQaurter
      })
      this.setState({
        selectedDate: quarter.name + ', ' + selectedYear,
        selectedQuarter: newQaurter,
      })
      url = `/api/leads/reports?scope=team&q=${
        zoneFormData.zone
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedYear}-${
        quarter.fromDate
      }&toDate=${selectedYear}-${quarter.toDate}`
    }

    this.fetchReport(url)
  }

  // *********************** Regions ******************************

  openRegionFilter = () => {
    this.setState({ showRegionFilter: true })
  }

  handleRegionForm = (value, name) => {
    const { regionFormData } = this.state
    regionFormData[name] = value
    if (name === 'organization') {
      regionFormData.region = ''
      this.fetchRegions(value)
    }
    this.setState({ regionFormData })
  }

  submitRegionFilter = () => {
    const { regionFormData, regions } = this.state
    if (!regionFormData.organization || !regionFormData.region) {
      this.setState({ checkValidation: true })
    } else {
      let region = _.find(regions, function (item) {
        return item.value === regionFormData.region
      })
      let org = this.organizationName(regionFormData.organization)
      this.setState({
        backCheck: true,
        showRegionFilter: false,
        checkValidation: false,
        regionText: region.name + ', ' + org.name,
      })
      this.regionUrl()
    }
  }

  regionUrl = () => {
    let {
      regionFormData,
      filterLabel,
      selectedDate,
      selectedMonth,
      selectedYear,
      quarters,
      startWeek,
      endWeek,
    } = this.state
    let url = ''
    if (filterLabel === 'Monthly') {
      if (selectedMonth.toString().length === 1) selectedMonth = '0' + selectedMonth
      url = `/api/leads/reports?scope=region&q=${regionFormData.region}&organizationId=${
        regionFormData.organization
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&month=${selectedYear}-${selectedMonth}`
    }
    if (filterLabel === 'Daily')
      url = `/api/leads/reports?scope=region&q=${regionFormData.region}&organizationId=${
        regionFormData.organization
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedDate}`
    if (filterLabel === 'Yearly')
      url = `/api/leads/reports?scope=region&q=${regionFormData.region}&organizationId=${
        regionFormData.organization
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&year=${selectedDate}`
    if (filterLabel === 'Weekly')
      url = `/api/leads/reports?scope=region&q=${regionFormData.region}&organizationId=${
        regionFormData.organization
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${startWeek}&toDate=${endWeek}`
    if (filterLabel === 'Quarterly') {
      let newQaurter = this.setDefaultQuarter()
      let quarter = _.find(quarters, function (item) {
        return item.value === newQaurter
      })
      this.setState({
        selectedDate: quarter.name + ', ' + selectedYear,
        selectedQuarter: newQaurter,
      })
      url = `/api/leads/reports?scope=region&q=${
        regionFormData.region
      }&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedYear}-${
        quarter.fromDate
      }&toDate=${selectedYear}-${quarter.toDate}`
    }

    this.fetchReport(url)
  }

  // *********************** Organization ******************************
  openOrganizationFilter = () => {
    this.setState({ showOrganizationFilter: true })
  }

  organizationName = (value) => {
    return _.find(this.state.organizations, function (item) {
      return item.value === value
    })
  }

  handleOrganizationForm = (value, name) => {
    const { organizationFormData } = this.state
    organizationFormData[name] = value

    this.setState({ organizationFormData })
  }

  submitOrganizationFilter = () => {
    const { organizationFormData } = this.state

    if (!organizationFormData.organization) {
      this.setState({ checkValidation: true })
    } else {
      let value = organizationFormData.organization
      let org = this.organizationName(value)
      this.setState(
        {
          backCheck: true,
          regionText: org.name,
          showOrganizationFilter: false,
          selectedOrganization: value,
        },
        () => {
          this.organizationUrl()
        }
      )
    }
  }

  organizationUrl = () => {
    let {
      selectedOrganization,
      filterLabel,
      selectedDate,
      selectedMonth,
      selectedYear,
      quarters,
      startWeek,
      endWeek,
    } = this.state
    let url = ''
    if (filterLabel === 'Monthly') {
      if (selectedMonth.toString().length === 1) selectedMonth = '0' + selectedMonth
      url = `/api/leads/reports?scope=organization&q=${selectedOrganization}&timePeriod=${filterLabel.toLocaleLowerCase()}&month=${selectedYear}-${selectedMonth}`
    }
    if (filterLabel === 'Daily')
      url = `/api/leads/reports?scope=organization&q=${selectedOrganization}&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedDate}`
    if (filterLabel === 'Yearly')
      url = `/api/leads/reports?scope=organization&q=${selectedOrganization}&timePeriod=${filterLabel.toLocaleLowerCase()}&year=${selectedYear}`
    if (filterLabel === 'Weekly')
      url = `/api/leads/reports?scope=organization&q=${selectedOrganization}&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${startWeek}&toDate=${endWeek}`
    if (filterLabel === 'Quarterly') {
      let newQaurter = this.setDefaultQuarter()
      let quarter = _.find(quarters, function (item) {
        return item.value === newQaurter
      })
      this.setState({
        selectedDate: quarter.name + ', ' + selectedYear,
        selectedQuarter: newQaurter,
      })
      url = `/api/leads/reports?scope=organization&q=${selectedOrganization}&timePeriod=${filterLabel.toLocaleLowerCase()}&fromDate=${selectedYear}-${
        quarter.fromDate
      }&toDate=${selectedYear}-${quarter.toDate}`
    }

    this.fetchReport(url)
  }

  // *********************** Footer Checks ******************************

  selectedFooterButton = (label) => {
    this.setState(
      {
        lastLabel: this.state.footerLabel,
        footerLabel: label,
        backCheck: false,
      },
      () => {
        this.openFilter()
      }
    )
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Date Checks >>>>>>>>>>>>>>>>>>>>>>>>>

  selectedFilterButton = (label) => {
    this.setState({ filterLabel: label }, () => {
      this.checkDate()
    })
  }

  showDate = () => {
    const { filterLabel } = this.state
    if (filterLabel === 'Daily') this._toggleShow()
    if (filterLabel === 'Weekly') this._toggleShow()
    if (filterLabel === 'Monthly') this.showPicker()
    if (filterLabel === 'Quarterly') this.showQuarterPicker()
    if (filterLabel === 'Yearly') this.showYearPicker()
    else {
    }
  }

  defaultDates = () => {
    const date = new Date()
    this.setState(
      {
        selectedQuarter: 0,
        selectedYear: date.getFullYear(),
        selectedMonth: date.getMonth() + 1,
        showCalendar: false,
        fromDate: moment(_today).format(_format),
        toDate: moment(_today).format(_format),
      },
      () => {
        this.checkDate()
      }
    )
  }

  checkDate = () => {
    const {
      filterLabel,
      selectedYear,
      selectedMonth,
      months,
      quarters,
      lastLabel,
      footerLabel,
    } = this.state
    if (filterLabel === 'Daily')
      if (footerLabel === 'Agent' && lastLabel === 'Agent') {
        let date = moment(_today).subtract(1, 'days')
        this.setState({ selectedDate: date.format('LL') }, () => {
          this.callReportApi()
        })
      } else {
        this.setState({ selectedDate: moment(_today).format('LL') }, () => {
          this.callReportApi()
        })
      }
    if (filterLabel === 'Weekly')
      this.setState(
        {
          selectedDate:
            moment(_today).startOf('isoWeek').format('LL') +
            ' - ' +
            moment(_today).endOf('isoWeek').format('LL'),
        },
        () => {
          this.callReportApi()
        }
      )
    if (filterLabel === 'Monthly')
      this.setState({ selectedDate: months[selectedMonth - 1] + ' ' + selectedYear }, () => {
        this.callReportApi()
      })
    if (filterLabel === 'Yearly')
      this.setState({ selectedDate: selectedYear }, () => {
        this.callReportApi()
      })
    if (filterLabel === 'Quarterly') {
      let newQaurter = this.setDefaultQuarter()
      let quarter = _.find(quarters, function (item) {
        return item.value === newQaurter
      })
      this.setState(
        {
          selectedDate: quarter.name + ', ' + selectedYear,
          selectedQuarter: newQaurter,
        },
        () => {
          this.callReportApi()
        }
      )
    }
  }

  _toggleShow = () => {
    this.setState({ showCalendar: !this.state.showCalendar })
  }

  // <<<<<<<<<<<<<<<<<<<<<<< Filter Checks >>>>>>>>>>>>>>>>>>>>>>>>>

  callReportApi = () => {
    const { footerLabel } = this.state
    if (footerLabel === 'Agent') this.agentUrl()
    if (footerLabel === 'Team') this.teamUrl()
    if (footerLabel === 'Region') this.regionUrl()
    if (footerLabel === 'Organization') this.organizationUrl()
  }

  closeFilters = () => {
    const { backCheck, lastLabel, regionText } = this.state

    if (backCheck) {
      this.setState({
        showRegionFilter: false,
        showAgentFilter: false,
        showZoneFilter: false,
        showOrganizationFilter: false,
      })
    } else {
      this.setState(
        {
          showRegionFilter: false,
          showAgentFilter: false,
          showZoneFilter: false,
          regionText: regionText,
          footerLabel: lastLabel,
          showOrganizationFilter: false,
          selectedOrganization: 2,
        },
        () => {
          this.emptyFilters()
          this.callReportApi()
        }
      )
    }
  }

  emptyFilters = () => {
    this.setState({
      regionFormData: { organization: '', region: '' },
      agentFormData: { organization: '', region: '', zone: '', agent: '' },
      zoneFormData: { organization: '', region: '', zone: '' },
      selectedOrganization: 2,
      checkValidation: false,
    })
  }

  openFilter = () => {
    const { footerLabel, showOrganizationFilter } = this.state
    const { user } = this.props
    if (footerLabel === 'Region' && user.role !== 'sub_admin 1') this.openRegionFilter()
    if (footerLabel === 'Agent') this.openAgentFilter()
    if (footerLabel === 'Team') this.openZoneFilter()
    if (footerLabel === 'Organization' && user.role !== 'admin 3' && user.role !== 'sub_admin 1')
      this.setState({ showOrganizationFilter: !showOrganizationFilter })
  }

  updateMonth = () => {}

  render() {
    const {
      leadsCount,
      viewLoader,
      organizationFormData,
      loading,
      graph,
      dashBoardData,
      showOrganizationFilter,
      showCalendar,
      selectedDate,
      agents,
      zones,
      filterLabel,
      footerLabel,
      showRegionFilter,
      showAgentFilter,
      showZoneFilter,
      organizations,
      regionFormData,
      checkValidation,
      regionText,
      regions,
      agentFormData,
      zoneFormData,
      lastLabel,
      showFooter,
    } = this.state
    const width = 500
    const height = 250
    let chartConfig = {
      backgroundColor: 'white',
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      decimalPlaces: 0.1, // optional, defaults to 2dp
      color: (opacity = 1) => `rgb(66, 164, 245, 10)`,
      labelColor: (opacity = 1) => `black`,
      style: {
        backgroundGradientFrom: '#fb8c00',
        borderRadius: 16,
        paddingRight: 20,
        borderWidth: 0,
        borderColor: AppStyles.colors.subTextColor,
      },
      propsForLabels: {
        fontSize: '11',
        // paddingRight: 10,
        // marginRight: 10
      },
      propsForDots: {
        r: '0',
        strokeWidth: '0',
        stroke: '#ffa726',
      },
    }
    const graphStyle = {
      marginVertical: 8,
      ...chartConfig.style,
    }

    return !viewLoader ? (
      <View style={[AppStyles.mb1, { backgroundColor: '#ffffff' }]}>
        <View style={styles.buttonsContainer}>
          <View style={styles.btnView}>
            <ReportFilterButton
              label="Daily"
              selectedFilterButton={this.selectedFilterButton}
              buttonStyle={filterLabel === 'Daily' ? styles.selectedBtn : null}
              textPropStyle={filterLabel === 'Daily' ? { color: '#ffffff' } : null}
            />
            <ReportFilterButton
              label="Weekly"
              selectedFilterButton={this.selectedFilterButton}
              buttonStyle={filterLabel === 'Weekly' ? styles.selectedBtn : null}
              textPropStyle={filterLabel === 'Weekly' ? { color: '#ffffff' } : null}
            />
            <ReportFilterButton
              label="Monthly"
              selectedFilterButton={this.selectedFilterButton}
              buttonStyle={filterLabel === 'Monthly' ? styles.selectedBtn : null}
              textPropStyle={filterLabel === 'Monthly' ? { color: '#ffffff' } : null}
            />
            <ReportFilterButton
              label="Quarterly"
              selectedFilterButton={this.selectedFilterButton}
              buttonStyle={filterLabel === 'Quarterly' ? styles.selectedBtn : null}
              textPropStyle={filterLabel === 'Quarterly' ? { color: '#ffffff' } : null}
            />
            <ReportFilterButton
              label="Yearly"
              selectedFilterButton={this.selectedFilterButton}
              buttonStyle={filterLabel === 'Yearly' ? styles.selectedBtn : null}
              textPropStyle={filterLabel === 'Yearly' ? { color: '#ffffff' } : null}
            />
          </View>
        </View>

        <RegionFilter
          regions={regions}
          checkValidation={checkValidation}
          submitRegionFilter={this.submitRegionFilter}
          handleRegionForm={this.handleRegionForm}
          formData={_.clone(regionFormData)}
          organizations={organizations}
          openPopup={showRegionFilter}
          closeFilters={this.closeFilters}
        />
        <AgentFilter
          agents={agents}
          fetchAgents={this.fetchAgents}
          zones={zones}
          fetchZones={this.fetchZones}
          regions={regions}
          checkValidation={checkValidation}
          submitAgentFilter={this.submitAgentFilter}
          handleAgentForm={this.handleAgentForm}
          formData={_.clone(agentFormData)}
          organizations={organizations}
          openPopup={showAgentFilter}
          closeFilters={this.closeFilters}
        />
        <ZoneFilter
          zones={zones}
          fetchZones={this.fetchZones}
          regions={regions}
          checkValidation={checkValidation}
          submitZoneFilter={this.submitZoneFilter}
          handleZoneForm={this.handleZoneForm}
          formData={_.clone(zoneFormData)}
          organizations={organizations}
          openPopup={showZoneFilter}
          closeFilters={this.closeFilters}
        />
        <OrganizationFilter
          organizations={organizations}
          checkValidation={checkValidation}
          submitOrganizationFilter={this.submitOrganizationFilter}
          handleOrganizationForm={this.handleOrganizationForm}
          formData={_.clone(organizationFormData)}
          openPopup={showOrganizationFilter}
          closeFilters={this.closeFilters}
        />

        <View style={styles.inputView}>
          <View style={styles.regionStyle}>
            <View style={styles.textView}>
              <Text numberOfLines={1} style={styles.textStyle}>
                {regionText}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.inputBtn}
              onPress={() => {
                if (footerLabel !== 'Agent' && lastLabel !== 'Agent') this.openFilter()
              }}
            >
              <Image source={listIconImg} style={styles.regionImg} />
            </TouchableOpacity>
          </View>
          <View style={styles.dateView}>
            <View style={styles.textView}>
              <Text numberOfLines={1} style={styles.textStyle}>
                {selectedDate}
              </Text>
            </View>
            <TouchableOpacity style={styles.inputBtn} onPress={() => this.showDate()}>
              <Image source={calendarImg} style={styles.calendarImg} />
            </TouchableOpacity>
          </View>
        </View>

        <MonthPicker ref={(picker) => (this.picker = picker)} />
        <YearPicker ref={(picker) => (this.yearPicker = picker)} />
        <QuarterPicker ref={(picker) => (this.quarterPicker = picker)} />

        {showCalendar ? (
          <CalendarComponent
            updateMonth={this.updateMonth}
            startDate={selectedDate}
            updateDay={this.updateDay}
            onPress={this._toggleShow}
          />
        ) : null}
        {!loading ? (
          <ScrollView style={styles.scrollContainer}>
            <View style={{}}>
              <RectangleDaily
                label={'Commission Revenue'}
                leadsCount={leadsCount}
                deals={''}
                targetNumber={dashBoardData.totalRevenue}
              />
              <View style={styles.sqaureView}>
                {/* <SquareContainer
                  containerStyle={styles.squareRight}
                  imagePath={comissionRevenueImg}
                  label={"Commission Revenue"}
                  total={dashBoardData.totalRevenue}
                /> */}
              </View>
              <View style={styles.sqaureView}>
                <SquareContainer
                  containerStyle={styles.squareRight}
                  imagePath={leadsAssignedImg}
                  label={'Company Genrated Leads'}
                  total={dashBoardData.totalleadsAssigned}
                />

                <SquareContainer
                  // containerStyle={styles.squareRight}
                  imagePath={leadsCreatedImg}
                  label={'Personal Leads'}
                  total={dashBoardData.totalLeadsAdded}
                />

                {/* <SquareContainer
                  imagePath={clientsAddedImg}
                  label={"Clients Added"}
                  total={dashBoardData.clientsAdded}
                /> */}
              </View>
              <View style={styles.sqaureView}>
                <SquareContainer
                  containerStyle={styles.squareRight}
                  imagePath={viewingConductedImg}
                  label={'Viewings Conducted'}
                  total={dashBoardData.viewingConducted}
                />
                <SquareContainer
                  imagePath={viewingOverdueImg}
                  label={'Viewings Overdue'}
                  total={dashBoardData.viewingOverdue}
                />
              </View>
              <View style={styles.sqaureView}>
                <SquareContainer
                  containerStyle={styles.squareRight}
                  imagePath={LeadClosed}
                  label={'Leads Closed'}
                  total={dashBoardData.viewingConducted}
                />
                <SquareContainer
                  imagePath={offersPlaced}
                  label={'Offers Placed'}
                  total={dashBoardData.leadsOffers}
                />
              </View>
              <View style={styles.sqaureView}>
                <SquareContainer
                  containerStyle={styles.squareRight}
                  imagePath={firstCall}
                  label={'1st Calls'}
                  total={dashBoardData.firstCalls}
                />
                <SquareContainer
                  imagePath={TotalCalls}
                  label={'Total Calls'}
                  total={dashBoardData.totalCalls}
                />
              </View>
              <View style={styles.graphContainer}>
                <Text style={styles.labelStyle}>Total Leads so far</Text>
                <ScrollView horizontal={true}>
                  <BarChart
                    decimalPlaces={0.1}
                    verticalLabelRotation={30}
                    showValuesOnTopOfBars={true}
                    useShadowColorFromDataset={true}
                    withInnerLines={false}
                    withDots={false}
                    fromZero={true}
                    withHorizontalLabels={false}
                    showBarTops={true}
                    width={width}
                    height={height}
                    data={graph}
                    chartConfig={chartConfig}
                    style={graphStyle}
                  />
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        ) : (
          <Loader loading={loading} />
        )}
        {showFooter ? (
          <ReportFooter label={footerLabel} selectedFooterButton={this.selectedFooterButton} />
        ) : null}
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(RCMReport)
