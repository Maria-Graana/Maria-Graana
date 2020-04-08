import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import AppStyles from '../../AppStyles';
import styles from './style.js'
import { Button, } from 'native-base';
import TargetTile from '../../components/TargetTile'
import { connect } from 'react-redux';
import DateComponent from '../../components/DatePicker'
import { ScrollView } from 'react-native-gesture-handler';


class Targets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            formData: {
                date: '',
            },
            dropDown: false,
            dropDownId: '',
        }
    }

    componentDidMount() {
    }


    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
    }

    dropDown = (id) => {
        this.setState({
            dropDown: !this.state.dropDown,
            dropDownId: id,
        })
    }

    render() {
        const {
            formData,
            checkValidation,
            dropDown,
            dropDownId,
        } = this.state
        return (
            <View style={[AppStyles.container, styles.bgcWhite]}>
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
                </View>
                <View style={styles.scrollViewHeight}>
                    <ScrollView style={styles.scrollViewHeight}>

                        {/* *********************Main Tile */}
                        <TargetTile dropDownFunction={this.dropDown} id={'1'} dropDown={dropDown} dropDownId={dropDownId} />
                        <TargetTile dropDownFunction={this.dropDown} id={'2'} dropDown={dropDown} dropDownId={dropDownId} />
                        <TargetTile dropDownFunction={this.dropDown} id={'3'} dropDown={dropDown} dropDownId={dropDownId} />
                        <TargetTile dropDownFunction={this.dropDown} id={'4'} dropDown={dropDown} dropDownId={dropDownId} />
                        <TargetTile dropDownFunction={this.dropDown} id={'5'} dropDown={dropDown} dropDownId={dropDownId} />
                        <TargetTile dropDownFunction={this.dropDown} id={'6'} dropDown={dropDown} dropDownId={dropDownId} />

                    </ScrollView>
                </View>
                <View style={[styles.titleMain]}>
                    <Text style={[styles.labelText]}>TOTAL TEAM TARGET</Text>
                    <Text style={[styles.priceText]}>5.5 CRORE</Text>
                </View>
            </View>
        )
    }
}


mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(Targets)


