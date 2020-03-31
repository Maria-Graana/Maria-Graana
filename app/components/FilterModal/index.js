import React from 'react'
import {
    View,
    Modal,
    SafeAreaView,
    Text,
    TextInput
} from 'react-native'
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import PickerComponent from '../Picker/index';
import axios from 'axios';
import { Button } from 'native-base';

class FilterModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cities: [],
            areas: []
        }
    }

    componentDidMount() {
        this.getCities()
    }

    getCities = () => {
        axios.get(`/api/cities`)
            .then((res) => {
                let citiesArray = [];
                res && res.data.map((item, index) => { return (citiesArray.push({ value: item.id, name: item.name })) })
                this.setState({
                    cities: citiesArray
                })
            })
    }

    getAreas = (cityId) => {
        console.log(cityId)
        axios.get(`/api/areas?city_id=${cityId}&&all=${true}`)
            .then((res) => {
                let areas = [];
                res && res.data.items.map((item, index) => { return (areas.push({ value: item.id, name: item.name })) })
                this.setState({
                    areas: areas
                })
            })
    }

    formData = () => {

    }

    render() {
        const {
            data,
            openPopup,
            screenName,
            user,
            handleForm,
            filterModal
        } = this.props;
        const { cities, areas } = this.state
        return (
            <Modal visible={openPopup}
                animationType="slide"
                onRequestClose={this.closePopup}
            >
                <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent onValueChange={(text) => { 
                            handleForm(text, 'city')
                            this.getAreas(text)
                     }} data={cities} name={'type'} placeholder='Select City' />
                    </View>
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent onValueChange={(text) => { handleForm(text, 'area') }} data={areas} name={'type'} placeholder='Select Area' />
                    </View>
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent onValueChange={(text) => { handleForm(text, 'propertyTyp') }} data={cities} name={'type'} placeholder='Property Type' />
                    </View>
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent onValueChange={(text) => { handleForm(text, 'properySubType') }} data={cities} name={'type'} placeholder='Property Sub Type' />
                    </View>
                    <View style={{ flexDirection: "row", padding: 15 }}>
                        <View style={[{ paddingRight: 10, flex: 1, }]}>
                            <PickerComponent onValueChange={(text) => { handleForm(text, 'size') }} data={cities} name={'type'} placeholder='Size' />
                        </View>
                        <View style={[{ flex: 1, }]}>
                            <PickerComponent onValueChange={(text) => { handleForm(text, 'sizeUnit') }} data={cities} name={'type'} placeholder='Size Unit' />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", padding: 15 }}>
                        <View style={[{ paddingRight: 10, flex: 1, }]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'minPrice') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'minPrince'} placeholder={'Min Price'} />
                        </View>
                        <View style={[{ flex: 1, }]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'maxPrice') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'maxPrince'} placeholder={'Max Price'} />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", padding: 15 }}>
                        <View style={[{ paddingRight: 10, flex: 1, }]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'bed') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'bed'} placeholder={'Beds'} />
                        </View>
                        <View style={[{ flex: 1, }]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'bath') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'bath'} placeholder={'Bath'} />
                        </View>
                    </View>
                    <View style={[AppStyles.mainInputWrap, { padding: 15 }]}>
                        <Button
                            onPress={() => { this.props.filterModal() }}
                            style={[AppStyles.formBtn, styles.btn1]}>
                            <Text style={AppStyles.btnText}>MATCH</Text>
                        </Button>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(FilterModal)