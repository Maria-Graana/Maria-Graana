import React from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import helper from '../../helper';

export default class HeaderRight extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showIcon: false
        }
    }

    componentDidMount = () => {
        NetInfo.addEventListener(state => {
            console.log('state.type: ', state.type)
            if (state.type === 'none') {
                this.setState({
                    showIcon: true
                })
            } else {
                this.setState({
                    showIcon: false
                })
            }
        })
    }

    showToast = () => {
        helper.internetToast('No Internet Connection!')
    }

    render() {
        const { navigation } = this.props
        const { showIcon } = this.state
        return (
            <View style={{ flexDirection: "row" }}>
                {
                    showIcon ?
                        <TouchableOpacity onPress={() => { this.showToast() }}>
                            <AntDesign name="warning" size={30} color="#FF9631" style={styles.icon} />
                        </TouchableOpacity>
                        :
                        null
                }
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Ionicons name="ios-menu" size={40} color="#484848" style={styles.icon} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        paddingRight: 15
    }
});