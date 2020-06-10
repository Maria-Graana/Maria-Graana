import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppStyles from '../../AppStyles';
import Avatar from '../../components/Avatar/index';
import helper from '../../helper'

class TeamTile extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { selected, data, selectedId } = this.props;
        const { item } = data;
        const organizationName = item.organization && item.organization.name ? item.organization.name : '';
        console.log(item);
        return (
            <TouchableOpacity
                activeOpacity={.7}
                onPress={() => { this.props.onPressItem(item) }}
            >
                <View style={selected && item.id === selectedId ? styles.selectedStyle : styles.simpleStyle}>
                    <View style={{ paddingRight: 10, }}>
                        <Avatar data={item} />
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '80%', alignItems: 'center' }}>
                                <Text style={[styles.textFont, { fontSize: 15, marginRight: 10 }]}>
                                    {item.firstName} {item.lastName}
                                </Text>
                                <Text style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}>
                                    {item.armsUserRole && item.armsUserRole.subRole}
                                </Text>
                            </View>
                            {
                                organizationName !== '' ? <Text style={[styles.textFont, {
                                    fontSize: 18, color: organizationName ===
                                        'Graana' ? 'red' : 'green' , width: '20%', textAlign: 'right'
                                }]}>
                                    {organizationName !== '' ? organizationName === 'Graana' ? 'G' : 'A' : ''}
                                </Text> : null}

                        </View>
                        {item.zone && <Text style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}>
                            {item.zone.zone_name ? helper.capitalize(item.zone.zone_name) : ''}
                        </Text>}

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
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    selectedStyle: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 10,
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
