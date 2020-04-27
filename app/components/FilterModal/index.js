import React from 'react'
import {
    View,
    Modal,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native'
import backArrow from '../../../assets/img/backArrow.png'
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import PickerComponent from '../Picker/index';
import axios from 'axios';
import styles from './style';
import { Button } from 'native-base';
import StaticData from '../../StaticData';
import MultiSelect from 'react-native-multiple-select';
import AreaPicker from '../AreaPicker/index';

class FilterModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cities: [],
            areas: [],
            subTypVal: [],
            showAreaPicker: false,
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
                leadAreas: [],
            },
        }
    }

    componentDidMount() {
        this.getCities()
        this.setFilter()
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
    }

    setFilter = () => {
        const { formData, lead } = this.props
        let cityId = ''
        let areaId = ''
        if ('city' in lead && lead.city) {
            cityId = lead.city.id
            this.getAreas(cityId)
        }
        if ('armsLeadAreas' in lead) {
            if (lead.armsLeadAreas.length) {
                if ('area' in lead.armsLeadAreas[0]) {
                    areaId = lead.armsLeadAreas[0].area.id
                }
            }
        }
        if (lead.type) {
            this.getSubType(lead.type)
        }
        formData.areaId = areaId
        this.setState({ formData })
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
        axios.get(`/api/areas?city_id=${cityId}&&all=${true}`)
            .then((res) => {
                let areas = [];
                res && res.data.items.map((item, index) => { return (areas.push({ value: item.id, name: item.name })) })
                this.setState({
                    areas: areas
                })
            })
    }

    getSubType = (text) => {
        const { subType } = StaticData
        this.setState({
            subTypVal: subType[text]
        })
    }

    submitFilter = () => {
        const { formData } = this.state
        this.props.submitFilter(formData)
    }

    openModal = () => {
        const { showAreaPicker } = this.state
        this.setState({ showAreaPicker: !showAreaPicker })
    }

    render() {
        const {
            openPopup,
        } = this.props;

        const { cities, areas, subTypVal, formData, showAreaPicker } = this.state
        const { sizeUnit, type, oneToTen, } = StaticData
        
        return (
            <Modal visible={openPopup}
                animationType="slide"
                onRequestClose={this.closePopup}
            >
                <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, }}>
                        <TouchableOpacity
                            onPress={() => { this.props.filterModal() }}>
                            <Image source={backArrow} style={[styles.backImg]} />
                        </TouchableOpacity>
                        <View style={{ flex: 1,justifyContent: 'center', alignItems: "center", }}>
                            <Text style={{paddingRight: 30, fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 16}}>SEARCH FILTERS</Text>
                        </View>
                    </View>
                    <AreaPicker handleForm={this.handleForm} openModal={this.openModal} selectedAreaIds={formData.leadAreas} editable={false} isVisible={showAreaPicker} cityId={formData.cityId} areas={areas} />
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent selectedItem={formData.cityId} onValueChange={(text) => {
                            this.handleForm(text, 'cityId')
                            this.getAreas(text)
                        }} data={cities.length ? cities : []} name={'city'} placeholder='Select City' />
                    </View>
                    <TouchableOpacity onPress={() => this.openModal()} style={{ marginHorizontal: 15 }} >
                        <View style={[AppStyles.mainInputWrap, AppStyles.inputPadLeft, AppStyles.formControl, { justifyContent: 'center' }]} >
                            <Text style={[AppStyles.formFontSettings, { color: formData.leadAreas.length > 0 ? AppStyles.colors.textColor : AppStyles.colors.subTextColor }]} >
                                {formData.leadAreas.length > 0 ? `${formData.leadAreas.length} Areas Selected` : 'Select Areas'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* <View style={[{ padding: 15 }]}>
                        <PickerComponent selectedItem={formData.areaId} onValueChange={(text) => { this.handleForm(text, 'area') }} data={areas.length ? areas : []} name={'area'} placeholder='Select Area' />
                    </View> */}
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent selectedItem={formData.propertyType} onValueChange={(text) => {
                            this.handleForm(text, 'propertyType')
                            this.getSubType(text)
                        }} data={type} name={'type'} placeholder='Property Type' />
                    </View>
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent selectedItem={formData.propertySubType} onValueChange={(text) => { this.handleForm(text, 'propertySubType') }} data={subTypVal.length ? subTypVal : null} name={'type'} placeholder='Property Sub Type' />
                    </View>
                    <View style={{ flexDirection: "row", padding: 15 }}>
                        <View style={[{ paddingRight: 10, flex: 1, }]}>
                            <PickerComponent selectedItem={formData.size ? String(formData.size) : ''} onValueChange={(text) => { this.handleForm(text, 'size') }} data={oneToTen} name={'type'} placeholder='Size' />
                        </View>
                        <View style={[{ flex: 1, }]}>
                            <PickerComponent selectedItem={formData.sizeUnit} onValueChange={(text) => { this.handleForm(text, 'sizeUnit') }} data={sizeUnit} name={'type'} placeholder='Size Unit' />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", padding: 15 }}>
                        <View style={[{ paddingRight: 10, flex: 1, }]}>
                            <TextInput min={formData.maxPrice ? formData.maxPrice : 0} keyboardType={'numeric'} value={formData.minPrice} onChangeText={(text) => { this.handleForm(text, 'minPrice') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'minPrince'} placeholder={'Min Price'} />
                        </View>
                        <View style={[{ flex: 1, }]}>
                            <TextInput keyboardType={'numeric'} value={formData.maxPrice} onChangeText={(text) => { this.handleForm(text, 'maxPrice') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'maxPrince'} placeholder={'Max Price'} />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", padding: 15 }}>
                        <View style={[{ paddingRight: 10, flex: 1, }]}>
                            <TextInput keyboardType={'numeric'} value={formData.bed ? String(formData.bed) : ''} onChangeText={(text) => { this.handleForm(text, 'bed') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'bed'} placeholder={'Beds'} />
                        </View>
                        <View style={[{ flex: 1, }]}>
                            <TextInput keyboardType={'numeric'} value={formData.bath ? String(formData.bath) : ''} onChangeText={(text) => { this.handleForm(text, 'bath') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'bath'} placeholder={'Bath'} />
                        </View>
                    </View>
                    <View style={[AppStyles.mainInputWrap, { padding: 15, paddingBottom: 0 }]}>
                        <Button
                            onPress={() => { this.submitFilter() }}
                            style={[AppStyles.formBtn, styles.btn1]}>
                            <Text style={AppStyles.btnText}>MATCH</Text>
                        </Button>
                    </View>
                    <TouchableOpacity onPress={() => { this.props.resetFilter() }}>
                        <Text style={{ color: AppStyles.colors.primaryColor, fontSize: 18, paddingLeft: 15 }}>Reset</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        lead: store.lead.lead
    }
}

export default connect(mapStateToProps)(FilterModal)