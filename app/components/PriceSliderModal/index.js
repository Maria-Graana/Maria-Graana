/** @format */

import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import PriceSlider from '../PriceSlider'
import Modal from 'react-native-modal'
import TouchableButton from '../TouchableButton'
import ErrorMessage from '../ErrorMessage'
import helper from '../../helper'
import AppStyles from '../../AppStyles'
import StaticData from '../../StaticData'

const currencyConvert = (x) => {
  if (x !== null || x !== undefined) {
    x = x.toString()
    var lastThree = x.substring(x.length - 3)
    var otherNumbers = x.substring(0, x.length - 3)
    if (otherNumbers != '') lastThree = ',' + lastThree
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
    return res
  }
}

const PriceSliderModal = ({
  isVisible,
  initialValue,
  finalValue,
  arrayValues,
  onModalCancelPressed,
  onModalPriceDonePressed,
}) => {
  const [minValue, setMinValue] = useState(initialValue)
  const [maxValue, setMaxValue] = useState(finalValue)
  const [stringValues, setStringValues] = useState({
    priceMin: currencyConvert(initialValue),
    priceMax: currencyConvert(finalValue),
  })

  const [rangeString, setRangeString] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setMinValue(initialValue)
    setMaxValue(finalValue)
    setStringValues({
      ...stringValues,
      priceMin:
        initialValue === StaticData.Constants.any_value ? null : currencyConvert(initialValue),
      priceMax: finalValue === StaticData.Constants.any_value ? null : currencyConvert(finalValue),
    })
    setRangeString(
      helper.convertPriceToString(initialValue, finalValue, arrayValues[arrayValues.length - 1])
    )
  }, [initialValue, finalValue])

  const onSliderValueChange = (values) => {
    const start = values[0]
    const end = values[values.length - 1]
    setMinValue(arrayValues[start])
    setMaxValue(arrayValues[end])
    setStringValues({
      ...stringValues,
      priceMin:
        arrayValues[start] === arrayValues[arrayValues.length - 1]
          ? null
          : String(arrayValues[start]),
      priceMax:
        arrayValues[end] === arrayValues[arrayValues.length - 1] ? null : String(arrayValues[end]),
    })
    setRangeString(
      helper.convertPriceToString(
        arrayValues[start],
        arrayValues[end],
        arrayValues[arrayValues.length - 1]
      )
    )
  }

  const handleMinPriceChange = (value) => {
    setStringValues({ ...stringValues, priceMin: String(value) })
    setRangeString(
      helper.convertPriceToString(value, maxValue, arrayValues[arrayValues.length - 1])
    )
    const closestNumber = getClosestNumber(Number(value), arrayValues)
    if (closestNumber) {
      setMinValue(closestNumber)
    }
  }

  const handleMaxPriceChange = (value) => {
    setStringValues({ ...stringValues, priceMax: String(value) })
    setRangeString(
      helper.convertPriceToString(minValue, value, arrayValues[arrayValues.length - 1])
    )
    const closestNumber = getClosestNumber(Number(value), arrayValues)
    if (closestNumber) {
      setMaxValue(closestNumber)
    }
  }

  const onDonePressed = () => {
    const finalMinValue = stringValues.priceMin
      ? Number(removeCommas(stringValues.priceMin))
      : StaticData.Constants.any_value
    const finalMaxValue = stringValues.priceMax
      ? Number(removeCommas(stringValues.priceMax))
      : StaticData.Constants.any_value
    if (finalMinValue > finalMaxValue) {
      setErrorMessage('Minimum price cannot be greater than Maximum price')
      return
    } else {
      onModalPriceDonePressed(finalMinValue, finalMaxValue)
      setErrorMessage('')
    }
  }

  const getClosestNumber = (num, array) => {
    let curr = array[0]
    array.forEach((val) => {
      if (Math.abs(num - val) < Math.abs(num - curr)) curr = val
    })
    return curr
  }

  const removeCommas = (str) => {
    let newString = str.replace(/,/g, '')
    return newString
  }

  const onModalCancel = () => {
    setMinValue(initialValue)
    setMaxValue(finalValue)
    setErrorMessage('')
    setStringValues({
      ...stringValues,
      priceMin:
        initialValue === StaticData.Constants.any_value ? null : currencyConvert(initialValue),
      priceMax: finalValue === StaticData.Constants.any_value ? null : currencyConvert(finalValue),
    })
    setRangeString(
      helper.convertPriceToString(initialValue, finalValue, arrayValues[arrayValues.length - 1])
    )
    onModalCancelPressed()
  }

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalMain}>
        <Text style={styles.textStyle}>{rangeString}</Text>
        <PriceSlider
          initialValue={arrayValues.indexOf(getClosestNumber(minValue, arrayValues))}
          finalValue={arrayValues.indexOf(getClosestNumber(maxValue, arrayValues))}
          allowOverlap={minValue !== arrayValues[arrayValues.length - 2]}
          priceValues={arrayValues}
          onSliderValueChange={(values) => onSliderValueChange(values)}
        />

        <View
          style={[
            AppStyles.multiFormInput,
            AppStyles.mainInputWrap,
            { justifyContent: 'space-between', alignItems: 'center' },
          ]}
        >
          <TextInput
            keyboardType={'phone-pad'}
            placeholder={'Any'}
            value={stringValues.priceMin}
            onBlur={() =>
              setStringValues({
                ...stringValues,
                priceMin: stringValues.priceMin ? currencyConvert(stringValues.priceMin) : '',
              })
            }
            onFocus={() =>
              setStringValues({
                ...stringValues,
                priceMin: stringValues.priceMin ? removeCommas(stringValues.priceMin) : '',
              })
            }
            onChangeText={(text) => handleMinPriceChange(text)}
            placeholderTextColor="#96999E"
            style={[AppStyles.formControl, styles.priceStyle]}
          />
          <TextInput
            keyboardType={'phone-pad'}
            placeholder={'Any'}
            value={stringValues.priceMax}
            onBlur={() =>
              setStringValues({
                ...stringValues,
                priceMax: stringValues.priceMax ? currencyConvert(stringValues.priceMax) : '',
              })
            }
            onFocus={() =>
              setStringValues({
                ...stringValues,
                priceMax: stringValues.priceMax ? removeCommas(stringValues.priceMax) : '',
              })
            }
            placeholderTextColor="#96999E"
            onChangeText={(text) => handleMaxPriceChange(text)}
            style={[AppStyles.formControl, styles.priceStyle]}
          />
        </View>
        {errorMessage ? <ErrorMessage errorMessage={errorMessage} /> : null}

        <View style={styles.buttonsContainer}>
          <TouchableButton
            containerStyle={[styles.buttonCommonStyle, styles.cancelButton]}
            containerBackgroundColor={AppStyles.whiteColor.color}
            label={'Cancel'}
            fontFamily={AppStyles.fonts.boldFont}
            textColor={AppStyles.colors.primaryColor}
            fontSize={18}
            onPress={() => onModalCancel()}
          />
          <TouchableButton
            containerStyle={[styles.buttonCommonStyle, styles.doneButton]}
            label={'Done'}
            fontFamily={AppStyles.fonts.boldFont}
            fontSize={18}
            onPress={() => onDonePressed()}
          />
        </View>
      </View>
    </Modal>
  )
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
    textAlign: 'center',
  },
})
