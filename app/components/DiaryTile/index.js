import React from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons';
import ListItem from "../ListItem/index";
import styles from './style';
import AppStyles from '../../AppStyles'
import moment from 'moment';
import helper from '../../helper'


class DiaryTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openPopup: false,
            todayDate: moment(new Date()).format('L'),
        }
    }

    componentDidMount() {
    }

    onChange = (date, mode) => {
    }

    updateDiary = (data) => {
        this.props.updateDiary(data)
    }

    showPopup = (val) => {
        this.props.showPopup(val)
    }



    handleLongPress = (val) => {
        this.props.onLongPress(val);
    }


    render() {
        const {
            data,
            onLeadLinkPressed,
        } = this.props;
        const { todayDate } = this.state;
        return (
            <View style={AppStyles.mb1}>
                <FlatList
                    data={data}
                    renderItem={(item, index) => (
                        <View>
                            {
                                item.item.task && item.item.task.length ?
                                    <View style={styles.container}>
                                        {/* <View key={index} styles={{}}> */}
                                        <View style={styles.timeWrap}>
                                            <Text style={styles.timeText}>{item.item.time}</Text>
                                        </View>
                                        {
                                            item.item.task.map((val, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => this.showPopup(val)}
                                                        onLongPress={() => this.handleLongPress(val)}
                                                        key={index}
                                                        activeOpacity={0.7}
                                                        style={[styles.tileWrap, { borderLeftColor: val.statusColor }]}
                                                    >
                                                        <View style={styles.innerTile}>
                                                            <Text style={styles.showTime}>{moment(val.start).format('hh:mm a')} - {moment(val.end).format("hh:mm a")} </Text>
                                                            <Text style={[styles.statusText, { color: val.statusColor, borderColor: val.statusColor }]}>{helper.setStatusText(val, todayDate)}</Text>
                                                        </View>
                                                        <Text style={styles.meetingText}>{val.subject}</Text>
                                                        <View style={styles.innerTile}>
                                                            <Text style={styles.meetingText}>{val.taskType.charAt(0).toUpperCase() + val.taskType.slice(1)}</Text>
                                                            {
                                                                val.armsLeadId !== null || val.armsProjectLeadId!==null ?
                                                                    <TouchableOpacity style={styles.lead} onPress={() => onLeadLinkPressed(val)}  >
                                                                        <Text style={styles.leadText} >
                                                                            Lead Link
                                                                             </Text>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    null
                                                            }
                                                        </View>


                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    :
                                    <View>
                                        <ListItem placeName={item.item.time} />
                                    </View>
                            }
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

export default DiaryTile;