import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import AppStyles from '../../AppStyles';
import PickerComponent from '../Picker';

const OfficeLocationSelector = ({ officeLocations, officeLocationId, handleOfficeLocationChange, disabled }) => {
    const [editLocation, setEditLocation] = useState(false);
    const officeLocation = officeLocations.find(item => item.value === officeLocationId);
    return (
        <View style={AppStyles.mainInputWrap}>
            <Text style={styles.locationHeading}>Office Location</Text>
            {
                editLocation ?
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent
                            onValueChange={handleOfficeLocationChange}
                            data={officeLocations}
                            selectedItem={officeLocationId}
                            name={'officeLocation'}
                            placeholder="Office Locations"
                        />
                </View>
                    :
                    <View style={styles.editLocationMain}>
                        <View style={styles.editLocationLeftContainer}>
                            <Text >{officeLocation ? officeLocation.name : ''}</Text>
                        </View>
                        <TouchableOpacity disabled={disabled} onPress={() => setEditLocation(true)} style={styles.editLocationRightContainer}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>

    )
}

export default OfficeLocationSelector

const styles = StyleSheet.create({
    editLocationMain: {
        flexDirection: 'row',
        width: '100%',
    },
    editLocationLeftContainer: {
        paddingVertical: 10,
        paddingHorizontal:15,
        width: '85%',
        height: 50,
        borderRadius: 4,
        backgroundColor: 'white',
        justifyContent:'center',
    },
    editLocationRightContainer: {
        width: '15%',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationHeading: {
        fontSize: 14,
        fontFamily: AppStyles.fonts.boldFont,
        paddingBottom: 5
    },
    editText: {
        color: AppStyles.colors.primaryColor,
        fontSize: AppStyles.fontSize.medium,
        fontFamily: AppStyles.fonts.semiBoldFont
    }
})
