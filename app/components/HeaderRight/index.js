import React from "react";
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class HeaderRight extends React.Component {
    constructor (props) {
        super(props)
    }
    render() {
        const {navigation}= this.props
        return (
            <TouchableOpacity onPress={() => { navigation.openDrawer() } }>
                <Ionicons name="ios-menu" size={40} color="#484848" style = {styles.icon} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        paddingRight: 15
    }
});