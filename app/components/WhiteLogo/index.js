import React from "react";
import { View, Image, StyleSheet } from 'react-native';

export default class WhiteLogo extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View>
                {
                    <View style={styles.imageViewWrap}>
                        <Image source={require('../../../assets/img/logo1.png')} style={styles.imageStyle} />
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageViewWrap: {
        paddingLeft: 15,
        width: 10,
        flexDirection: 'row'
    },
    imageStyle: {
        resizeMode: "contain",
        width: 100,
        height: 100,
        tintColor: '#ffffff'
    }
});
