import React from 'react';
import styles from './style'
import { View, Text, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import { formatPrice } from '../../PriceFormate'

const PlaceHolderImage = require('../../../assets/img/img-3.png')

class PropertyDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    navigateTo = () => {
        const { route, navigation } = this.props;
        navigation.navigate('AddInventory', { property: route.params.property, update: route.params.update })
    }


    render() {
        const { route } = this.props;
        const property = route.params.property;
        const type = property.type.charAt(0).toUpperCase() + property.type.slice(1);
        const subtype = property.subtype.charAt(0).toUpperCase() + property.subtype.slice(1);
        const areaName = property.area.name;
        const cityName = property.city.name;
        const size = property.size;
        const sizeUnit = property.size_unit.charAt(0).toUpperCase() + property.size_unit.slice(1);
        const purpose = property.purpose.charAt(0).toUpperCase() + property.purpose.slice(1);;
        const demandPrice = property.price===null ? '0' : formatPrice(property.price);
        const grade = property.grade === null ? '' : property.grade;
        const lattitude = property.lat === null ? ' ' : property.lat + '/';
        const longitude = property.lng === null ? ' ' : property.lng;
        const ownerName = property.customer !==null && property.customer.first_name;
        const ownerPhoneNumber = property.phone.trim();
        const address = property.address;
        const status = property.status === 'pending' ? 'Open' : property.status;
        const images = property.armsPropertyImages;


        return (
            <ScrollView style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
                <View style={styles.outerContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.headingText}> Property Type </Text>
                        <Text style={styles.labelText}> {type} </Text>
                        <Text style={styles.headingText}> Property Sub Type </Text>
                        <Text style={styles.labelText}> {subtype + ', ' + type} </Text>
                        <Text style={styles.headingText}> Area </Text>
                        <Text style={styles.labelText}> {areaName} </Text>
                        <Text style={styles.headingText}> City </Text>
                        <Text style={styles.labelText}> {cityName} </Text>
                        <Text style={styles.headingText}> Size/Unit </Text>
                        <Text style={styles.labelText}> {size + ' ' + sizeUnit + ' ' + subtype} </Text>
                        <Text style={styles.headingText}> Available for </Text>
                        <Text style={styles.labelText}> {purpose} </Text>
                        <Text style={styles.headingText}> Demand Price </Text>
                        <Text style={styles.labelText}> {'PKR ' + demandPrice} </Text>
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

                        <Text style={styles.headingText}> Grade </Text>
                        <Text style={styles.labelText}> {grade} </Text>

                        {type === 'Residential' &&
                            <View>
                                <Text style={styles.headingText}> Beds </Text>
                                <Text style={styles.labelText}> {property.bed === null ? '0' + ' Bed(s)' : String(property.bed) + ' Bed(s)'} </Text>
                                <Text style={styles.headingText}> Baths </Text>
                                <Text style={styles.labelText}> {property.bath === null ? '0' + ' Bed(s)' : String(property.bath) + ' Bath(s)'} </Text>
                            </View>
                        }


                        <Text style={styles.headingText}> Lattitude/Longitude </Text>
                        <Text style={styles.labelText}> {lattitude + longitude} </Text>
                        <Text style={styles.headingText}> Owner Name </Text>
                        <Text style={styles.labelText}> {ownerName} </Text>
                        <Text style={styles.headingText}> Owner Number </Text>
                        <Text style={styles.labelText}> {ownerPhoneNumber}</Text>
                        <Text style={styles.headingText}> Owner Address </Text>
                        <Text style={styles.labelText}> {address}</Text>

                    </View>
                    <View style={styles.pad}>
                        {
                            <MaterialCommunityIcons onPress={() => { this.navigateTo() }} name="square-edit-outline" size={26} color={AppStyles.colors.primaryColor} />
                        }
                    </View>

                </View>
            </ScrollView>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(PropertyDetail)