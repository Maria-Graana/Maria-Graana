import * as React from 'react';
import styles from './style'
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { AntDesign } from '@expo/vector-icons';
import Ability from '../../hoc/Ability';
import { CheckBox } from 'native-base';
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import StaticData from '../../StaticData';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import Loader from '../../components/loader'
import FilterModal from '../../components/FilterModal/index'
 
class LeadMatch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            organization: 'arms',
            loading: true,
            matchData: [],
            checkBoolean: true,
            showFilter: false,
            formData: {
                city: '',
                area: ''
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
        const {showFilter}= this.state
        this.setState({
            showFilter: !showFilter
        })
    }

    handleForm = (value, name) => {
        console.log(value, name)
        // const { formData } = this.state
        // formData[name] = value
        // this.setState({ formData })
        // if (formData.type != '') { this.selectSubtype(formData.type) }
        // if (formData.city_id != '') { this.getAreas(formData.city_id) }
    }

    fetchMatches = () => {
        const { organization } = this.state
        const { route } = this.props
        const { lead } = route.params
        axios.get(`/api/leads/matches?leadId=${lead.id}&organization=${organization}`)
            .then((res) => {
                this.setState({
                    matchData: res.data.rows,
                    loading: false
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

        if (organization === 'arms') return user.id === property.armsuser.id
        if (organization === 'graana') return user.id === property.user.id
        if (organization === 'aragency21ms') return user.id === property.armsuser.id
    }

    render() {
        const { route, user } = this.props
        const { organization, loading, matchData, checkBoolean, showFilter } = this.state
        const teamDiary = StaticData.teamDiaryRows

        return (
            !loading ?
                <View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                    {
                        matchData.length ?
                            <View>
                                <View style={{ flexDirection: "row" }}>
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
                                <FilterModal handleForm= {this.handleForm} openPopup={showFilter} filterModal={this.filterModal}/>
                                <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                    <View style={{ marginRight: 15 }}>
                                        <CheckBox color={AppStyles.colors.primaryColor} checked={checkBoolean} />
                                    </View>
                                    <View style={{ marginRight: 5 }}>
                                        <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}>3 <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Selected</Text></Text>
                                    </View>
                                    <View style={{ borderLeftWidth: 1, height: 15, marginTop: 5 }} />
                                    <View style={{ marginRight: 5 }}>
                                        <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}> {matchData.length} <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>Matched</Text></Text>
                                    </View>
                                    <View style={{ marginLeft: 175 }}>
                                        <AntDesign onPress={() => {this.filterModal()}} name="filter" size={25} color={AppStyles.colors.primaryColor} />
                                    </View>
                                </View>

                                <FlatList
                                    data={matchData}
                                    renderItem={(item, index) => (
                                        <View>
                                            {
                                                this.ownProperty(item.item) ?
                                                    <MatchTile />
                                                    :
                                                    <AgentTile data={item.item} />
                                            }
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item.id.toString()}
                                />
                            </View>
                            :
                            <Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
                    }
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