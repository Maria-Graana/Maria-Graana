import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Picker } from 'react-native';
import AppStyles from '../../AppStyles';
import styles from './style.js'
import { Button, } from 'native-base';
import { connect } from 'react-redux';
import MonthPicker from '../../components/MonthPicker'
import Loader from '../../components/loader'
import axios from 'axios'
import moment from 'moment';
import { formatPrice } from '../../components/PriceFormate'
import Ability from '../../hoc/Ability'


class Targets extends Component {
    months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            loading: false,
            data: {},
            startYear: 2000,
            endYear: 2050,
            selectedYear: 2020,
            selectedMonth: 1,
        }
    }

    componentDidMount() {
     const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.getMyTarget();
        });
    }

    getMyTarget = () => {
        const { selectedMonth, selectedYear } = this.state;
        let date = `${selectedYear}-${moment().month(selectedMonth-1).format('MM')}-${moment().format('D')}`;
        this.setState({ loading: true })
        axios.get(`/api/user/mytarget?date=${date}`).then(response => {
            if (response.status === 200 && response.data) {
                this.setState({ data: response.data, loading: false });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    navigateFunction = (name) => {
        const { navigation } = this.props
        navigation.navigate(name)
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
                    this.getMyTarget();
                })
            })
    }


    render() {
        const {
            loading,
            data,
            selectedYear,
            selectedMonth
        } = this.state
        const { user, route } = this.props;
        return (
            !loading ?
                <View style={[AppStyles.container]}>
                    <ScrollView>
                        <View style={[styles.targetMain]}>
                            <View style={[styles.formMain]}>
                                {/* **************************************** */}
                                <View style={[AppStyles.mainInputWrap]}>
                                    <View style={[AppStyles.inputWrap]}>
                                        <TouchableOpacity onPress={() => this.showPicker()} style={styles.input}>
                                            <Image style={{ width: 26, height: 26 }} source={require('../../../assets/img/calendar.png')} />
                                            <Text style={styles.inputText}>
                                                {this.months[selectedMonth - 1]} {selectedYear}
                                            </Text>
                                        </TouchableOpacity>
                                        <MonthPicker ref={(picker) => this.picker = picker} />
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.titleMain]}>
                                <Text style={[styles.labelText]}>YOUR TARGET</Text>
                                <Text style={[styles.priceText]}>{data.armsUserTarget != null && formatPrice(data.armsUserTarget.targetAmount)}</Text>
                            </View>

                            <View style={[styles.titleMain]}>
                                <Text style={[styles.labelText]}>TEAM TARGET</Text>
                                <Text style={[styles.priceText]}>{data.teamTarget && data.teamTarget.teamTarget !== null && formatPrice(data.teamTarget.teamTarget)}</Text>
                            </View>

                            {
                                Ability.canAdd(user.role, route.params.screen) && Ability.canView(user.role, route.params.screen) ?
                                    < View style={[AppStyles.mainInputWrap]}>
                                        <Button
                                            style={[AppStyles.formBtn, styles.addInvenBtn]}
                                            onPress={() => { this.navigateFunction('TeamTargets') }}
                                        >
                                            <Text style={AppStyles.btnText}>SET TARGETS</Text>
                                        </Button>
                                    </View>
                                    : null

                            }

                        </View>
                    </ScrollView>
                </View >
                : <Loader loading={loading} />
        )
    }
}




mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(Targets)


