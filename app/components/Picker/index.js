/** @format */

import React from 'react'
import { Platform, View } from 'react-native'
import { Item, Picker } from 'native-base'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'

class PickerComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTask: 'Select',
    }
  }

  onChange = (itemValue, itemIndex, name) => {
    if (itemValue !== this.props.placeholder) {
      this.props.onValueChange(itemValue, name)
    }
    this.setState({
      selectedTask: itemValue === '' ? 'Select' : itemValue,
    })
  }

  render() {
    const {
      data,
      placeholder,
      selectedItem,
      name,
      customStyle,
      customIconStyle,
      clearOnChange,
      enabled = true,
      showPickerArrow = true,
    } = this.props
    const items = data || []

    let pickerItems = []
    let clearOnChangeProp = clearOnChange || false
    const placeholderLabel = placeholder || 'Select'
    let selectedValue =
      selectedItem === undefined || selectedItem === ''
        ? null
        : selectedItem || this.state.selectedTask
    if (clearOnChangeProp) selectedValue = selectedItem

    if (Platform.OS == 'android') {
      pickerItems.push(
        <Picker.Item
          key={0}
          value={placeholderLabel}
          label={placeholderLabel}
          color={AppStyles.colors.subTextColor}
          style={styles.paddingPicker}
        />
      )
    }

    if (items.length) {
      data.map((item, key) => {
        let pickerItem = <Picker.Item key={key} value={item.value} label={item.name} />
        pickerItems.push(pickerItem)
      })
    }
    return (
      <View style={[styles.pickerMain, { backgroundColor: '#fff',}]}>
        {showPickerArrow && (
          <Ionicons
            style={[styles.arrowIcon, customIconStyle]}
            name="chevron-down-outline"
            size={26}
            color={AppStyles.colors.subTextColor}
          />
        )}

        <Picker
          headerStyle={{ backgroundColor: AppStyles.colors.primaryColor, borderColor: '#fff' }}
          headerBackButtonTextStyle={{ color: '#fff' }}
          headerTitleStyle={{ color: '#fff' }}
          textStyle={[AppStyles.formFontSettings]}
          // mode='dialog'
          mode="dropdown"
          enabled={enabled}
          style={[
            AppStyles.formControlForPicker,
            { backgroundColor: enabled ? '#fff' : '#ddd' },
            customStyle,
          ]}
          placeholder={placeholderLabel}
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => this.onChange(itemValue, itemIndex, name)}
        >
          {pickerItems}
        </Picker>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pickerMain: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 4,
  },
  arrowIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
    zIndex: 2,
  },
})

export default PickerComponent
