import React from 'react';
import { Image, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';
import styles from './style';
import { LinearGradient } from 'expo-linear-gradient';
import { formatPrice } from '../../PriceFormate'

let start = { x: 0, y: 1 }
let end = { x: 1, y: 0 }
let locations = [0.2, 1.0]
let colors = ['white', 'white']

class SqaureContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { imagePath, containerStyle, label, total } = this.props
        return (
            <View
                style={[styles.squareContainer, containerStyle, {backgroundColor: 'white'}]}>
                <View>
                    <Image source={imagePath} style={styles.containerImg} />
                </View>
                <View style={styles.headView}>
                    <Text style={styles.totalText}>{total ? formatPrice(total) : formatPrice(0)}</Text>
                    <Text style={styles.headingText}>{label}</Text>
                </View>
            </View>
        )
    }
}

export default SqaureContainer;