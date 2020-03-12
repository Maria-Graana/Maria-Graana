import React from 'react'
import {
    Platform, View
} from 'react-native'
import {Item, Picker } from 'native-base';
import { StyleSheet } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';


class PickerComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
        selectedTask: 'Select'
    }
  }

  onChange = (itemValue, itemIndex) => {
    if(itemValue !== this.props.placeholder) {
        this.props.onValueChange(itemValue)
    }
    this.setState({
        selectedTask: itemValue
    })
  }

  render() {
    const {
        data,
        value,
        placeholder,
        container,
        itemStyle,
        pickerStyle,
        selectedItem
    } = this.props;
    const items = data || [];
    let serviceItems = []
    const placeholderLabel = placeholder || 'Select'
    const ItemWrap= itemStyle || styles.itemWrap
    const PickerWrap= pickerStyle || styles.pickerWrap
    const selectedValue= selectedItem || this.state.selectedTask

    if(Platform.OS == 'android') {
        serviceItems.push(<Picker.Item key={0} value={placeholderLabel} label={placeholderLabel} />)
    }
    for (let i = 0; i < items.length; i++) {
        let item =  <Picker.Item key={i+1} value={items[i]} label={items[i]} />
        serviceItems.push(item)
    }
    return (
        <View style={ItemWrap}>
            <Picker
                headerStyle={{ backgroundColor: "#484848", borderColor: "#484848", }}
                headerTitleStyle={{ color: "#fff" }}
                mode="dropdown"
                iosIcon={<EvilIcons name="arrow-down" />}
                style={PickerWrap}
                placeholder= {placeholderLabel}
                selectedValue={selectedValue.toString()}
                onValueChange={(itemValue, itemIndex) =>
                    this.onChange(itemValue, itemIndex)
                }
            >
                {serviceItems}
            </Picker>
        </View>
    )}
}

const styles = StyleSheet.create({
    itemWrap: {
        backgroundColor: '#ffffff', 
        borderRadius: 5,
        marginVertical : 10,
        borderBottomWidth: 1,
        minHeight: 60,
        borderColor: '#f0f0f0',
        // flex:1
    },
    pickerWrap: {
        width: undefined, 
        minHeight: 60,
        // paddingTop: Platform.OS ? 10 : 3,
        // paddingBottom: Platform.OS ? 14 : 10
    }
})

export default PickerComponent;