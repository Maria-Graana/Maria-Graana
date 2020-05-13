import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppStyles from '../../AppStyles';
import Avatar from '../../components/Avatar/index';

class TeamTile extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { selected, data, selectedId } = this.props;
        const { item } = data;

        return (
            <TouchableOpacity
                activeOpacity={.7}
                onPress={() => { this.props.onPressItem(item) }}
            >
                <View style={selected && item.id === selectedId ? styles.selectedStyle : styles.simpleStyle}>
                    <View style={{ paddingRight: 10, }}>
                        <Avatar data={item} />
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={[styles.textFont, { fontSize: 15 }]}>
                                {item.firstName} {item.lastName}
                            </Text>
                        </View>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}>
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
    simpleStyle: {
        flexDirection: 'row',
        paddingVertical:10,
        paddingHorizontal:5
    },
    selectedStyle: {
        flexDirection: 'row',
        paddingVertical:10,
        paddingHorizontal:5,
        backgroundColor: AppStyles.colors.backgroundColor
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
