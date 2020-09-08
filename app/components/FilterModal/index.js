import React from 'react'
import {
    View,
    Modal,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native'
import backArrow from '../../../assets/img/backArrow.png'
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import PickerComponent from '../Picker/index';
import styles from './style';
import PriceSlider from '../PriceSlider/index';
import { Button } from 'native-base';
import StaticData from '../../StaticData';
import AreaPicker from '../AreaPicker/index';
import TouchableInput from '../TouchableInput';
import SingleSelectionPickerComp from '../SingleSelectionPickerComp/index';
import ErrorMessage from '../ErrorMessage/index';
import { formatPrice } from '../../PriceFormate'
import _ from 'underscore';

class FilterModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showAreaPicker: false,
            showCityPicker: false
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    openModal = () => {
        const { showAreaPicker } = this.state
        this.setState({
            showAreaPicker: !showAreaPicker
        })
    }

    openCityModal = () => {
        const { showCityPicker } = this.state
        this.setState({
            showCityPicker: !showCityPicker
        })
    }

    emptyList = () => {
        this.areaPicker.emptyList()
    }

    render() {
        const {
            openPopup,
            maxCheck,
            areas,
            cities,
            formData,
            handleForm,
            getSubType,
            subTypVal,
            submitFilter,
            getAreas,
            onSliderValueChange,
            selectedCity,
            sizeUnitList,
            onSizeUnitSliderValueChange
        } = this.props;
        const { showAreaPicker, showCityPicker } = this.state
        const { sizeUnit, type } = StaticData
        let prices = formData.purpose === 'rent' ? StaticData.PricesRent : StaticData.PricesBuy
        return (
            <Modal visible={openPopup}
                animationType="slide"
                onRequestClose={this.closePopup}
            >
                <SafeAreaView style={[AppStyles.mb1, styles.container]}>
                    <ScrollView>
                        <View style={styles.topHeader}>
                            <TouchableOpacity
                                onPress={() => { this.props.filterModal() }}>
                                <Image source={backArrow} style={[styles.backImg]} />
                            </TouchableOpacity>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>SEARCH FILTERS</Text>
                            </View>
                        </View>

                        {/* **************************************** */}

                        <AreaPicker
                            onRef={ref => (this.areaPicker = ref)}
                            handleForm={handleForm}
                            openModal={this.openModal}
                            selectedAreaIds={_.clone(formData.leadAreas)}
                            editable={false}
                            isVisible={showAreaPicker}
                            cityId={formData.cityId}
                            areas={_.clone(areas)}
                        />

                        {/* **************************************** */}

                        <SingleSelectionPickerComp
                            mode={'city'}
                            handleForm={handleForm}
                            openModal={this.openCityModal}
                            isVisible={showCityPicker}
                            cityId={formData.cityId}
                            cities={cities.length ? _.clone(cities) : []}
                        />

                        {/* **************************************** */}


                        {/* <View style={styles.pickerView}>
                            <PickerComponent selectedItem={formData.cityId} onValueChange={(text) => {
                                handleForm(text, 'cityId')
                                getAreas(text)
                                this.emptyList()
                            }} data={cities.length ? cities : []} name={'city'} placeholder='Select City' />
                        </View> */}
                        <View style={[styles.pickerView, { padding: 0, paddingHorizontal: 15 }]} >
                            <TouchableInput
                                placeholder="Select City"
                                onPress={() => this.openCityModal()}
                                value={selectedCity ? selectedCity.name : ''}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.openModal()} style={styles.btnMargin} >
                            <View style={[AppStyles.mainInputWrap, AppStyles.inputPadLeft, AppStyles.formControl, { justifyContent: 'center' }]} >
                                <Text style={[AppStyles.formFontSettings, { color: formData.leadAreas.length > 0 ? AppStyles.colors.textColor : AppStyles.colors.subTextColor }]} >
                                    {formData.leadAreas.length > 0 ? `${formData.leadAreas.length} Areas Selected` : 'Select Areas'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.pickerView}>
                            <PickerComponent selectedItem={formData.propertyType} onValueChange={(text) => {
                                handleForm(text, 'propertyType')
                                getSubType(text)
                            }} data={type} name={'type'} placeholder='Property Type' />
                        </View>
                        <View style={styles.pickerView}>
                            <PickerComponent selectedItem={formData.propertySubType} onValueChange={(text) => { handleForm(text, 'propertySubType') }} data={subTypVal} name={'type'} placeholder='Property Sub Type' />
                        </View>
                        <View style={styles.pickerView}>
                            <PickerComponent selectedItem={formData.sizeUnit} onValueChange={(text) => { handleForm(text, 'sizeUnit') }} data={sizeUnit} name={'type'} placeholder='Size Unit' />
                        </View>
                        <View style={[AppStyles.multiFormInput, AppStyles.mainInputWrap, { justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 15 }]}>
                            <TextInput placeholder='Size Min'
                                value={formData.minPrice === StaticData.Constants.any_value ? 'Any' : formatPrice(formData.size)}
                                style={[AppStyles.formControl, styles.priceStyle]}
                                editable={false}
                            />
                            <Text style={styles.toText}>to</Text>
                            <TextInput placeholder='Size Max'
                                value={formatPrice(formData.maxSize)}
                                style={[AppStyles.formControl, styles.priceStyle]}
                                editable={false}
                            />
                        </View>
                        <PriceSlider priceValues={sizeUnitList} initialValue={sizeUnitList.indexOf(Number(formData.size) || 0)} finalValue={sizeUnitList.indexOf(Number(formData.maxSize) || 0)} onSliderValueChange={(values) => onSizeUnitSliderValueChange(values)} />
                        {
                            maxCheck ?
                                <View style={styles.errorView}>
                                    <ErrorMessage errorMessage={'Max value cannot be less than Min value!'} />
                                </View>
                                :
                                null
                        }
                        <View style={[AppStyles.multiFormInput, AppStyles.mainInputWrap, { justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 15 }]}>
                            <TextInput
                                placeholderTextColor={'#a8a8aa'}
                                placeholder='Price Min'
                                value={formData.minPrice == StaticData.Constants.any_value ? 'Any' : formatPrice(formData.minPrice || 0)}
                                style={[AppStyles.formControl, styles.priceStyle]}
                                editable={false}
                            />
                            <Text style={styles.toText}>to</Text>
                            <TextInput
                                placeholderTextColor={'#a8a8aa'}
                                placeholder='Price Max'
                                value={formData.maxPrice == StaticData.Constants.any_value ? 'Any' : formatPrice(formData.maxPrice || 0)}
                                style={[AppStyles.formControl, styles.priceStyle]}
                                style={[AppStyles.formControl, styles.priceStyle]}
                                editable={false}
                            />
                        </View>
                        <PriceSlider priceValues={prices} initialValue={prices.indexOf(Number(formData.minPrice) || 0)} finalValue={prices.indexOf(Number(formData.maxPrice) || 0)} onSliderValueChange={(values) => onSliderValueChange(values)} />
                        <View style={styles.textInputView}>
                            <View style={styles.textView}>
                                <TextInput placeholderTextColor={'#a8a8aa'} keyboardType={'numeric'} value={formData.bed ? String(formData.bed) : ''} onChangeText={(text) => { handleForm(text, 'bed') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'bed'} placeholder={'Beds'} />
                            </View>
                            <View style={AppStyles.mb1}>
                                <TextInput placeholderTextColor={'#a8a8aa'} keyboardType={'numeric'} value={formData.bath ? String(formData.bath) : ''} onChangeText={(text) => { handleForm(text, 'bath') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'bath'} placeholder={'Bath'} />
                            </View>
                        </View>
                        <View style={[AppStyles.mainInputWrap, styles.matchBtn]}>
                            <Button
                                onPress={() => { submitFilter() }}
                                style={[AppStyles.formBtn, styles.btn1]}>
                                <Text style={AppStyles.btnText}>MATCH</Text>
                            </Button>
                        </View>
                        <TouchableOpacity onPress={() => { this.props.resetFilter() }}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal >
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