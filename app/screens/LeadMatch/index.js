import * as React from 'react';
import styles from './style'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { CheckBox } from 'native-base';
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import axios from 'axios';
import Loader from '../../components/loader';
import FilterModal from '../../components/FilterModal/index';
import _ from 'underscore';
import helper from '../../helper';
import { setlead } from '../../actions/lead';
import { FAB } from 'react-native-paper';
import StaticData from '../../StaticData';
import { ProgressBar } from 'react-native-paper';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import CMBottomNav from '../../components/CMBottomNav'

class LeadMatch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            organization: 'arms',
            loading: true,
            matchData: {
                data: [],
                type: 'arms'
            },
            checkAllBoolean: false,
            showFilter: false,
            active: false,
            matchesBol: true,
            showCheckBoxes: false,
            armsBol: false,
            graanaBol: false,
            agency21Bol: false,
            armsData: [],
            graanaData: [],
            agency21Data: [],
            selectedCity: {},
            formData: {
                cityId: '',
                areaId: '',
                minPrice: '',
                maxPrice: '',
                bed: '',
                bath: '',
                size: '',
                sizeUnit: '',
                propertySubType: '',
                propertyType: '',
                purpose: '',
                leadAreas: []
            },
            checkCount: {
                'true': 0,
                'false': 0
            },
            selectedProperties: [],
            displayButton: false,
            cities: [],
            areas: [],
            subTypVal: [],
            progressValue: 0,
            filterColor: false,
            maxCheck: false,
            cities: [],
            areas: [],
            // for the lead close dialog
            isVisible: false,
            checkReasonValidation: false,
            selectedReason: '',
            reasons: [],
            closedLeadEdit: this.props.lead.status !== StaticData.Constants.lead_closed_lost && this.props.lead.status !== StaticData.Constants.lead_closed_won,
        }
    }

    componentDidMount() {
        const { lead } = this.props
        this.fetchLead()
        this.props.dispatch(setlead(lead))
    }

    fetchLead = (url) => {
        const { lead } = this.props
        axios.get(`/api/leads/byId?id=${lead.id}`)
            .then((res) => {
                this.props.dispatch(setlead(res.data))
                this.setState({ lead: res.data }, () => this.getCities())
            })
            .catch((error) => {
                console.log(error)
            })
    }

    selectedOrganization = (value) => {
        this.setState({
            organization: value,
            loading: true
        }, () => {
            this.fetchMatches()
        })
    }

    getCities = () => {
        axios.get(`/api/cities`)
            .then((res) => {
                let citiesArray = [];
                res && res.data.map((item, index) => { return (citiesArray.push({ value: item.id, name: item.name, isSelected: false })) })
                this.setState({
                    cities: citiesArray
                }, () => this.resetFilter())
            })
    }

    getAreas = (cityId) => {
        axios.get(`/api/areas?city_id=${cityId}&&all=${true}`)
            .then((res) => {
                let areas = [];
                res && res.data.items.map((item, index) => { return (areas.push({ value: item.id, name: item.name })) })
                this.setState({
                    areas: areas,
                })
            })
    }

    onSliderValueChange = (values) => {
        const { formData } = this.state;
        const prices = formData.purpose === 'rent' ? StaticData.PricesRent : StaticData.PricesBuy
        formData.minPrice = prices[values[0]].toString()
        formData.maxPrice = prices[values[values.length - 1]].toString()
        this.setState({ formData })
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        if (name === 'cityId') {
            this.getAreas(value.value)
            this.filterModalRef.emptyList()
            this.handleCity(value)
            formData.leadAreas = []
            formData[name] = value.value
        }
        this.setState({ formData })
    }

    handleCity = (city) => {
        let { cities, selectedCity } = this.state
        selectedCity = _.find(cities, function (item) { return item.value === city.value })
        let newCities = cities.map((item, index) => {
            if (item.value === city.value) item.isSelected = true
            else item.isSelected = false
            return item
        })
        this.setState({ cities: newCities, selectedCity })
    }

    getSubType = (text) => {
        const { subType } = StaticData
        this.setState({
            subTypVal: subType[text]
        })
    }

    filterModal = () => {
        const { showFilter } = this.state
        this.setState({
            filterColor: false,
            showFilter: !showFilter,
            matchesBol: false,
        })
    }

    submitFilter = () => {
        const { formData } = this.state

        if (formData.maxPrice && formData.maxPrice !== '' && formData.minPrice && formData.minPrice !== '') {
            if (Number(formData.maxPrice) >= Number(formData.minPrice)) {
                this.setState({
                    formData: formData,
                    showFilter: false,
                    loading: true,
                    filterColor: true,
                    maxCheck: false
                }, () => {
                    this.fetchMatches()
                })
            } else {
                this.setState({
                    maxCheck: true
                })
            }
        } else {
            this.setState({
                formData: formData,
                showFilter: false,
                loading: true,
                filterColor: true,
                maxCheck: false
            }, () => {
                this.fetchMatches()
            })
        }
    }

    resetFilter = () => {
        const { lead } = this.state
        let cityId = ''
        let areas = []
        let prices = lead.purpose === 'rent' ? StaticData.PricesRent : StaticData.PricesBuy

        if ('city' in lead && lead.city) {
            cityId = lead.city.id
            this.getAreas(cityId)
            this.handleCity({ value: cityId })
        }

        if ('armsLeadAreas' in lead) {
            if (lead.armsLeadAreas.length) {
                areas = lead.armsLeadAreas.map((area) => {
                    if ('area' in area)
                        return area.area.id
                })
            }
        }
        if (!lead.size_unit) lead.size_unit = 'marla'
        if (lead.type) this.getSubType(lead.type)
        if (lead.min_price) {
            if (!_.contains(prices, Number(lead.min_price))) {
                lead.min_price = 0
            }
        }
        if (lead.price) {
            if (!_.contains(prices, Number(lead.price))) {
                lead.price = StaticData.Constants.any_value
            }
        }
        this.setState({
            formData: {
                cityId: cityId,
                leadAreas: areas,
                minPrice: lead.min_price,
                maxPrice: lead.price,
                bed: lead.bed,
                bath: lead.bath,
                size: lead.size,
                sizeUnit: lead.size_unit,
                propertySubType: lead.subtype,
                propertyType: lead.type,
                purpose: lead.purpose,
            },
            showFilter: false,
            loading: true,
            filterColor: false
        }, () => {
            this.fetchMatches()
        })
    }

    canCallApi = () => {
        const { organization, armsBol, graanaBol, agency21Bol } = this.state

        if (organization === 'arms') {
            if (armsBol) return false
            else return true
        } else if (organization === 'graana') {
            if (graanaBol) return false
            else return true
        } else if (organization === 'agency21') {
            if (agency21Bol) return false
            else return true
        } else {
            return false
        }
    }

    setParams = () => {
        const { organization, formData } = this.state
        const { lead } = this.state

        let params = {
            leadId: lead.id,
            organization: organization,
            type: formData.propertyType,
            subtype: formData.propertySubType,
            area_id: formData.leadAreas,
            purpose: formData.purpose,
            price_min: formData.minPrice,
            price_max: formData.maxPrice,
            city_id: formData.cityId,
            bed: formData.bed,
            bath: formData.bath,
            size: formData.size,
            unit: formData.sizeUnit,
            all: true
        }

        for (let key in params) {
            if (params[key] === "" || !params[key]) {
                delete params[key]
            }
        }
        return params
    }

    fetchMatches = () => {
        const { organization, showCheckBoxes } = this.state
        const { lead } = this.state
        const { rcmProgressBar } = StaticData
        let matches = []

        let params = this.setParams()
        let callApi = this.canCallApi()
        if (callApi || !showCheckBoxes) {
            axios.get(`/api/leads/matches`,
                {
                    params: params
                })
                .then((res) => {
                    matches = helper.propertyCheck(res.data.rows)
                    this.setState({
                        matchData: {
                            type: organization,
                            data: matches
                        },
                        progressValue: rcmProgressBar[lead.status]
                    }, () => {
                        this.loadData()
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            this.handleApiData()
        }
    }

    loadData = () => {
        const { matchData } = this.state
        if (matchData.type === 'arms') { this.setState({ armsData: matchData.data, loading: false, }) }
        else if (matchData.type === 'graana') { this.setState({ graanaData: matchData.data, loading: false, }) }
        else { this.setState({ agency21Data: matchData.data, loading: false, }) }
    }

    changeComBool = () => {
        const { organization, matchData } = this.state

        if (organization === 'arms') { this.setState({ armsData: matchData.data, armsBol: true }) }
        else if (organization === 'graana') { this.setState({ graanaData: matchData.data, graanaBol: true }) }
        else { this.setState({ agency21Data: matchData.data, agency21Bol: true }) }
    }

    handleApiData = () => {
        const { organization, armsData, graanaData, agency21Data } = this.state
        if (organization === 'arms') {
            this.setState({
                matchData: {
                    type: organization,
                    data: armsData
                },
                loading: false
            })
        } else if (organization === 'graana') {
            this.setState({
                matchData: {
                    type: organization,
                    data: graanaData
                },
                loading: false
            })
        } else {
            this.setState({
                matchData: {
                    type: organization,
                    data: agency21Data
                },
                loading: false
            })
        }
    }

    navigateTo = () => {
        const { route } = this.props
        const { client } = route.params
        this.props.navigation.navigate('AddClient', { client: client, update: true })
    }

    ownProperty = (property) => {
        const { user } = this.props
        const { organization } = this.state
        if (property.assigned_to_armsuser_id) {
            return user.id === property.assigned_to_armsuser_id
        }
        else {
            return false
        }
    }

    displayChecks = () => {
        const { showCheckBoxes } = this.state
        const { lead, user } = this.props
        if (lead.status === StaticData.Constants.lead_closed_lost || lead.status === StaticData.Constants.lead_closed_won) {
            helper.leadClosedToast();
        }
        else if (user.id !== lead.assigned_to_armsuser_id) {
            helper.leadNotAssignedToast()
        }
        else {
            if (showCheckBoxes) {
                this.unSelectAll()
            } else {
                this.setState({
                    armsBol: false,
                    graanaBol: false,
                    agency21Bol: false
                })
            }
            this.setState({ showCheckBoxes: !showCheckBoxes })
        }
    }

    addProperty = (property) => {
        const { showCheckBoxes, matchData, selectedProperties, organization } = this.state
        const { lead, user } = this.props
        if (lead.status === StaticData.Constants.lead_closed_lost || lead.status === StaticData.Constants.lead_closed_won) {
            helper.leadClosedToast();
        }
        else if (user.id !== lead.assigned_to_armsuser_id) {
            helper.leadNotAssignedToast()
        }
        else {
            if (showCheckBoxes) {
                if (showCheckBoxes) this.changeComBool()
                let properties = matchData.data.map((item) => {
                    if (item.id === property.id) {
                        item.checkBox = !item.checkBox
                        if (item.checkBox) {
                            this.setState(prevState => ({ selectedProperties: [...prevState.selectedProperties, item] }))
                        } else {
                            let propValues = selectedProperties.filter((value) => {
                                if (value.id === item.id) {
                                    return false
                                } else {
                                    return true
                                }
                            })
                            this.setState(({ selectedProperties: [...propValues] }))
                        }
                        return item
                    }
                    else {
                        return item
                    }
                })
                let checkCount = _.countBy(properties, function (num) { return num.checkBox ? true : false })
                if (checkCount.true) {
                    this.setState({
                        matchData: {
                            type: organization,
                            data: properties
                        },
                        checkCount: checkCount,
                        checkAllBoolean: true,
                        displayButton: true
                    })
                } else {
                    this.setState({
                        matchData: {
                            type: organization,
                            data: properties
                        },
                        checkCount: checkCount,
                        checkAllBoolean: false,
                        displayButton: false
                    })
                }
            }
        }

    }

    unSelectAll = () => {
        const { matchData, checkAllBoolean, showCheckBoxes, organization, selectedProperties } = this.state
        if (showCheckBoxes) {
            let properties = matchData.data.map((item) => {
                item.checkBox = false
                return item
            })
            let checkCount = _.countBy(properties, function (num) { return num.checkBox ? true : false })
            if (checkAllBoolean) {
                this.setState({
                    matchData: {
                        type: organization,
                        data: properties
                    },
                    selectedProperties: [],
                    checkCount: checkCount,
                    checkAllBoolean: false,
                    showCheckBoxes: false,
                    displayButton: false
                })
            }
        }
    }

    closedLead = () => {
        helper.leadClosedToast()
    }

    closeLead = () => {
        const { user, lead } = this.props;
        var commissionPayment = this.props.lead.commissionPayment
        if (user.id === lead.assigned_to_armsuser_id) {
            if (commissionPayment !== null) {
                this.setState({ reasons: StaticData.leadCloseReasonsWithPayment, isVisible: true, checkReasonValidation: '' })
            }
            else {
                this.setState({ reasons: StaticData.leadCloseReasons, isVisible: true, checkReasonValidation: '' })
            }
        }
        else {
            helper.leadNotAssignedToast()
        }

    }

    onHandleCloseLead = () => {
        const { navigation, lead } = this.props
        const { selectedReason } = this.state;
        let payload = Object.create({});
        payload.reasons = selectedReason;
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.setState({ isVisible: false }, () => {
                helper.successToast(`Lead Closed`)
                navigation.navigate('Leads');
            });
        }).catch(error => {
            console.log(error);
        })
    }

    handleReasonChange = (value) => {
        this.setState({ selectedReason: value });
    }


    closeModal = () => {
        this.setState({ isVisible: false })
    }

    sendProperties = () => {
        const { selectedProperties } = this.state
        const { lead } = this.props
        axios.post(`/api/leads/${lead.id}/shortlist`, selectedProperties)
            .then((res) => {
                this.unSelectAll()
                this.props.navigation.navigate('Viewing', { lead: lead })
            })
            .catch((error) => {
                console.log(error)
                helper.errorToast('ERROR: SHORTLISTING PROPERTIES!')
            })
    }

    goToDiaryForm = () => {
        const { navigation, lead, user } = this.props;
        navigation.navigate('AddDiary', {
            update: false,
            rcmLeadId: lead.id,
            agentId: user.id,
            addedBy: 'self'
        });
    }

    goToAttachments = () => {
        const { navigation, lead } = this.props;
        navigation.navigate('Attachments', { rcmLeadId: lead.id });
    }

    goToComments = () => {
        const { navigation, lead } = this.props;
        navigation.navigate('Comments', { rcmLeadId: lead.id });
    }

    navigateToDetails = () => {
        this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'sale' })
    }

    _onStateChange = ({ open }) => this.setState({ open });

    render() {
        const { lead, user } = this.props
        const { selectedCity, visible, subTypVal, areas, cities, maxCheck, filterColor, progressValue, organization, loading, matchData, selectedProperties, checkAllBoolean, showFilter, showCheckBoxes, formData, displayButton, reasons, selectedReason, isVisible, checkReasonValidation, closedLeadEdit } = this.state

        return (
            !loading ?
                <View style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0 }]}>
                    <ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
                    <View style={{ minHeight: '85%' }}>
                        <View style={{ flexDirection: "row", marginLeft: 25 }}>
                            <TouchableOpacity style={{ padding: 10, paddingLeft: 0 }} onPress={() => { this.selectedOrganization('arms') }}>
                                <Text style={[(organization === 'arms') ? styles.tokenLabelBlue : styles.tokenLabel, AppStyles.mrFive]}> ARMS </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 10, paddingLeft: 0 }} onPress={() => { this.selectedOrganization('graana') }}>
                                <Text style={[(organization === 'graana') ? styles.tokenLabelBlue : styles.tokenLabel, AppStyles.mrFive]}> Graana.com </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 10, paddingLeft: 0 }} onPress={() => { this.selectedOrganization('agency21') }}>
                                <Text style={[(organization === 'agency21') ? styles.tokenLabelBlue : styles.tokenLabel, AppStyles.mrFive]}> Agency21 </Text>
                            </TouchableOpacity>
                        </View>
                        <FilterModal
                            onRef={ref => (this.filterModalRef = ref)}
                            selectedCity={selectedCity}
                            onSliderValueChange={this.onSliderValueChange}
                            getAreas={this.getAreas}
                            subTypVal={subTypVal}
                            handleForm={this.handleForm}
                            areas={_.clone(areas)}
                            cities={cities}
                            maxCheck={maxCheck}
                            resetFilter={this.resetFilter}
                            formData={_.clone(formData)}
                            openPopup={showFilter}
                            getSubType={this.getSubType}
                            filterModal={this.filterModal}
                            submitFilter={this.submitFilter} />
                        <View style={[{
                            flexDirection: "row", paddingTop: 10, paddingLeft: 15, paddingBottom: 10, elevation: 10,
                            zIndex: 15,
                            shadowOffset: { width: 5, height: 5 },
                            shadowColor: 'lightgrey',
                            shadowOpacity: 1,
                            backgroundColor: AppStyles.colors.backgroundColor
                        }]}>
                            {
                                selectedProperties.length ?
                                    <View style={{ marginRight: 15, justifyContent: 'center' }}>
                                        <CheckBox onPress={() => { this.unSelectAll() }} color={AppStyles.colors.primaryColor} checked={checkAllBoolean} />
                                    </View>
                                    :
                                    null
                            }
                            <View style={{ justifyContent: 'center', marginRight: 5 }}>
                                <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}>{selectedProperties.length} <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Selected</Text></Text>
                            </View>
                            <View style={{ borderLeftWidth: 1, height: heightPercentageToDP('1.5%'), marginTop: 5, justifyContent: 'center' }} />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}> {matchData.data.length} <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Matched</Text></Text>
                            </View>
                            <View style={{ position: 'absolute', right: 15, alignSelf: 'center' }}>
                                <TouchableOpacity onPress={() => { this.filterModal() }} >
                                    <Image source={require('../../../assets/img/filter.png')} style={{ width: 20, height: 20, tintColor: filterColor ? AppStyles.colors.primaryColor : AppStyles.colors.subTextColor }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            matchData.data.length ?
                                <FlatList
                                    style={{ flex: 1 }}
                                    data={matchData.data}
                                    renderItem={(item, index) => (
                                        <View style={{ marginVertical: 2, marginHorizontal: 8 }}>
                                            {
                                                this.ownProperty(item.item) ?
                                                    <MatchTile
                                                        data={_.clone(item.item)}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={showCheckBoxes}
                                                        addProperty={this.addProperty}
                                                        organization={matchData.type}
                                                    />
                                                    :
                                                    <AgentTile
                                                        data={_.clone(item.item)}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={showCheckBoxes}
                                                        addProperty={this.addProperty}
                                                        organization={matchData.type}
                                                    />
                                            }
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item.id.toString()}
                                />
                                :
                                <Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
                        }
                    </View>
                    {
                        displayButton ?

                            <TouchableOpacity onPress={() => this.sendProperties()}
                                style={{
                                    height: 50,
                                    alignSelf: 'center',
                                    marginBottom: 20,
                                    width: '90%',
                                    opacity: 1,
                                    backgroundColor: AppStyles.colors.primaryColor,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10,
                                    borderRadius: 5,
                                    position: 'absolute',
                                    bottom: 70,
                                }}>
                                <Text style={{ color: 'white' }}> Continue With Selected Properties </Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                    <View style={AppStyles.mainCMBottomNav}>
                        <CMBottomNav
                            goToAttachments={this.goToAttachments}
                            navigateTo={this.navigateToDetails}
                            goToDiaryForm={this.goToDiaryForm}
                            goToComments={this.goToComments}
                            alreadyClosedLead={() => this.closedLead()}
                            closeLead={this.closeLead}
                            closedLeadEdit={closedLeadEdit}
                            callButton={true}
                            customer={lead.customer}
                        />
                    </View>
                    <LeadRCMPaymentPopup
                        reasons={reasons}
                        selectedReason={selectedReason}
                        changeReason={(value) => this.handleReasonChange(value)}
                        checkValidation={checkReasonValidation}
                        isVisible={isVisible}
                        closeModal={() => this.closeModal()}
                        onPress={() => this.onHandleCloseLead()}
                    />

                </View>
                :
                <Loader loading={loading} />

        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        lead: store.lead.lead
    }
}

export default connect(mapStateToProps)(LeadMatch)