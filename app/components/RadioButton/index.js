import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { StyleSheet } from 'react-native';



class RadioComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
        value: this.props.value
    }
  }

  onChange = () => {
    this.props.selectedButton(this.state.value)
  }

    render() {
        const {
            placeholder,
            selected
        } = this.props;

        const placeholderLabel = placeholder || 'Select';
        return (
            <TouchableOpacity onPress= {(value)=> {this.onChange(value)}}>
                <View style={[styles.outerCircle]}>
                {
                    selected ?
                    <View style={styles.innerCircle}/>
                    : null
                }
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#484848'
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#484848'
    }
})

export default RadioComponent;