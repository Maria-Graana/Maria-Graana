import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Modal, SafeAreaView, Image } from 'react-native'
import fuzzy from 'fuzzy'
import AppStyles from '../../AppStyles';
import Loader from '../loader';
import Search from '../Search';
import { connect } from 'react-redux';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import backArrow from '../../../assets/img/backArrow.png'

class SingleSelectionPickerComp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            areas: [],
            loading: true,
            searchText: '',
        }
    }

    componentDidMount() {
        const { mode, cities, areas, cityId } = this.props;
        if (mode === 'city') {
            this.setState({
                cityId: cityId,
                title: 'Select City',
                cities: cities
            })
        }
        else {
            // handle area here
            this.setState({
                title: 'Select Area',
                areas: areas
            })
        }
    }

    checkIsCitySelected = (selectedCity) => {
        const copyCities = [...this.state.cities];
        const allCities = copyCities.map(city => (
            { ...city, isSelected: city.value === selectedCity.value }
        ))
        this.setState({ cities: allCities });
    }

    checkIsAreaSelected = (selectedArea) => {
        const copyAreas = [...this.state.areas];
        const allAreas = copyAreas.map(area => (
            { ...area, isSelected: area.value === selectedArea.value }
        ))
        this.setState({ areas: allAreas });
    }

    onCitySelected = (item) => {
        this.props.handleForm(item, 'cityId')
        this.props.openModal()
    }

    onAreaSelected = (item) => {
        const { navigation, route } = this.props;
        const { screenName } = route.params;
        navigation.navigate(screenName, { selectedArea: item })
    }

    renderCityItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ backgroundColor: item.isSelected ? AppStyles.colors.backgroundColor : AppStyles.whiteColor }}
                activeOpacity={.7}
                onPress={() => this.onCitySelected(item)}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowText}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderAreaItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ backgroundColor: item.isSelected ? AppStyles.colors.backgroundColor : AppStyles.whiteColor }}
                activeOpacity={.7}
                onPress={() => this.onAreaSelected(item)}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowText}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { searchText, cities, areas, loading } = this.state;
        const { mode, isVisible, handleform } = this.props

        let data = [];
        if (searchText !== '' && data.length === 0) {
            data = fuzzy.filter(searchText, mode === 'city' ? cities : areas, { extract: (e) => e.name })
            data = data.map((item) => item.original)
        }
        else {
            data = mode === 'city' ? cities : areas;
        }

        return (
            <Modal
                visible={isVisible}
                animationType="slide"
                onRequestClose={isVisible}
            >
                <SafeAreaView style={[AppStyles.container, { paddingHorizontal: 0, backgroundColor: AppStyles.bgcWhite.backgroundColor }]}>
                    <View style={styles.topHeader}>
                        <TouchableOpacity
                            onPress={() => { this.props.openModal() }}>
                            <Image source={backArrow} style={[styles.backImg]} />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Select City</Text>
                        </View>
                    </View>
                    <Search placeholder={mode === 'city' ? 'Search City...' : 'Search Area...'} searchText={searchText} setSearchText={(value) => this.setState({ searchText: value })} />
                    {
                        data.length > 0 ?
                            <FlatList
                                data={
                                    data
                                }
                                showsVerticalScrollIndicator={false}
                                renderItem={mode === 'city' ? this.renderCityItem : this.renderAreaItem}
                                keyExtractor={(item, index) => String(index)}
                                scrollIndicatorInsets={{ top: 0 }}
                            />
                            :
                            <Loader loading={loading} />
                    }
                </SafeAreaView>
            </Modal>
        );
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(SingleSelectionPickerComp)

const styles = StyleSheet.create({
    rowContainer: {
        paddingTop: hp('1.5%'),
        paddingBottom: hp('1.5%'),
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        borderTopColor: '#ddd',
        borderTopWidth: 0.5
    },
    rowText: {
        color: AppStyles.colors.textColor,
        fontSize: 18,
    },
    backImg: {
        width: 25,
        height: 25,
        marginTop: 5,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    topHeader: {
        flexDirection: 'row',
        marginHorizontal: 25
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    headerText: {
        paddingRight: 30,
        fontFamily: AppStyles.fonts.semiBoldFont,
        fontSize: 16
    },
})
