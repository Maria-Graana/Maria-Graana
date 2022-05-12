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
import PickerComponent from '../Picker'

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

const setSizeUnitList = (sizeUnit) => {
  let sizeList = []
  if (sizeUnit === 'marla') sizeList = StaticData.sizeMarla
  if (sizeUnit === 'kanal') sizeList = StaticData.sizeKanal
  if (sizeUnit === 'sqft') sizeList = StaticData.sizeSqft
  if (sizeUnit === 'acre') sizeList = StaticData.sizeAcre
  if (sizeUnit === 'sqyd' || sizeUnit === 'sqm') sizeList = StaticData.sizeSqm
  return sizeList
}

const SizeSliderModal = ({
  isVisible,
  initialValue,
  finalValue,
  sizeUnit,
  onModalCancelPressed,
  onModalSizeDonePressed,
}) => {
  const [minValue, setMinValue] = useState(initialValue)
  const [maxValue, setMaxValue] = useState(finalValue)
  const [stringValues, setStringValues] = useState({
    sizeMin: currencyConvert(initialValue),
    sizeMax: currencyConvert(finalValue),
  })
  const [unit, setUnit] = useState(sizeUnit)
  const [arrayValues, setArrayValues] = useState(setSizeUnitList(unit))
  const [rangeString, setRangeString] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setMinValue(initialValue)
    setMaxValue(finalValue)
    setStringValues({
      ...stringValues,
      sizeMin:
        initialValue === StaticData.Constants.size_any_value ? null : currencyConvert(initialValue),
      sizeMax:
        finalValue === StaticData.Constants.size_any_value ? null : currencyConvert(finalValue),
    })
    setRangeString(
      helper.convertSizeToString(
        initialValue,
        finalValue,
        StaticData.Constants.size_any_value,
        sizeUnit
      )
    )
  }, [initialValue, finalValue])

  useEffect(() => {
    setUnit(sizeUnit)
  }, [sizeUnit])

  const onSliderValueChange = (values) => {
    const start = values[0]
    const end = values[values.length - 1]
    setMinValue(arrayValues[start])
    setMaxValue(arrayValues[end])
    setStringValues({
      ...stringValues,
      sizeMin:
        arrayValues[start] === arrayValues[arrayValues.length - 1]
          ? null
          : String(arrayValues[start]),
      sizeMax:
        arrayValues[end] === arrayValues[arrayValues.length - 1] ? null : String(arrayValues[end]),
    })
    setRangeString(
      helper.convertSizeToString(
        arrayValues[start],
        arrayValues[end],
        StaticData.Constants.size_any_value,
        unit
      )
    )
  }

  const handleMinSizeChange = (value) => {
    setStringValues({ ...stringValues, sizeMin: String(value) })
    setRangeString(
      helper.convertSizeToString(value, maxValue, StaticData.Constants.size_any_value, unit)
    )
    setMinValue(value)
  }

  const handleMaxSizeChange = (value) => {
    setStringValues({ ...stringValues, sizeMax: String(value) })
    setRangeString(
      helper.convertSizeToString(minValue, value, StaticData.Constants.size_any_value, unit)
    )
    setMaxValue(value)
  }

  const onSizeChange = (value) => {
    let sizeUnitList = setSizeUnitList(value)
    setUnit(value)
    setArrayValues(sizeUnitList)
    let minSize = sizeUnitList[0]
    let maxSize = sizeUnitList[sizeUnitList.length - 1]
    setMinValue(minSize)
    setMaxValue(maxSize)
    setRangeString(
      helper.convertSizeToString(minSize, maxSize, StaticData.Constants.size_any_value, value)
    )
    setStringValues({
      ...stringValues,
      sizeMin: minSize === arrayValues[arrayValues.length - 1] ? null : String(minSize),
      sizeMax: maxSize === arrayValues[arrayValues.length - 1] ? null : String(maxSize),
    })
  }

  const onDonePressed = () => {
    const finalMinValue = stringValues.sizeMin
      ? Number(removeCommas(stringValues.sizeMin))
      : StaticData.Constants.size_any_value
    const finalMaxValue = stringValues.sizeMax
      ? Number(removeCommas(stringValues.sizeMax))
      : StaticData.Constants.size_any_value
    if (finalMinValue > finalMaxValue) {
      setErrorMessage('Minimum size cannot be greater than Maximum size')
      return
    } else {
      onModalSizeDonePressed(finalMinValue, finalMaxValue, unit)
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
      sizeMin:
        initialValue === StaticData.Constants.size_any_value ? null : currencyConvert(initialValue),
      sizeMax:
        finalValue === StaticData.Constants.size_any_value ? null : currencyConvert(finalValue),
    })
    setRangeString(
      helper.convertSizeToString(
        initialValue,
        finalValue,
        StaticData.Constants.size_any_value,
        unit
      )
    )
    onModalCancelPressed()
  }

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalMain}>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={(value) => onSizeChange(value)}
              selectedItem={unit}
              data={StaticData.sizeUnit}
              placeholder="Unit Size"
            />
          </View>
        </View>
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
            placeholder={'Any'}
            value={stringValues.sizeMin}
            onBlur={() =>
              setStringValues({
                ...stringValues,
                sizeMin: stringValues.sizeMin ? currencyConvert(stringValues.sizeMin) : '',
              })
            }
            onFocus={() =>
              setStringValues({
                ...stringValues,
                sizeMin: stringValues.sizeMin ? removeCommas(stringValues.sizeMin) : '',
              })
            }
            onChangeText={(text) => handleMinSizeChange(text)}
            placeholderTextColor="#96999E"
            style={[AppStyles.formControl, styles.priceStyle]}
          />
          <TextInput
            placeholder={'Any'}
            value={stringValues.sizeMax}
            onBlur={() =>
              setStringValues({
                ...stringValues,
                sizeMax: stringValues.sizeMax ? currencyConvert(stringValues.sizeMax) : '',
              })
            }
            onFocus={() =>
              setStringValues({
                ...stringValues,
                sizeMax: stringValues.sizeMax ? removeCommas(stringValues.sizeMax) : '',
              })
            }
            placeholderTextColor="#96999E"
            onChangeText={(text) => handleMaxSizeChange(text)}
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

export default SizeSliderModal

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
