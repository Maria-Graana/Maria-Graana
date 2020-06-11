import React from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AppStyles from '../../AppStyles';


const CustomMarker = () => {
     return (
         <View style={styles.customMarkerStyle}/>
     );
};

const PriceSlider = ({ priceValues, onSliderValueChange }) => {
    return (
        <View style={styles.container}>
            <MultiSlider
                trackStyle={styles.trackStyle}
                customMarker={CustomMarker}
                values={[0, priceValues.length - 1]}
                onValuesChange={onSliderValueChange}
                min={0}
                max={priceValues.length - 1}
                allowOverlap
                snapped
            />
        </View>
    )
}

export default PriceSlider

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    trackStyle: {
        height: 3,
        color: AppStyles.colors.primaryColor
    },
    customMarkerStyle:{
        height: 30,
        width: 30,
        borderRadius: 32,
        borderWidth: 1.5,
        backgroundColor: AppStyles.whiteColor.color,
        borderColor: AppStyles.colors.primaryColor
    }
})
