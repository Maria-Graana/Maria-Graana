import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AppStyles from '../../AppStyles';
import UserAvatar from 'react-native-user-avatar';
import Ability from '../../hoc/Ability';
import { connect } from 'react-redux';

class CustomerTile extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { item } = this.props.data
        const { user } = this.props
        return (
            <TouchableOpacity
                activeOpacity={.7}
                onPress={() => { this.props.onPress(item) }}
                onLongPress={(val) => {
                    if (Ability.canDelete(user.role, 'Client')) this.props.handleLongPress(item)
                }}
            >
                <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                    <View style={{ paddingRight: 10 }}>
                        <UserAvatar size="50" name={item.firstName + ' ' + item.lastName} />
                    </View>
                    <View style={{ flexDirection: 'column',justifyContent:'center' }}>
                        <View>
                            <Text style={[styles.textFont, { fontSize: 15 }]}>
                                {item.firstName} {item.lastName}
                            </Text>
                        </View>
                        {
                            item.address !== '' ?
                                <View style={{ paddingTop: 5 }}>
                                    <Text style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}>
                                        {item.address}
                                    </Text>
                                </View>
                                : null
                        }

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

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(CustomerTile)