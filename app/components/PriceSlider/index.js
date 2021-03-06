import React from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AppStyles from '../../AppStyles';


const CustomMarker = () => {
    return (
        <View style={styles.customMarkerStyle} />
    );
};

const PriceSlider = ({ priceValues, onSliderValueChange, initialValue, finalValue, allowOverlap = false }) => {
    return (
        <View style={styles.container}>
            <MultiSlider
                trackStyle={styles.trackStyle}
                selectedStyle={styles.selectedStyle}
                customMarker={CustomMarker}
                values={[initialValue, finalValue]}
                onValuesChange={onSliderValueChange}
                min={0}
                max={priceValues.length - 1}
                allowOverlap={allowOverlap}
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
        height: 5
    },
    selectedStyle: {
        backgroundColor: AppStyles.colors.primaryColor
    },
    customMarkerStyle: {
        height: 30,
        width: 30,
        borderRadius: 32,
        borderWidth: 1.5,
        backgroundColor: AppStyles.whiteColor.color,
        borderColor: AppStyles.colors.primaryColor
    }
})
