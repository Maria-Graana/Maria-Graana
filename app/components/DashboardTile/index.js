import React from 'react';
import { TouchableOpacity, Dimensions, Image } from 'react-native';
import { StyleSheet } from 'react-native';

class DashboardTile extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { label, image } = this.props

        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.navigateTo(label)}>
                <Image source={image} style={styles.tileImage} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5
    },
    tileImage: {
        width: Math.round(Dimensions.get('window').width),
        height: 250,
        resizeMode: "contain",
    }
})

export default DashboardTile;