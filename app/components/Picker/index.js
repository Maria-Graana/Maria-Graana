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
            placeholder,
            selectedItem,
            name,
        } = this.props;
        const items = data || [];
        let pickerItems = []
        const placeholderLabel = placeholder || 'Select'
        let selectedValue = selectedItem || this.state.selectedTask

        if (Platform.OS == 'android') {
            pickerItems.push(<Picker.Item key={0} value={placeholderLabel} label={placeholderLabel} color={AppStyles.colors.subTextColor} />)
        }

        if (items.length) {
            data.map((item, key) => {
                let pickerItem = <Picker.Item key={key} value={item.value} label={item.name} />
                pickerItems.push(pickerItem)
            })
        }

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
                    selectedValue={this.state.selectedTask != '' && selectedValue}
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
        right: 15,
        top: 12,
        zIndex: 2,
    },
})

export default PickerComponent;