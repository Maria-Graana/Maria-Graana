import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import AppStyles from '../../AppStyles';
import styles from './style';

class LandingTile extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { imagePath, label, screenName, navigateFunction, pagePath, badges } = this.props
        return (
            <TouchableOpacity
                onPress={() => navigateFunction(pagePath, screenName)}
                style={styles.squareContainer}>
                <View style={styles.tileView}>
                    <Image source={imagePath} style={styles.containerImg} />
                    {
                        badges && badges !== 0 ?
                            <View style={styles.badgeView}>
                                <Text style={styles.badgeText}>{badges}</Text>
                            </View>
                            :
                            null
                    }
                </View>
                <View style={styles.headView}>
                    <Text style={styles.headingText}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default LandingTile;