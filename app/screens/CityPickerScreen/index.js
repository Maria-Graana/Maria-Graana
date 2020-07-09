import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import fuzzy from 'fuzzy'
import AppStyles from '../../AppStyles';
import Loader from '../../components/loader';
import Search from '../../components/Search';
import axios from 'axios';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

class CityPickerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            loading: true,
            searchText: '',
        }
    }

    componentDidMount() {
        this.getCities();
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
                        this.checkIsSelected(selectedCity);
                    }
                })
            })
    }

    checkIsSelected = (selectedCity) => {
        const copyCities = [...this.state.cities];
        const allCities = copyCities.map(city => (
            { ...city, isSelected: city.value === selectedCity.value }
        ))
        this.setState({ cities: allCities });
    }


    onItemSelected = (item) => {
        const { navigation, route } = this.props;
        const { screenName } = route.params;
        navigation.navigate(screenName, { selectedCity: item })
    }

    renderCityItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ backgroundColor: item.isSelected ? AppStyles.colors.backgroundColor : AppStyles.whiteColor }}
                activeOpacity={.7}
                onPress={() => this.onItemSelected(item)}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowText}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { searchText, cities, loading } = this.state;
        let data = [];
        if (searchText !== '' && data.length === 0) {
            data = fuzzy.filter(searchText, cities, { extract: (e) => e.name })
            data = data.map((item) => item.original)
        }
        else {
            data = cities;
        }

        return (
            <View style={[AppStyles.container, { paddingHorizontal: 0, backgroundColor: AppStyles.bgcWhite.backgroundColor }]}>
                <Search placeholder='Search city...' searchText={searchText} setSearchText={(value) => this.setState({ searchText: value })} />
                {
                    !loading && data.length > 0 ?
                        <FlatList
                            data={
                                data
                            }
                            showsVerticalScrollIndicator={false}
                            renderItem={this.renderCityItem}
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

export default CityPickerScreen;

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
