import React from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons';
import ListItem from "../ListItem/index";
import styles from './style';
import AppStyles from '../../AppStyles'
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';


class DiaryTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openPopup: false,
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
        //console.log('val=>',val)
        this.props.showPopup(val)
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
                                                    <View styles={AppStyles.mb1} key={index}>
                                                        <TouchableWithoutFeedback onPress={() => { this.showPopup(val) }}>
                                                            <View style={[styles.tileWrap, { borderLeftColor: val.statusColor }]} key={index}>
                                                                <View style={styles.innerTile}>
                                                                    <Text style={styles.showTime}>{moment.utc(val.start).format('hh:mm a')} - {moment.utc(val.end).format("hh:mm a")} </Text>
                                                                    <Text style={[styles.statusText, { color: val.statusColor, borderColor: val.statusColor }]}>{val.status === 'pending' ? 'Open' : val.status}</Text>
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
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
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