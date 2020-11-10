import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal';
import AppStyles from '../../AppStyles';
import PriceSlider from '../PriceSlider';
import TouchableButton from '../TouchableButton'
import helper from '../../helper'
import StaticData from '../../StaticData';

const checkModalType = (modalType, initialValue, finalValue) => {
    if (modalType === 'bed') {
        return (`Beds: ${helper.showBedBathRangesString(initialValue, finalValue, StaticData.bedBathRange[StaticData.bedBathRange.length - 1])}`);
    }
    else if (modalType === 'bath') {
        return (`Baths: ${helper.showBedBathRangesString(initialValue, finalValue, StaticData.bedBathRange[StaticData.bedBathRange.length - 1])}`);
    }
    else {
        return '';
    }
}

const BedBathSliderModal = ({
    arrayValues,
    isVisible,
    initialValue,
    finalValue,
    modalType,
    onBedBathModalDonePressed,
    onModalCancelPressed }) => {
    const [minValue, setMinValue] = useState(initialValue);
    const [maxValue, setMaxValue] = useState(finalValue);
    const [rangeString, setRangeString] = useState('')

    useEffect(() => {
        setMinValue(initialValue);
        setMaxValue(finalValue);
        setRangeString(checkModalType(modalType, initialValue, finalValue))
    }, [initialValue, finalValue])

    const onSliderValueChange = (values) => {
        const start = values[0];
        const end = values[values.length - 1];
        setMinValue(arrayValues[start])
        setMaxValue(arrayValues[end])
        setRangeString(checkModalType(modalType, arrayValues[start], arrayValues[end]));
    }

    const onDonePressed = () => {
        onBedBathModalDonePressed(minValue, maxValue)
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalMain}>
                <Text style={styles.textStyle}>{rangeString}</Text>
                <PriceSlider initialValue={arrayValues.indexOf(minValue)}
                    finalValue={arrayValues.indexOf(maxValue)}
                    priceValues={arrayValues}
                    allowOverlap={minValue !== arrayValues[arrayValues.length - 2]}
                    onSliderValueChange={(values) => onSliderValueChange(values)} />
                <View style={styles.buttonsContainer}>
                    <TouchableButton containerStyle={[styles.buttonCommonStyle, styles.cancelButton]}
                        containerBackgroundColor={AppStyles.whiteColor.color}
                        label={'Cancel'}
                        fontFamily={AppStyles.fonts.boldFont}
                        textColor={AppStyles.colors.primaryColor}
                        fontSize={18}
                        onPress={() => onModalCancelPressed()} />
                    <TouchableButton
                        containerStyle={[styles.buttonCommonStyle, styles.doneButton]}
                        label={'Done'}
                        fontFamily={AppStyles.fonts.boldFont}
                        fontSize={18}
                        onPress={() => onDonePressed()} />
                </View>
            </View>
        </Modal>

    )
}

export default BedBathSliderModal

const styles = StyleSheet.create({
    modalMain: {
        backgroundColor: '#e7ecf0',
        borderRadius: 7,
        overflow: 'hidden',
        zIndex: 5,
        position: 'relative',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#333333',
        shadowOpacity: 1,
        padding: 15,
    },
    textStyle: {
        fontFamily: AppStyles.fonts.defaultFont,
        fontSize: AppStyles.fontSize.large,
        color: AppStyles.colors.textColor,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
    },
    buttonCommonStyle: {
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 55,
        width: '30%',
        marginVertical: 10,
    },
    doneButton: {
        borderColor: '#006ff1',
        backgroundColor: '#006ff1',
        marginLeft: 10,
    },
    cancelButton: {
        borderColor: '#006ff1',
        marginLeft: 10,
    },
})
