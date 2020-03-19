import React from 'react'
import {
    Platform, View
} from 'react-native'
import { Item, Picker } from 'native-base';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppStyles from '../../AppStyles'


class PickerComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTask: 'Select'
        }
    }

    onChange = (itemValue, itemIndex) => {
        if (itemValue !== this.props.placeholder) {
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
        const ItemWrap = itemStyle || styles.itemWrap
        const PickerWrap = pickerStyle || styles.pickerWrap
        const selectedValue = selectedItem || this.state.selectedTask

        if (Platform.OS == 'android') {
            serviceItems.push(<Picker.Item key={0} value={placeholderLabel} label={placeholderLabel} />)
        }
        for (let i = 0; i < items.length; i++) {
            let item = <Picker.Item key={i + 1} value={items[i]} label={items[i]} />
            serviceItems.push(item)
        }
        return (
            <View style={[styles.pickerMain]}>
                <Ionicons style={styles.arrowIcon} name="ios-arrow-down" color={AppStyles.colors.textColor} />
                <Picker
                    // headerStyle={{ backgroundColor: AppStyles.colors.primaryColor, borderColor: '#fff', }}
                    headerBackButtonTextStyle={{ color: '#fff' }}
                    // headerTitleStyle={{ color: "#fff" }}
                    mode="dropdown"
                    style={AppStyles.formControlForPicker}
                    placeholder={placeholderLabel}
                    selectedValue={selectedValue.toString()}
                    onValueChange={(itemValue, itemIndex) =>
                        this.onChange(itemValue, itemIndex)
                    }
                >
                    {serviceItems}
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
    arrowIcon:{
        position: 'absolute',
        right: 15,
        top: 17,
        fontSize: 16,
        zIndex: 2,
    },
})

export default PickerComponent;