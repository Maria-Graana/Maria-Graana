import React from 'react'
import {
    View,
    Modal,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import PickerComponent from '../Picker/index';
import axios from 'axios';
import { Button } from 'native-base';
import StaticData from '../../StaticData';
import MultiSelect from 'react-native-multiple-select';

class FilterModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cities: [],
            areas: [],
            subTypVal: [],
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
                leadAreas: []
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

    resetFilter = () => {
        const { lead } = this.props
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
        this.setState({
            formData: {
                cityId: cityId,
                areaId: areaId,
                minPrice: lead.min_price || '',
                maxPrice: lead.price || '',
                bed: lead.bed || '',
                bath: lead.bath || '',
                size: lead.size || '',
                sizeUnit: lead.size_unit || '',
                propertySubType: lead.subtype || '',
                propertyType: lead.type || '',
                purpose: lead.purpose || '',
            }
        })
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

    render() {
        const {
            openPopup,
        } = this.props;

        const { cities, areas, subTypVal, formData } = this.state
        const { sizeUnit, type, oneToTen, } = StaticData

        return (
            <Modal visible={openPopup}
                animationType="slide"
                onRequestClose={this.closePopup}
            >
                <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
                    <View style={[{ padding: 15 }]}>
                        <PickerComponent selectedItem={formData.cityId} onValueChange={(text) => {
                            this.handleForm(text, 'city')
                            this.getAreas(text)
                        }} data={cities.length ? cities : []} name={'city'} placeholder='Select City' />
                    </View>
                    {/* <View style={[{ padding: 15 }]}>
                        <PickerComponent selectedItem={formData.areaId} onValueChange={(text) => { this.handleForm(text, 'area') }} data={areas.length ? areas : []} name={'area'} placeholder='Select Area' />
                    </View> */}
                    <View style={[AppStyles.mainInputWrap, { marginHorizontal: 15 }]}>
                        <View style={[AppStyles.inputWrap]}>
                            <MultiSelect
                                hideTags
                                items={areas.length ? areas : []}
                                uniqueKey="value"
                                displayKey="name"
                                ref={(component) => { this.multiSelect = component }}
                                onSelectedItemsChange={(text) => this.handleForm(text, 'leadAreas')}
                                selectedItems={formData.leadAreas}
                                styleDropdownMenuSubsection={{
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    paddingLeft: 15,
                                    paddingRight: 10,
                                    backgroundColor: '#ffffff',
                                    borderWidth: 1,
                                    position: 'relative',
                                    borderRadius: 5,
                                    borderColor: '#f0f0f0',
                                    minHeight: 45,
                                }}
                                styleListContainer={styles.formControlMulti}
                                searchInputStyle={styles.formControlMulti}
                                searchInputPlaceholderText="Search Items..."
                                selectedItemTextColor="#000"
                                selectedItemIconColor="#757575"
                                // submitButtonColor="#000"
                                submitButtonText="Done"
                            />
                        </View>
                    </View>
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
                            <TextInput keyboardType={'numeric'} value={formData.minPrice} onChangeText={(text) => { this.handleForm(text, 'minPrice') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'minPrince'} placeholder={'Min Price'} />
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
                            <TextInput keyboardType={'numeric'} value={formData.bath ? String(formData.bath): ''} onChangeText={(text) => { this.handleForm(text, 'bath') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'bath'} placeholder={'Bath'} />
                        </View>
                    </View>
                    <View style={[AppStyles.mainInputWrap, { padding: 15 }]}>
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