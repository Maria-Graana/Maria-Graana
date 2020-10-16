import React from 'react';
import styles from './style'
import { View, Text, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import helper from '../../helper';
import _ from 'underscore';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import Loader from '../../components/loader';

const PlaceHolderImage = require('../../../assets/img/img-3.png')

class PropertyDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            property: {},
            loading: true,
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchProperty()
        })
    }

    navigateTo = () => {
        const { route, navigation } = this.props;
        navigation.navigate('AddInventory', { property: route.params.property, update: route.params.update })
    }

    fetchProperty = () => {
        const { route } = this.props
        const { property } = route.params
        axios.get(`/api/inventory/${property.id}`)
            .then((res) => {
                this.setState({ property: res.data, loading: false })
            })
            .catch((error) => {
                console.log("ERROR API: /api/inventory/", error)
            })
    }

    checkUserName = (property) => {
        if (property.customer) {
            if (property.customer.first_name && property.customer.last_name) {
                return property.customer.first_name + ' ' + property.customer.last_name
            }
            else if (property.customer.first_name) {
                return property.customer.first_name
            }
        }
        else {
            return '';
        }
    }

    render() {
        const { loading, property } = this.state
        let type = ''
        let subtype = ''
        let areaName = ''
        let propertyAddress = ''
        let cityName = ''
        let size = ''
        let sizeUnit = ''
        let purpose = ''
        let demandPrice = ''
        let description = ''
        let grade = ''
        let lattitude = ''
        let longitude = ''
        let ownerName = ''
        let ownerPhoneNumber = ''
        let address = ''
        let images = ''
        let parsedFeatures = ''
        let amentities = ''
        let yearBuilt = ''
        let parkingSpace = ''
        let downPayment = ''
        let floors = ''

        if (!loading) {
            type = property && property.type.charAt(0).toUpperCase() + property.type.slice(1);
            subtype = property && property.subtype.charAt(0).toUpperCase() + property.subtype.slice(1);
            areaName = property && property.area.name;
            propertyAddress = property && property.address;
            cityName = property && property.city.name;
            size = property && property.size;
            sizeUnit = property && property.size_unit.charAt(0).toUpperCase() + property.size_unit.slice(1);
            purpose = property && property.purpose.charAt(0).toUpperCase() + property.purpose.slice(1);;
            demandPrice = property.price;
            description = property && property.description;
            grade = property.grade === null || property.grade === '' ? '' : property.grade;
            lattitude = property.lat === null ? '' : property.lat + '/';
            longitude = property.lng === null ? '' : property.lng;
            ownerName = this.checkUserName(property);
            ownerPhoneNumber = property.customer && property.customer.phone.trim();
            address = property.customer && property.customer.address && property.customer.address;
            images = property && property.armsPropertyImages;
            parsedFeatures = JSON.parse(property.features);
            amentities = _.isEmpty(parsedFeatures) ? [] : (_.keys(parsedFeatures));
            if (amentities.length) {
                amentities = _.map(amentities, amentity => (amentity.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())))
                amentities = _.without(amentities, 'Year Built', 'Floors', 'Downpayment', 'Parking Space');
            }
            yearBuilt = parsedFeatures && parsedFeatures.year_built ? parsedFeatures.year_built : null;
            parkingSpace = parsedFeatures && parsedFeatures.parking_space ? parsedFeatures.parking_space : null;
            downPayment = parsedFeatures && parsedFeatures.downpayment ? parsedFeatures.downpayment : null;
            floors = parsedFeatures && parsedFeatures.floors ? parsedFeatures.floors : null;
        }

        return (
            !loading ?
                <ScrollView style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                    <View style={styles.outerContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.headingText}> Property Type </Text>
                            <Text style={styles.labelText}> {type} </Text>
                            <Text style={styles.headingText}> Property Sub Type </Text>
                            <Text style={styles.labelText}> {subtype + ', ' + type} </Text>
                            <Text style={styles.headingText}> Area </Text>
                            <Text style={styles.labelText}> {areaName} </Text>
                            {
                                propertyAddress ?
                                    <>
                                        <Text style={styles.headingText}> Address </Text>
                                        <Text style={styles.labelText}> {propertyAddress} </Text>
                                    </>
                                    : null
                            }

                            <Text style={styles.headingText}> City </Text>
                            <Text style={styles.labelText}> {cityName} </Text>
                            <Text style={styles.headingText}> Size/Unit </Text>
                            <Text style={styles.labelText}> {size + ' ' + sizeUnit + ' ' + subtype} </Text>
                            <Text style={styles.headingText}> Available for </Text>
                            <Text style={styles.labelText}> {purpose} </Text>
                            <Text style={styles.headingText}> Demand Price </Text>
                            <Text style={styles.labelText}> {helper.checkPrice(demandPrice, true)} </Text>
                            {
                                description ? <>
                                    <Text style={styles.headingText}> Description </Text>
                                    <Text style={styles.labelText}> {description} </Text>
                                </> : null
                            }

                            {images.length ? <Text style={styles.headingText}> Images </Text> : null}
                            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
                                {
                                    images.length ?
                                        images.map((item, index) => {
                                            return (
                                                <Image key={index} source={{ uri: item.url }} style={[styles.imageStyle]} />
                                            )
                                        })
                                        : null
                                }

                            </View>

                            {
                                grade ?
                                    <View>
                                        <Text style={styles.headingText}> Grade </Text>
                                        <Text style={styles.labelText}> {grade} </Text>
                                    </View>
                                    : null
                            }


                            {type === 'Residential' &&
                                <View>
                                    <Text style={styles.headingText}> Beds </Text>
                                    <Text style={styles.labelText}> {property.bed === null ? '0' + ' Bed(s)' : String(property.bed) + ' Bed(s)'} </Text>
                                    <Text style={styles.headingText}> Baths </Text>
                                    <Text style={styles.labelText}> {property.bath === null ? '0' + ' Bed(s)' : String(property.bath) + ' Bath(s)'} </Text>
                                    {
                                        parkingSpace ? <>
                                            <Text style={styles.headingText}> Parking </Text>
                                            <Text style={styles.labelText}> {String(parkingSpace) + ' Parking Space(s)'} </Text>
                                        </> : null

                                    }
                                    {
                                        yearBuilt ? <>
                                            <Text style={styles.headingText}> Year Built </Text>
                                            <Text style={styles.labelText}> {String(yearBuilt)} </Text>
                                        </> : null
                                    }
                                </View>
                            }
                            {
                                type === 'plot' &&
                                <View>
                                    {
                                        floors ?
                                            <>
                                                <Text style={styles.headingText}> Floor </Text>
                                                <Text style={styles.labelText}> {String(floors)} </Text>
                                            </>
                                            :
                                            null
                                    }
                                </View>
                            }

                            {
                                downPayment ? <>
                                    <Text style={styles.headingText}> Down Payment </Text>
                                    <Text style={styles.labelText}> {helper.checkPrice(downPayment, true)} </Text>
                                </> :
                                    null
                            }

                            {
                                (lattitude || longitude) ?
                                    <View>
                                        <Text style={styles.headingText}> Lattitude/Longitude </Text>
                                        <Text style={styles.labelText}> {lattitude + longitude} </Text>
                                    </View>
                                    : null
                            }
                            {
                                ownerName ?
                                    <View>
                                        <Text style={styles.headingText}> Owner Name </Text>
                                        <Text style={styles.labelText}> {ownerName} </Text>
                                    </View>
                                    : null
                            }
                            {
                                ownerPhoneNumber ?
                                    <View>
                                        <Text style={styles.headingText}> Owner Number </Text>
                                        <Text style={styles.labelText}> {ownerPhoneNumber}</Text>
                                    </View>
                                    : null
                            }
                            {
                                address ?
                                    <View>
                                        <Text style={styles.headingText}> Owner Address </Text>
                                        <Text style={styles.labelText}> {address}</Text>
                                    </View> :
                                    null
                            }
                            <View>
                                <Text style={styles.headingText}> ID </Text>
                                <Text style={styles.labelText}> {property.id}</Text>
                            </View>
                            {
                                amentities && amentities.length ? <>

                                    <Text style={styles.headingText}> Property Features </Text>
                                    {
                                        <FlatList data={amentities}
                                            keyExtractor={item => item.toString()}
                                            scrollEnabled={false}
                                            numColumns={2}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => <View key={item.toString()} style={styles.featureOpacity}>
                                                <Ionicons name="ios-checkmark-circle-outline" size={24} color={AppStyles.colors.primaryColor} />
                                                <Text style={styles.featureText} style={{ padding: 5 }}>{item}</Text>
                                            </View>} />
                                    }
                                </>
                                    : null

                            }
                        </View>
                        <View style={styles.pad}>
                            {
                                <MaterialCommunityIcons onPress={() => { this.navigateTo() }} name="square-edit-outline" size={26} color={AppStyles.colors.primaryColor} />
                            }
                        </View>

                    </View>
                </ScrollView>
                :
                <Loader loading={loading} />
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(PropertyDetail)