import React from 'react';
import { Text, View, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';
import { LinearGradient } from 'expo-linear-gradient';
import comissionRevenueImg from '../../../assets/img/commission-revenue-icon.png';

let start = { x: 0, y: 1 }
let end = { x: 1, y: 0 }
let locations = [0.2, 1.0]
let colors = ['#0036b1', '#0f73ee']

class RectangleDaily extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { targetNumber } = this.props

        return (
            <LinearGradient
                start={start} end={end}
                colors={colors}
                locations={locations}
                style={[styles.squareContainer]}>
                <View>
                    <Image source={comissionRevenueImg} style={styles.containerImg} />
                </View>
                <View style={styles.headView}>
                    <Text style={styles.totalText}>{targetNumber ? targetNumber : 0}</Text>
                    <Text style={styles.headingText}>Revenue</Text>
                </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    headView: {
        justifyContent: "center",
        paddingHorizontal: 15
    },
    totalText: {
        color: '#ffffff',
        fontSize: 25,
        fontFamily: AppStyles.fonts.semiBoldFont
    },
    containerImg: {
        marginHorizontal: 15,
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    squareContainer: {
        marginHorizontal: 10,
        flex: 1,
        height: 160,
        borderRadius: 20,
        justifyContent: "space-around",
    },
    headingText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: AppStyles.fonts.defaultFont
    },
    reactangle: {
        justifyContent: 'space-between',
        flex: 1,
        height: 160,
        borderRadius: 20,
        marginVertical: 5,
        padding: 10
    },
})

export default RectangleDaily;