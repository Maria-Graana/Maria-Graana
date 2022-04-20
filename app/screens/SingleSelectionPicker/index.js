import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import fuzzy from 'fuzzy'
import AppStyles from '../../AppStyles';
import Loader from '../../components/loader';
import Search from '../../components/Search';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

class SingleSelectionPicker extends Component {

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
        const { route, dispatch, navigation } = this.props;
        const { mode, cityId } = route.params;
        if (mode === 'city') {
            navigation.setOptions({ title: 'Select City' });
            this.getCities();
        }
        else {
            // handle area here
            navigation.setOptions({ title: 'Select Area' });
            this.getAreas(cityId);
        }
    }

    getCities = () => {
        const { selectedCity } = this.props.route.params;
        axios.get(`/api/cities`)
            .then((res) => {
                let citiesArray = [];
                res && res.data.map((item, index) => { return (citiesArray.push({ value: item.id, name: item.name })) })
                this.setState({
                    cities: citiesArray,
                    loading: false,
                }, () => {
                    if (selectedCity) {
                        this.checkIsCitySelected(selectedCity);
                    }
                })
            })
    }

    getAreas = (cityId) => {
        const { selectedArea } = this.props.route.params;
        axios.get(`/api/areas?city_id=${cityId}&all=true&minimal=true`)
            .then((res) => {
                let areas = [];
                res && res.data.items.map((item, index) => { return areas.push({ value: item.id, name: item.name }) })
                this.setState({
                    areas,
                    loading: false,
                }, () => {
                    // handle Selection of areas here
                    if (selectedArea) {
                        this.checkIsAreaSelected(selectedArea);
                    }
                })
            }).catch(error => {
                console.log(error)
            })
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
        const { navigation, route } = this.props;
        const { screenName } = route.params;
        navigation.navigate(screenName, { selectedCity: item })


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
        const { mode } = this.props.route.params;

        let data = [];
        if (searchText !== '' && data.length === 0) {
            data = fuzzy.filter(searchText, mode === 'city' ? cities : areas, { extract: (e) => e.name + ' ' })
            data = data.map((item) => item.original)
        }
        else {
            data = mode === 'city' ? cities : areas;
        }

        return (
            <View style={[AppStyles.container, { paddingHorizontal: 0, backgroundColor: AppStyles.bgcWhite.backgroundColor }]}>
                <Search placeholder={mode === 'city' ? 'Search City...' : 'Search Area...'} searchText={searchText} setSearchText={(value) => this.setState({ searchText: value })} />
                {
                    !loading && data.length > 0 ?
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
            </View>

        );
    }
}

export default SingleSelectionPicker;

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
    }
})
