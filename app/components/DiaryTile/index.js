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
            <View>
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
                                                    <View styles={{ flex: 1 }} key={index}>
                                                        <TouchableWithoutFeedback onPress={() => { this.showPopup(val) }}>
                                                            <View style={[styles.tileWrap, { borderLeftColor: val.statusColor }]} key={index}>
                                                                <View style={styles.innerTile}>
                                                                    <View style={styles.meetingWrap}>
                                                                        <Text style={styles.meetingText}>{val.taskType}</Text>
                                                                    </View>
                                                                    <View style={[styles.midView, { backgroundColor: val.statusColor }]}></View>
                                                                </View>
                                                                <View style={styles.innerView}>
                                                                    <AntDesign name="clockcircleo" size={20} color="gray" />
                                                                    <Text style={styles.showTime}>{val.time}</Text>
                                                                    <View style={styles.spaceView}></View>
                                                                    <Entypo name="location-pin" size={20} color="gray" />
                                                                    <Text style={styles.meetingText}>{val.subject}</Text>
                                                                </View>
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