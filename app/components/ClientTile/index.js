import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AppStyles from '../../AppStyles';
import UserAvatar from 'react-native-user-avatar';

class CustomerTile extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {item}= this.props.data
        return (
            <TouchableOpacity 
            activeOpacity={.7}
            onPress = { () => {  }}
            >
                <View style= {{flexDirection: 'row', marginVertical: 15}}>
                    <View style={{paddingRight: 10}}>
                        <UserAvatar  size="50" src='https://pickaface.net/gallery/avatar/unr_ironman_170308_2112_9ldw5b.png' name={`${item.name}`}/>
                    </View>
                    <View style= {{flexDirection: 'column'}}>
                        <View>
                            <Text style={[styles.textFont, {fontSize: 15}]}>
                                {item.firstName} {item.lastName}
                            </Text>
                        </View>
                        <View style={{paddingTop: 5}}>
                            <Text style={[styles.textFont, {fontSize: 12, color: AppStyles.colors.subTextColor}]}>
                                {/* {item.armsUserRole.subRole}  */}  s
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

export default CustomerTile;
