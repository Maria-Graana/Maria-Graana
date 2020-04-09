import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AppStyles from '../../AppStyles';
import styles from './style.js'
import { Button, } from 'native-base';
import TargetTile from '../../components/TargetTile'
import { connect } from 'react-redux';
import MonthPicker from '../../components/MonthPicker'
import NoResultsComponent from '../../components/NoResultsComponent';
import { formatPrice } from '../../PriceFormate'
import Loader from '../../components/loader'
import axios from 'axios'
import moment from 'moment'


class TeamTargets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            rows: [],
            loading: false,
            formData: {
                date: '',
                targetAmount: ''
            },
            dropDown: false,
            armsUserId: '',

        }
    }

    componentDidMount() {
        const { navigation, route } = this.props;
        const { date } = route.params;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.getTeamTargets(date);
        });
        this.setState({ formData: { date: date } })
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })

        if (formData.date !== '' && name === 'date') { this.getTeamTargets(value) }
    }

    dropDown = (id) => {
        this.setState({
            dropDown: !this.state.dropDown,
            armsUserId: id,
        })
    }

    getTeamTargets = (date) => {
        this.setState({ loading: true })
        axios.get(`/api/user/agents?target=true&date=${date}`).then(response => {
            if (response.data && response.status === 200) {
                this.setState({ rows: response.data, loading: false });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    setIndividualTarget = (targetId) => {
        if (targetId !== null) {
            // update target id
            this.updateTarget(targetId);

        }
        else {
            this.createTarget();
        }
    }

    updateTarget = (targetId) => {
        const { formData } = this.state;
        const { targetAmount, date } = formData;
        if (targetAmount === '' || targetAmount === undefined) {
            Alert.alert('Enter Target', 'Target amount cannot be empty !');
            return;
        }

        let body = {
            targetMonth: date,
            targetAmount: this.convertToInteger(targetAmount)
        }

        axios.patch(`/api/user/editTarget?id=${targetId}`, body).then(response => {
            if (response.status === 200) {
                this.setState({ dropDown: !this.state.dropDown, })
                this.getTeamTargets(date);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    createTarget = () => {
        const { armsUserId } = this.state;
        const { targetAmount, date } = this.state.formData;
        const body = {
            targetMonth: date,
            armsUserId: armsUserId,
            targetAmount: targetAmount
        }
        axios.post(`api/user/setTarget`, body).then(response => {
            this.setState({ dropDown: !this.state.dropDown, })
            this.getTeamTargets(date);
        }).catch(error => {
            console.log(error);
        })

    }

    onPress = (targetId) => {
        this.setIndividualTarget(targetId);
    }

    convertToInteger = (val) => {
        if (val === '') {
            return null;
        }
        else if (typeof (val) === 'string' && val != '') {
            return parseInt(val);
        }
    }

    render() {
        const {
            formData,
            checkValidation,
            dropDown,
            armsUserId,
            rows,
            loading
        } = this.state
        return (
            !loading ?
                <View style={[AppStyles.container, styles.bgcWhite, { paddingLeft: 0, paddingRight: 0 }]}>
                    <View style={[styles.targetMain]}>
                        <View style={[styles.formMain, { marginLeft: 15, marginRight: 15 }]}>
                            {/* **************************************** */}
                            <View style={[AppStyles.mainInputWrap]}>
                                <View style={[AppStyles.inputWrap]}>
                                    <MonthPicker date={formData.date} mode='date' placeholder='Select Date' onDateChange={(value) => { this.handleForm(value, 'date') }} />
                                    {
                                        checkValidation === true && formData.date === '' && <ErrorMessage errorMessage={'Required'} />
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    <FlatList contentContainerStyle={{ flexGrow: 1 }}
                        data={rows.agents}
                        renderItem={({ item }) => (
                            <TargetTile
                                data={item}
                                dropDownFunction={this.dropDown}
                                onPress={this.onPress}
                                id={String(item.id)}
                                dropDown={dropDown}
                                armsUserId={armsUserId}
                                handleForm={this.handleForm}
                            />
                        )}
                        keyExtractor={item => String(item.id)} />
                    <View style={[styles.titleMain]}>
                        <Text style={[styles.labelText]}>TOTAL TEAM TARGET</Text>
                        <Text style={[styles.priceText]}>{formatPrice(rows.teamTarget)}</Text>
                    </View>
                </View>
                :
                <Loader loading={loading} />
        )
    }
}


mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(TeamTargets)


