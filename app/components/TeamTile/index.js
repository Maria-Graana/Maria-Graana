import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppStyles from '../../AppStyles';
import Avatar from '../../components/Avatar/index';
import helper from '../../helper'

const checkTeamNameAndRegion = (item) => {
    if (item.armsTeam && item.region) {
        return `${helper.capitalize(item.armsTeam.teamName)}, ${item.region.name}`
    }
    else if (item.armsTeam) {
        return helper.capitalize(item.armsTeam.teamName)
    }
    else if (item.region) {
        return item.region.name
    }
    else {
        return '';
    }
}

class TeamTile extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { selected, data, selectedId } = this.props;
        const { item } = data;
        const organizationName = item.organization && item.organization.name ? item.organization.name : '';
        let teamNameAndRegion = checkTeamNameAndRegion(item);
        return (
            <TouchableOpacity
                activeOpacity={.7}
                onPress={() => { this.props.onPressItem(item) }}
            >
                <View style={selected && item.id === selectedId ? styles.selectedStyle : styles.simpleStyle}>
                    <View style={{ paddingRight: 10, }}>
                        <Avatar data={item} />
                    </View>
                    <View style={styles.mainRowContainer}>
                        <View style={styles.horizontalRowContainer}>
                            <View style={styles.titleSubtitleContainer}>
                                <Text style={[styles.textFont, { fontSize: 15, marginRight: 10 }]}>
                                    {item.firstName} {item.lastName}
                                </Text>
                                <Text style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}>
                                    {item.title && helper.capitalize(item.title)}
                                </Text>
                            </View>
                            {
                                organizationName !== '' ? <Text style={[styles.textFont, {
                                    fontSize: 18, color: organizationName ===
                                        'Graana' ? 'red' : 'green', width: '20%', textAlign: 'right'
                                }]}>
                                    {organizationName !== '' ? organizationName === 'Graana' ? 'G' : 'A' : ''}
                                </Text> : null}

                        </View>
                        {teamNameAndRegion !== '' && <Text style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}>
                            {teamNameAndRegion}
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
    },
    mainRowContainer:{
        flexDirection: 'column', 
        flex: 1, 
        justifyContent: 'center' 
    },
    horizontalRowContainer: {
        flexDirection: 'row', 
        width: '100%', 
        marginBottom: 5, 
        alignItems: 'center'
    },
    titleSubtitleContainer: {
        flexDirection: 'row', 
        width: '80%', 
        alignItems: 'center'
    }
});

export default TeamTile;
