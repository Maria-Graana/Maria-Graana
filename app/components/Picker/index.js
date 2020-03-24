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

    onChange = (itemValue, itemIndex, name) => {
        if (itemValue !== this.props.placeholder) {
            this.props.onValueChange(itemValue, name)
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
            selectedItem,
            name,
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

        // for (let i = 0; i < items.length; i++) {
        //     let item = <Picker.Item key={i + 1} value={items[i]} label={items[i]} />
        //     serviceItems.push(item)
        //     console.log('item********',item)
        // }
        return (
            <View style={[styles.pickerMain]}>
                <Ionicons style={styles.arrowIcon} name="ios-arrow-down" size={26} color={AppStyles.colors.subTextColor} />
                <Picker
                    headerStyle={{ backgroundColor: AppStyles.colors.primaryColor, borderColor: '#fff', }}
                    headerBackButtonTextStyle={{ color: '#fff' }}
                    headerTitleStyle={{ color: "#fff" }}
                    textStyle={[AppStyles.pickerTextStyle, AppStyles.formFontSettings]}
                    headerTitleStyle={{ color: "#fff" }}
                    mode="dropdown"
                    style={AppStyles.formControlForPicker}
                    placeholder={placeholderLabel}
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, itemIndex) => this.onChange(itemValue, itemIndex, name)}
                >
                    {data && data.map((item, key) => {
                        return (
                            <Picker.Item key={key} value={item.id} label={item.name} key={key}/>
                        )
                    })}
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
        right: 15,
        top: 12,
        zIndex: 2,
    },
})

export default PickerComponent;