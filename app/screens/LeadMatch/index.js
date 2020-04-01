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

class LeadMatch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            organization: 'arms',
            loading: true,
            matchData: [],
            checkBoolean: false,
            showFilter: false,
            active: false,
            user: null,
            matchesBol: true,
            showCheckBoxes: false,
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
            }
        }
    }

    componentDidMount() {
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

    fetchMatches = () => {
        const { organization, matchesBol, formData } = this.state
        const { route } = this.props
        const { lead } = route.params
        let matches = []

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
                    matchData: matches,
                    loading: false,
                    // matchesBol: true
                })
            })
            .catch((error) => {
                console.log(error)
            })
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

        }
        this.setState({ showCheckBoxes: !showCheckBoxes })
    }

    addProperty = (property) => {
        const { showCheckBoxes, matchData } = this.state
        if (showCheckBoxes) {
            let properties = matchData.map((item) => {
                if (item.id === property.id) {
                    item.checkBox = !item.checkBox
                    return item
                }
                else {
                    return item
                }
            })
            let checkCount = _.countBy(properties, function (num) { return num.checkBox ? true : false })
            this.setState({
                matchData: properties,
                checkCount: checkCount
            })
        }
    }

    selectAll = () => {
        const { matchData, checkBoolean, showCheckBoxes } = this.state
        let properties = matchData.map((item) => {
            if (checkBoolean) {
                item.checkBox = false
                return item
            } else {
                item.checkBox = true
                return item
            }
        })
        let checkCount = _.countBy(properties, function (num) { return num.checkBox ? true : false })
        this.setState({
            matchData: properties,
            checkCount: checkCount,
            showCheckBoxes: !showCheckBoxes,
            checkBoolean: !checkBoolean
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
        const { organization, loading, matchData, checkBoolean, showFilter, user, showCheckBoxes, checkCount, formData, active } = this.state

        return (
            !loading ?
                <View style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor,paddingLeft:0,paddingRight:0}]}>
                    <View style={{ opacity: active ? 0.3 : 1, flex:1}}>
                        <View style={{ flexDirection: "row", marginLeft: 25 }}>
                            <TouchableOpacity style={{ padding: 10, paddingLeft: 0 }} onPress={() => { this.selectedOrganization('arms') }}>
                                <Text style={[(organization === 'arms') ? styles.tokenLabelBlue : styles.tokenLabel, AppStyles.mrFive]}> ARMS </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 10, paddingLeft: 0, justifyContent: "center", alignSelf: "center", alignItems: "center" }} onPress={() => { this.selectedOrganization('graana') }}>
                                <Text style={[(organization === 'graana') ? styles.tokenLabelBlue : styles.tokenLabel, AppStyles.mrFive]}> Graana.com </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 10, paddingLeft: 0 }} onPress={() => { this.selectedOrganization('agency21') }}>
                                <Text style={[(organization === 'agency21') ? styles.tokenLabelBlue : styles.tokenLabel, AppStyles.mrFive]}> Agency21 </Text>
                            </TouchableOpacity>
                        </View>
                        <FilterModal formData={formData} handleForm={this.handleForm} openPopup={showFilter} filterModal={this.filterModal} />
                        <View style={{ flexDirection: "row", paddingTop: 5, paddingLeft: 15 }}>
                            <View style={{ marginRight: 15 }}>
                                <CheckBox onPress={() => { this.selectAll() }} color={AppStyles.colors.primaryColor} checked={checkBoolean} />
                            </View>
                            <View style={{ marginRight: 5 }}>
                                <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}>{checkCount.true ? checkCount.true : 0} <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Selected</Text></Text>
                            </View>
                            <View style={{ borderLeftWidth: 1, height: 15, marginTop: 5 }} />
                            <View style={{ marginRight: 5 }}>
                                <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}> {matchData.length} <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Matched</Text></Text>
                            </View>
                            <View style={{ marginLeft: 155 }}>
                                <AntDesign onPress={() => { this.filterModal() }} name="filter" size={25} color={AppStyles.colors.subTextColor} />
                            </View>
                        </View>
                        {
                            matchData.length ?
                                <FlatList
                                    data={matchData}
                                    renderItem={(item, index) => (
                                        <View style={{paddingLeft:15,paddingRight:15}}>
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
        user: store.user.user
    }
}

export default connect(mapStateToProps)(LeadMatch)