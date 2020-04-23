import React from "react";
import { View, Text, StyleSheet, } from "react-native";
import AppStyles from '../../AppStyles';
import { connect } from 'react-redux';

class Avatar extends React.Component {
    constructor(props) {
        super(props)
    }

    getAvatar = (data) => {
        if (data.firstName && data.lastName && data.firstName !== '' && data.lastName !== '') {
            let name = data.firstName[0] + data.lastName[0]
            return name.toLocaleUpperCase()
        } else if (data.firstName && data.firstName !== '') {
            let name = data.firstName[0] + data.firstName[1]
            return name.toLocaleUpperCase()
        } else {
            return ''
        }
    }

    render() {
        const { data } = this.props
        let avatar = this.getAvatar(data)

        return (
            <View style={styles.mainView}>
                <Text style={styles.textStyle}>
                    {avatar}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        borderColor: AppStyles.colors.primaryColor,
        height: 50,
        width: 50,
        borderWidth: 1,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle: {
        fontSize: 16,
        fontFamily: AppStyles.fonts.defaultFont,
        color: AppStyles.colors.primaryColor
    }
});

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(Avatar)