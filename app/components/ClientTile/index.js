import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppStyles from '../../AppStyles';
import UserAvatar from 'react-native-user-avatar';
import Ability from '../../hoc/Ability';
import { connect } from 'react-redux';
import Avatar from '../Avatar';

class CustomerTile extends React.Component {
    constructor(props) {
        super(props)
    }

    getHeading = () => {
        const { item } = this.props.data
        if (item.firstName && item.lastName && item.firstName !== '' && item.lastName !== '' ) {
            return item.firstName + ' ' + item.lastName
        } else if (item.firstName && item.firstName !== '') {
            return item.firstName
        } else {
            return item.contact1
        }
    }

    render() {
        const { item } = this.props.data
        const { user } = this.props
        let heading = this.getHeading()

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
                        <Avatar data={item}/>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                        <View>
                            <Text style={[styles.textFont, { fontSize: 15 }]}>
                                {heading}
                            </Text>
                        </View>
                        {
                            item.address !== '' ?
                                <View style={{ paddingTop: 5 }}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}>
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