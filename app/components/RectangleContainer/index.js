import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';
import { LinearGradient } from 'expo-linear-gradient';

let start = { x: 0, y: 1 }
let end = { x: 1, y: 0 }
let locations = [0.2, 1.0]
let colors = ['#0036b1', '#0f73ee']

class RectangleContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { targetPercent, targetNumber, totalTarget } = this.props
        return (
            <LinearGradient
                start={start} end={end}
                colors={colors}
                locations={locations}
                style={styles.reactangle}>
                <View style={styles.viewContainer}>
                    <Text style={styles.percentNumber}>{targetPercent}<Text style={styles.percent}>%</Text></Text>
                    <Text style={[styles.headingText, { paddingHorizontal: 15 }]}>Target Achieved</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={AppStyles.mb1}>
                    <View style={styles.achievedView}>
                        <Text style={[styles.headingText]}>Target Achieved</Text>
                        <Text style={styles.headingNumber}>{targetNumber}</Text>
                    </View>
                    <View style={styles.totalView}>
                        <Text style={[styles.headingText]}>Total Target</Text>
                        <Text style={styles.headingNumber}>{totalTarget}</Text>
                    </View>
                </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    totalView: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 15
    },
    achievedView: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#ffffff',
        flex: 1,
        justifyContent: "center",
        paddingLeft: 15
    },
    headingNumber: {
        color: '#ffffff',
        fontSize: 25,
        fontFamily: AppStyles.fonts.boldFont
    },
    verticalLine: {
        height: 160,
        backgroundColor: 'white',
        borderRightWidth: 0.5,
        borderColor: '#ffffff'
    },
    viewContainer: {
        justifyContent: "center",
        flex: 1
    },
    percentNumber: {
        color: '#ffffff',
        fontSize: 50,
        fontFamily: AppStyles.fonts.boldFont,
        paddingHorizontal: 15
    },
    percent: {
        color: '#ffffff',
        fontSize: 24,
        fontFamily: AppStyles.fonts.boldFont
    },
    reactangle: {
        // justifyContent: 'space-between',
        flex: 1,
        borderWidth: 1,
        height: 160,
        borderRadius: 20,
        marginVertical: 5,
        flexDirection: "row",
        borderColor: AppStyles.colors.primaryColor
    },
    containerImg: {
        marginHorizontal: 15,
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    squareContainer: {
        flex: 1,
        borderWidth: 1,
        height: 160,
        borderRadius: 20,
        justifyContent: "space-around",
        borderColor: AppStyles.colors.primaryColor
    },
    headingText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: AppStyles.fonts.defaultFont
    },
})

export default RectangleContainer;