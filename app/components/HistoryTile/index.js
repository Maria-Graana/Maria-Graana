import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './style';
import AppStyles from '../../AppStyles';
import moment from 'moment';
import helper from '../../helper'

class HistoryTile extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { data } = this.props

        return (
            <TouchableOpacity>
                <View style={[styles.mainTileView,]}>
                    <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
                        <View style={styles.border}>
                            <Text style={[AppStyles.mrTen, styles.meetingCon]}>{data.taskType} @</Text>
                            <Text style={[styles.fontBold]}>{helper.formatTime(data.start)} </Text>
                            <Text style={[styles.fontBold]}>{moment(data.date).format("LL")}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default HistoryTile;