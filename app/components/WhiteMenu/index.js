import React from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import helper from '../../helper';
import { connect } from 'react-redux';

class WhiteMenu extends React.Component {
    constructor(props) {
        super(props)
    }

    showToast = () => { helper.internetToast('No Internet Connection!') }

    render() {
        const { navigation, isInternetConnected } = this.props
        return (
            <View style={{ flexDirection: "row" }} >
                {
                    !isInternetConnected ?
                        <TouchableOpacity onPress={() => {
                            this.showToast()
                        }}>
                            <AntDesign name="warning" size={30} color="#FF9631" style={styles.icon} />
                        </TouchableOpacity >
                        :
                        null
                }
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Ionicons name="ios-menu" size={40} color="#ffffff" style={styles.icon} />
                </TouchableOpacity>
            </View >
        )
    }
}

mapStateToProps = (store) => {
    return {
        isInternetConnected: store.user.isInternetConnected,
    }
}


const styles = StyleSheet.create({
    icon: {
        paddingRight: 15
    }
});

export default connect(mapStateToProps)(WhiteMenu)