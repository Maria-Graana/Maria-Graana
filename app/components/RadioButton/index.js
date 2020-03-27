import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';



class RadioComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value
        }
    }

    onChange = () => {
        this.props.onGradeSelected(this.state.value)
    }

    render() {
        const {
            selected
        } = this.props;

        return (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={(value) => { this.onChange(value) }}>
                <View style={[styles.outerCircle]}>
                    {
                        selected ?
                            <View style={styles.innerCircle} />
                            : null
                    }
                </View>
                <Text style={{ paddingLeft: 10 }}>{this.props.children}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppStyles.whiteColor.color,
        borderColor: AppStyles.colors.textColor
    },
    innerCircle: {
        height: 13,
        width: 13,
        borderRadius: 6,
        backgroundColor: AppStyles.colors.primaryColor
    }
})

export default RadioComponent;