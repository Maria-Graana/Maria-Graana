import React, { Component } from 'react';
import { View, Text, ScrollView, AccessibilityInfo } from 'react-native';
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
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            loading: false,
            data: {},
            formData: {
                date: moment().format('YYYY-MM-DD'),
            }
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const { date } = this.state.formData;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.getMyTarget(date);
        });
    }

    getMyTarget = (date) => {
        this.setState({ loading: true })
        axios.get(`/api/user/mytarget?date=${date}`).then(response => {
            if (response.status === 200 && response.data) {
                this.setState({ data: response.data, loading: false });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })

        if (formData.date !== '' && name === 'date') { this.getMyTarget(value) }
    }

    navigateFunction = (name) => {
        const { navigation } = this.props
        const { formData } = this.state;
        const { date } = formData;
        navigation.navigate(name, { date: date })
    }



    render() {
        const {
            formData,
            checkValidation,
            loading,
            data
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
                                        <MonthPicker date={formData.date} mode='date' placeholder='Select Date' onDateChange={(value) => { this.handleForm(value, 'date') }} />
                                        {
                                            checkValidation === true && formData.date === '' && <ErrorMessage errorMessage={'Required'} />
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.titleMain]}>
                                <Text style={[styles.labelText]}>YOUR TARGET</Text>
                                <Text style={[styles.priceText]}>{data.armsUserTarget != null && formatPrice(data.armsUserTarget.targetAmount)}</Text>
                            </View>

                            <View style={[styles.titleMain]}>
                                <Text style={[styles.labelText]}>TEAM TARGET</Text>
                                <Text style={[styles.priceText]}>{data.teamTarget && data.teamTarget.teamTarget!==null && formatPrice(data.teamTarget.teamTarget)}</Text>
                            </View>

                            {
                                Ability.canAdd(user.role, route.params.screen) && Ability.canView(user.role, route.params.screen) ?
                                    < View style={[AppStyles.mainInputWrap]}>
                                        <Button
                                            style={[AppStyles.formBtn, styles.addInvenBtn]}
                                            onPress={() => { this.navigateFunction('TeamTargets') }}
                                        >
                                            <Text style={AppStyles.btnText}>SET TARGET</Text>
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


