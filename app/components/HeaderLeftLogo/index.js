import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class HeaderLeftLogo extends React.Component {
    constructor (props) {
        super(props)
    }
    render() {
        const {navigation}= this.props
        const {leftBool}= this.props
        return (
            <View>
                {
                    leftBool ?
                    <View style={styles.viewWrap}>
                        <TouchableOpacity onPress={() => navigation.pop()}>
                            <Ionicons name="ios-arrow-round-back"  color="#484848" size={40} style = {styles.iconWrap} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.imageViewWrap}>
                        <Image source={require('../../../assets/images/logo.png')} style={styles.imageStyle} />
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewWrap: {
        paddingLeft: 5, 
        width: 40
    },
    iconWrap: {
        paddingLeft: 5
    },
    imageViewWrap: {
        paddingLeft: 10, 
        width: 10, 
        flexDirection: 'row'
    },
    imageStyle: {
        resizeMode: "contain", 
        width: 100, 
        tintColor: '#484848', 
        height: 100
    }
});
