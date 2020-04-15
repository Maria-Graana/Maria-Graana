import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppStyles from '../../AppStyles';
import Avatar from '../../components/Avatar/index';

class TeamTile extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {item}= this.props.data

        return (
            <TouchableOpacity 
            activeOpacity={.7}
            onPress = { () => { this.props.onPressItem(item) }}
            >
                <View style= {{flexDirection: 'row', marginVertical: 15}}>
                    <View style={{paddingRight: 10,}}>
                        <Avatar data={item}/>
                    </View>
                    <View style= {{flexDirection: 'column'}}>
                        <View style={{paddingTop: 5}}>
                            <Text style={[styles.textFont, {fontSize: 15}]}>
                                {item.firstName} {item.lastName}
                            </Text>
                        </View>
                        <View style={{paddingTop: 5}}>
                            <Text style={[styles.textFont, {fontSize: 12, color: AppStyles.colors.subTextColor}]}>
                                {item.armsUserRole && item.armsUserRole.subRole}
                            </Text>
                        </View>
                    </View> 
                </View>
                <View style={styles.underLine}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    textFont: {
        fontFamily: AppStyles.fonts.defaultFont
    },
    underLine: {
        height: 1,
        width: "100%",
        backgroundColor: "#f5f5f6",
    }
});

export default TeamTile;
