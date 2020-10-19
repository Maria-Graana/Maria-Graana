import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import Modal from 'react-native-modal';
import AppStyles from '../../AppStyles';
import PriceSlider from '../PriceSlider';
import TouchableButton from '../TouchableButton'
import ErrorMessage from '../ErrorMessage'
import helper from '../../helper'
import {formatPrice} from '../../PriceFormate'

const currencyConvert = (x) => {
    if (x) {
        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res;
    }
}

const PriceSliderModal = ({ isVisible,
    initialValue,
    finalValue,
    arrayValues,
    onModalCancelPressed,
    onModalPriceDonePressed }) => {
    const [minValue, setMinValue] = useState(initialValue);
    const [maxValue, setMaxValue] = useState(finalValue);
    const [stringValues, setStringValues] = useState({
        priceMin: currencyConvert(arrayValues[initialValue]),
        priceMax: currencyConvert(arrayValues[finalValue])
    })
    const [rangeString, setRangeString] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const priceMinInput = useRef(null);

    useEffect(() => {
        setMinValue(initialValue);
        setMaxValue(finalValue);
        setStringValues({ ...stringValues, priceMin: currencyConvert(arrayValues[initialValue]), priceMax: finalValue === arrayValues.length - 1 ? null : currencyConvert(arrayValues[finalValue]) })
        setRangeString(helper.convertPriceToString(initialValue, finalValue, arrayValues.length - 1, arrayValues))
    }, [initialValue, finalValue])

    const onSliderValueChange = (values) => {
        const start = values[0];
        const end = values[values.length - 1];
        setMinValue(start)
        setMaxValue(end)
        setStringValues({ ...stringValues, priceMin: currencyConvert(arrayValues[start]), priceMax: end === arrayValues.length - 1 ? null : currencyConvert(arrayValues[end]) })
        setRangeString(helper.convertPriceToString(start, end, arrayValues.length - 1, arrayValues))
    }

    const priceFormatter = (start, end) => {
        return `PKR: ${formatPrice(start)} - ${formatPrice(end)}`
    }

    const handleMinPriceChange = (value) => {
        setStringValues({ ...stringValues, priceMin: String(value) });
        if (value < arrayValues[maxValue]) {
            setErrorMessage('');
            const closestNumber = getClosestNumber(Number(value), arrayValues);
            const indexOfClosestNumber = arrayValues.indexOf(closestNumber);
            setRangeString(priceFormatter(value, arrayValues[maxValue]))
            if (indexOfClosestNumber !== -1) {
                setMinValue(indexOfClosestNumber);
            }
        }
        else {
            setErrorMessage('Minimum price cannot be greater than Maximum price')
        }
    }



    const handleMaxPriceChange = (value) => {
        setStringValues({ ...stringValues, priceMax: String(value) });
        if (value < arrayValues[minValue]) {
            setErrorMessage('Maximum price cannot be less than Minimum price')
        }
        else {
            setErrorMessage('');
            const closestNumber = getClosestNumber(Number(value), arrayValues);
            const indexOfClosestNumber = arrayValues.indexOf(closestNumber);
            setRangeString(priceFormatter(arrayValues[minValue], value))
            if (indexOfClosestNumber !== -1) {
                setMaxValue(indexOfClosestNumber);
            }
        }
    }

    const onDonePressed = () => {
        onModalPriceDonePressed(minValue, maxValue)
    }

    const getClosestNumber = (num, array) => {
        let curr = array[0];
        array.forEach(val => {
            if (Math.abs(num - val) < Math.abs(num - curr))
                curr = val
        });
        return curr
    }



    const removeCommas = (symbol, str) => {
        if (str) {
            var newString = "";
            for (var i = 0; i < str.length; i++) {
                var char = str.charAt(i);
                if (char != symbol) {
                    newString = newString + char;
                }
            }
            return newString;
        }
    }

    const onModalCancel = () => {
        setMinValue(initialValue)
        setMaxValue(finalValue)
        setStringValues({ ...stringValues, priceMin: currencyConvert(arrayValues[initialValue]), priceMax: finalValue === arrayValues.length - 1 ? null : currencyConvert(arrayValues[finalValue]) })
        setRangeString(helper.convertPriceToString(initialValue, finalValue, arrayValues.length - 1, arrayValues))
        onModalCancelPressed();
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalMain}>
                <Text style={styles.textStyle}>{rangeString}</Text>
                <PriceSlider
                    initialValue={minValue}
                    finalValue={maxValue}
                    priceValues={arrayValues}
                    onSliderValueChange={(values) => onSliderValueChange(values)} />

                <View style={[AppStyles.multiFormInput, AppStyles.mainInputWrap, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextInput
                        ref={priceMinInput}
                        placeholder={'Any'}
                        value={stringValues.priceMin}
                        onBlur={() => setStringValues({ ...stringValues, priceMin: currencyConvert(stringValues.priceMin) })}
                        onFocus={() => setStringValues({ ...stringValues, priceMin: removeCommas(',', stringValues.priceMin) })}
                        onChangeText={(text) => handleMinPriceChange(text)}
                        placeholderTextColor="#96999E"
                        style={[AppStyles.formControl, styles.priceStyle]}
                    />
                    <TextInput
                        placeholder={'Any'}
                        value={stringValues.priceMax}
                        onBlur={() => setStringValues({ ...stringValues, priceMax: currencyConvert(stringValues.priceMax) })}
                        onFocus={() => setStringValues({ ...stringValues, priceMax: removeCommas(',', stringValues.priceMax) })}
                        placeholderTextColor="#96999E"
                        onChangeText={(text) => handleMaxPriceChange(text)}
                        style={[AppStyles.formControl, styles.priceStyle]}
                    />
                </View>
                {
                    errorMessage ? <ErrorMessage errorMessage={errorMessage} /> : null
                }

                <View style={styles.buttonsContainer}>
                    <TouchableButton containerStyle={[styles.buttonCommonStyle, styles.cancelButton]}
                        containerBackgroundColor={AppStyles.whiteColor.color}
                        label={'Cancel'}
                        fontFamily={AppStyles.fonts.boldFont}
                        textColor={AppStyles.colors.primaryColor}
                        fontSize={18}
                        onPress={() => onModalCancel()} />
                    <TouchableButton
                        containerStyle={[styles.buttonCommonStyle, styles.doneButton]}
                        label={'Done'}
                        fontFamily={AppStyles.fonts.boldFont}
                        fontSize={18}
                        onPress={() => onDonePressed()} />
                </View>
            </View>
        </Modal>
    );
}

export default PriceSliderModal

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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
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
    priceStyle: {
        width: '45%',
        textAlign: 'center'
    },
})
