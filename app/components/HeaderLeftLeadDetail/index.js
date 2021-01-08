import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from "../../actions/lead";

export default class HeaderLeftLeadDetail extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {lead, type, fromScreen} = this.props.route.params;
        const {navigation} = this.props;
        return (
            <View>
                <View style={styles.viewWrap}>

                    <TouchableOpacity onPress={() => {
                        navigation.setParams({ goBack: null, isFromLeadWorkflow: false, type: null, fromScreen: null })
                        goBack({lead, type, fromScreen, navigation})
                    }}>
                        <Ionicons name="ios-arrow-round-back" color="#484848" size={40} style={styles.iconWrap} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewWrap: {
        paddingLeft: 15,
        width: 40,
    },
    iconWrap: {
        paddingLeft: 5
    },
    imageViewWrap: {
        paddingLeft: 15,
        width: 10,
        flexDirection: 'row'
    },
    imageStyle: {
        resizeMode: "contain",
        width: 100,
        height: 100
    }
});
