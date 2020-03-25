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

    setStatusText = (val) => {
        let taskDate = moment(val.date).format('L')
        if (taskDate != this.state.todayDate && val.status !== 'completed') {
            return 'Overdue';
        }
        else if (val.status === 'inProgress') {
            return 'In Progress';
        }
        else if (val.status === 'completed') {
            return 'Completed';
        }
        else if (val.status === 'pending') {
            return 'To-do';
        }
    }

    handleLongPress = (val) => {
        this.props.onLongPress(val);
    }


    render() {
        const {
            data
        } = this.props;
        return (
            <View style={AppStyles.mb1}>
                <FlatList
                    data={data}
                    renderItem={(item, index) => (
                        <View>
                            {
                                item.item.diary && item.item.diary.length ?
                                    <View style={styles.container}>
                                        {/* <View key={index} styles={{}}> */}
                                        <View style={styles.timeWrap}>
                                            <Text style={styles.timeText}>{item.item.time}</Text>
                                        </View>
                                        {
                                            item.item.diary.map((val, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => this.showPopup(val)}
                                                        onLongPress={() => this.handleLongPress(val)}
                                                        key={index}
                                                        activeOpacity={0.7}
                                                        style={[styles.tileWrap, { borderLeftColor: val.statusColor }]}
                                                    >
                                                        <View style={styles.innerTile}>
                                                            <Text style={styles.showTime}>{moment.utc(val.start).format('hh:mm a')} - {moment.utc(val.end).format("hh:mm a")} </Text>
                                                            <Text style={[styles.statusText, { color: val.statusColor, borderColor: val.statusColor }]}>{this.setStatusText(val)}</Text>
                                                        </View>
                                                        <Text style={styles.meetingText}>{val.subject}</Text>
                                                        <Text style={styles.meetingText}>{val.taskType}</Text>
                                                        {
                                                            val.leadLink === true ?
                                                                <TouchableOpacity style={styles.lead}  >
                                                                    <Text style={styles.leadText} >
                                                                        Lead Link
                                                                             </Text>
                                                                </TouchableOpacity>
                                                                :
                                                                null
                                                        }
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