import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export default class HeaderBackground extends React.Component {
    constructor (props) {
        super(props)
    }
    
    render() {
        return (
            <LinearGradient
                colors={['#ffffff', '#ffffff']}
                style={styles.container}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: 'transparent'
    }
});