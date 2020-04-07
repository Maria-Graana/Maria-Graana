import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AppStyles from '../../AppStyles';
import styles from './style.js'
import { Button, } from 'native-base';
import { connect } from 'react-redux';
import DateComponent from '../../components/DatePicker'
import { ScrollView } from 'react-native-gesture-handler';


class AddTargets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            formData: {
                date: '',
            }
        }
    }

    componentDidMount() {
    }


    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
    }


    render() {
        const {
            formData,
            checkValidation,
        } = this.state
        return (
            <View style={[AppStyles.container]}>
                <ScrollView>
                    <View style={[styles.targetMain]}>
                        <View style={[styles.formMain]}>
                            {/* **************************************** */}
                            <View style={[AppStyles.mainInputWrap]}>
                                <View style={[AppStyles.inputWrap]}>
                                    <DateComponent date={formData.date} mode='date' placeholder='Select Date' onDateChange={(value) => { this.handleForm(value, 'date') }} />
                                    {
                                        checkValidation === true && formData.date === '' && <ErrorMessage errorMessage={'Required'} />
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={[styles.titleMain]}>
                            <Text style={[styles.labelText]}>YOUR TARGET</Text>
                            <Text style={[styles.priceText]}>1.5 CRORE</Text>
                        </View>

                        <View style={[styles.titleMain]}>
                            <Text style={[styles.labelText]}>TEAM TARGET</Text>
                            <Text style={[styles.priceText]}>5.5 CRORE</Text>
                        </View>

                        {/* **************************************** */}
                        <View style={[AppStyles.mainInputWrap]}>
                            <Button
                                style={[AppStyles.formBtn, styles.addInvenBtn]}>
                                <Text style={AppStyles.btnText}>SET TARGET</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(AddTargets)


