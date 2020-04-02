import * as React from 'react';
import styles from './style'
import { View, Text, FlatList, Image, RefreshControlBase } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import Ability from '../../hoc/Ability';
import { CheckBox } from 'native-base';
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import { Fab, Button, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import Loader from '../../components/loader';
import FilterModal from '../../components/FilterModal/index';
import _ from 'underscore';
import helper from '../../helper';
import { setlead } from '../../actions/lead';

class LeadMatch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            organization: 'arms',
            loading: true,
            matchData: [],
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
                city: '',
                area: '',
                minPrice: '',
                maxPrice: '',
                bed: '',
                bath: '',
                size: '',
                sizeUnit: '',
                properySubType: '',
                propertyType: '',
            },
            checkCount: {
                'true': 0,
                'false': 0
            },
            selectedProperties: [],
            displayButton: false
        }
    }

    componentDidMount() {
        const{lead}= this.props.route.params
        this.props.dispatch(setlead(lead))
        this.fetchMatches()
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
            showFilter: !showFilter,
            matchesBol: false
        }, () => {
            this.fetchMatches()
        })
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
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

    fetchMatches = () => {
        const { organization, matchesBol, formData, showCheckBoxes } = this.state
        const { route } = this.props
        const { lead } = route.params
        let callApi = this.canCallApi()
        let matches = []
        
        if (callApi || !showCheckBoxes) {
            axios.get(`/api/leads/matches?leadId=${lead.id}&organization=${organization}&matches=${matchesBol}&type=${formData.propertyType}&subtype=${formData.properySubType}&area_id=${formData.area}`)
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
                        loading: false,
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
        if (matchData.type === 'arms') { this.setState({ armsData: matchData.data }) }
        else if (matchData.type === 'graana') { this.setState({ graanaData: matchData.data }) }
        else { this.setState({ agency21Data: matchData.data }) }
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

        if (organization === 'arms' && 'armsuser' in property && property.armsuser) {
            return user.id === property.armsuser.id
        }
        else if (organization === 'graana' && 'user' in property && property.user) {
            return user.id === property.user.id
        }
        else if (organization === 'aragency21' && 'user' in property && property.user) {
            return user.id === property.user.id
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
                        let propValues= selectedProperties.filter((value)=> {
                            if (value.id === item.id) {
                                return false
                            } else {
                                return true
                            }
                        })
                        this.setState(({ selectedProperties: [...propValues]}))
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
                    showCheckBoxes: false,
                    checkAllBoolean: false,
                    showCheckBoxes: false,
                    displayButton: false
                })
            }
        }
    }

    sendProperties = () => {
        const {selectedProperties}= this.state
        const {lead}= this.props.route.params
        axios.post(`/api/leads/${lead.id}/shortlist`, selectedProperties)
        .then ((res) => {
            helper.successToast('PROPERTIES SAVED!')
            this.unSelectAll()
            this.props.navigation.navigate('Viewing',{ lead: lead })
        })
        .catch((error) => {
            console.log(error)
            helper.errorToast('ERROR: SAVING PROPERTIES!')
        })
    }

    goToDiaryForm = () => {
        const { navigation, route } = this.props;
        const { lead } = route.params;
        navigation.navigate('AddDiary', {
            update: false,
            leadId: lead.id
        });
    }

    goToAttachments() {
        const { navigation } = this.props;
        navigation.navigate('Attachments');
    }

    goToComments() {
        const { navigation } = this.props;
        navigation.navigate('Comments');
    }

    render() {
        // const { user } = this.props
        const { organization, loading, matchData, selectedProperties, checkAllBoolean, showFilter, user, showCheckBoxes, checkCount, formData, displayButton } = this.state

        return (
            !loading ?
                <View style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0 }]}>
                    <View style={{ opacity: active ? 0.3 : 1, flex: 1 }}>
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
                        <FilterModal formData={formData} handleForm={this.handleForm} openPopup={showFilter} filterModal={this.filterModal} />
                        <View style={{ flexDirection: "row", paddingTop: 5, paddingLeft: 15 }}>
                            <View style={{ marginRight: 15 }}>
                                <CheckBox onPress={() => { this.unSelectAll() }} color={AppStyles.colors.primaryColor} checked={checkAllBoolean} />
                            </View>
                            <View style={{ marginRight: 5 }}>
                                <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}>{selectedProperties.length} <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Selected</Text></Text>
                            </View>
                            <View style={{ borderLeftWidth: 1, height: 15, marginTop: 5 }} />
                            <View style={{ marginRight: 5 }}>
                                <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}> {matchData.data.length} <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Matched</Text></Text>
                            </View>
                            <View style={{ marginLeft: 155 }}>
                                <AntDesign onPress={() => { this.filterModal() }} name="filter" size={25} color={AppStyles.colors.subTextColor} />
                            </View>
                        </View>
                        {
                            matchData.data.length ?
                                <FlatList
                                    data={matchData.data}
                                    renderItem={(item, index) => (
                                        <View style={{marginVertical: 10}}>
                                            {
                                                this.ownProperty(item.item) ?
                                                    <MatchTile
                                                        data={item.item}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={showCheckBoxes}
                                                        addProperty={this.addProperty}
                                                    />
                                                    :
                                                    <AgentTile
                                                        data={item.item}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={showCheckBoxes}
                                                        addProperty={this.addProperty}
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
                            <View style={{ position: "absolute", left: 0, marginLeft: 15, bottom: 0, zIndex: 20, height: 50, width: '100%' }}>
                                <TouchableOpacity 
                                onPress={() => this.sendProperties()}
                                style={{ opacity: 0.9, backgroundColor: AppStyles.colors.primaryColor, justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 5 }}>
                                    <Text style={{ color: 'white' }}> Continue With Selected Properties </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            null
                    }
                    <Fab
                        active={active}
                        direction="up"
                        style={{ backgroundColor: AppStyles.colors.primaryColor, elevation: active ? 10 : 0 }}
                        position="bottomRight"
                        onPress={() => this.setState({ active: !active })}>
                        <Ionicons name="md-add" color="#ffffff" />
                        <Button style={{ backgroundColor: AppStyles.colors.primary }} activeOpacity={1} onPress={() => { this.goToDiaryForm() }}>
                            <Icon name="md-calendar" size={20} color={'#fff'} />
                        </Button>
                        <Button style={{ backgroundColor: AppStyles.colors.primary }} onPress={() => { this.goToAttachments() }}>
                            <Icon name="md-attach" />
                        </Button>
                        <Button style={{ backgroundColor: AppStyles.colors.primary }} onPress={() => { this.goToComments() }}>
                            <FontAwesome name="comment" size={20} color={'#fff'} />
                        </Button>
                    </Fab>
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