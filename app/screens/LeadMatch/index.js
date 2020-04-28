import * as React from 'react';
import styles from './style'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import Ability from '../../hoc/Ability';
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
import { ProgressBar, Colors } from 'react-native-paper';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

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
            user: null,
            matchesBol: true,
            showCheckBoxes: false,
            armsBol: false,
            graanaBol: false,
            agency21Bol: false,
            armsData: [],
            graanaData: [],
            agency21Data: [],
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
            maxCheck: false
        }
    }

    componentDidMount() {
        const { lead } = this.props.route.params
        this.props.dispatch(setlead(lead))
        this.resetFilter()
    }

    selectedOrganization = (value) => {
        this.setState({
            organization: value,
            loading: true
        }, () => {
            this.fetchMatches()
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

    submitFilter = (formData) => {
        if (formData.maxPrice && formData.maxPrice !== '') {
            if (Number(formData.maxPrice) > Number(formData.minPrice)) {
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
                maxCheck: true
            })
        }
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

    resetFilter = () => {
        const { lead } = this.props
        let cityId = ''
        let areaId = ''
        let areas = []
        if ('city' in lead && lead.city) {
            cityId = lead.city.id
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

    fetchMatches = () => {
        const { organization, formData, showCheckBoxes } = this.state
        const { route } = this.props
        const { lead } = route.params
        const { rcmProgressBar } = StaticData

        const params = {
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
            unit: formData.sizeUnit
        }

        let callApi = this.canCallApi()
        let matches = []
        if (callApi || !showCheckBoxes) {
            axios.get(`/api/leads/matches`,
                {
                    params: params
                })
                .then((res) => {
                    res.data.rows.map((item, index) => {
                        if ('armsuser' in item) {
                            item.user = item.armsuser
                            item.checkBox = false
                            return (matches.push(item))
                        } else {
                            item.checkBox = false
                            return (matches.push(item))
                        }
                    })
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
        const { organization, matchData } = this.state
        if (matchData.type === 'arms') { this.setState({ armsData: matchData.data, loading: false, }) }
        else if (matchData.type === 'graana') { this.setState({ graanaData: matchData.data, loading: false, }) }
        else { this.setState({ agency21Data: matchData.data, loading: false, }) }
    }

    changeComBool = () => {
        const { organization, matchData, armsBol, graanaBol, agency21Bol } = this.state

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

    addProperty = (property) => {
        const { showCheckBoxes, matchData, selectedProperties, organization } = this.state
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

    sendProperties = () => {
        const { selectedProperties } = this.state
        const { lead } = this.props.route.params
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
        const { navigation, route, user } = this.props;
        const { lead } = route.params;
        navigation.navigate('AddDiary', {
            update: false,
            rcmLeadId: lead.id,
            agentId: user.id
        });
    }

    goToAttachments = () => {
        const { navigation, route } = this.props;
        const { lead } = route.params;
        navigation.navigate('Attachments', { rcmLeadId: lead.id });
    }

    goToComments = () => {
        const { navigation, route } = this.props;
        const { lead } = route.params;
        navigation.navigate('Comments', { rcmLeadId: lead.id });
    }

    _onStateChange = ({ open }) => this.setState({ open });

    render() {
        // const { user } = this.props
        const { maxCheck, filterColor, progressValue, organization, loading, matchData, selectedProperties, checkAllBoolean, showFilter, user, showCheckBoxes, formData, displayButton, open } = this.state

        return (
            !loading ?
                <View style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0 }]}>
                    <ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
                    <View style={{ flex: 1 }}>
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
                        <FilterModal maxCheck={maxCheck} resetFilter={this.resetFilter} formData={formData} openPopup={showFilter} filterModal={this.filterModal} submitFilter={this.submitFilter} />
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
                                                        data={item.item}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={showCheckBoxes}
                                                        addProperty={this.addProperty}
                                                        organization={matchData.type}
                                                    />
                                                    :
                                                    <AgentTile
                                                        data={item.item}
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
                                    height: 50, alignSelf: 'center', marginBottom: 20, width: '90%',
                                    opacity: 0.9,
                                    backgroundColor: AppStyles.colors.primaryColor,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10,
                                    borderRadius: 5
                                }}>
                                <Text style={{ color: 'white' }}> Continue With Selected Properties </Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                    <FAB.Group
                        open={open}
                        icon="plus"
                        style={{ marginBottom: displayButton ? 70 : 0 }}
                        fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
                        color={AppStyles.bgcWhite.backgroundColor}
                        actions={[
                            { icon: 'plus', label: 'Comment', color: AppStyles.colors.primaryColor, onPress: () => this.goToComments() },
                            { icon: 'plus', label: 'Attachment', color: AppStyles.colors.primaryColor, onPress: () => this.goToAttachments() },
                            { icon: 'plus', label: 'Diary Task ', color: AppStyles.colors.primaryColor, onPress: () => this.goToDiaryForm() },
                        ]}
                        onStateChange={({ open }) => this.setState({ open })}
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