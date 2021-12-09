/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import moment from 'moment'
import helper from '../../helper'
import DiaryHelper from '../../screens/Diary/diaryHelper'

class MeetingTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data } = this.props
    const d = new Date(data.createdAt)
    const weekday = new Array(7)
    weekday[0] = 'Sun'
    weekday[1] = 'Mon'
    weekday[2] = 'Tue'
    weekday[3] = 'Wed'
    weekday[4] = 'Thu'
    weekday[5] = 'Fri'
    weekday[6] = 'Sat'
    let day = weekday[d.getDay()]
    return (
      <TouchableOpacity>
        <View>
          {data.taskType && (
            <View style={[styles.mainTileView]}>
              <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
                <View style={styles.border}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {data.taskType === 'meeting' && (
                        <Image
                          source={require('../../../assets/img/meeting2.png')}
                          style={styles.dotsImg}
                        />
                      )}
                      {data.taskType === 'connect' && (
                        <Image
                          source={require('../../../assets/img/connect.png')}
                          style={styles.dotsImg}
                        />
                      )}
                      {data.taskType === 'follow_up' && (
                        <Image
                          source={require('../../../assets/img/followup2.png')}
                          style={styles.dotsImg}
                        />
                      )}
                      {data.taskType === 'viewing' && (
                        <Image
                          source={require('../../../assets/img/viewing2.png')}
                          style={styles.dotsImg}
                        />
                      )}
                      <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[AppStyles.mrTen, styles.meetingCon]}>
                          {`${DiaryHelper.removeUnderscore(data.taskType)
                            .replace('Meeting', 'Meeting ')
                            .replace('Connect', 'Connect ')}`}
                        </Text>
                        {data.status === 'completed' ? (
                          <Image
                            source={require('../../../assets/img/done2.png')}
                            style={styles.doneImg}
                          />
                        ) : null}
                      </View>

                      <View
                        style={[
                          styles.DayAndTime,
                          data.status !== 'completed' ? { marginLeft: 85 } : { marginLeft: 70 },
                        ]}
                      >
                        <Text style={styles.fontBold}>
                          {` ${day} ${moment(data.date).format('MMM DD')},${helper
                            .formatTime(data.start)
                            .replace('pm', 'PM')
                            .replace('am', 'AM')}`}{' '}
                        </Text>
                      </View>
                    </View>
                    {data.reasonTag && data.status !== 'completed' && (
                      <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 35 }}>
                        <Text>Reason :</Text>
                        <View
                          style={{
                            borderWidth: 2,
                            borderColor: data.reason.colorCode,
                            padding: 3,
                            paddingHorizontal: 5,
                            borderRadius: 15,
                            marginTop: -3,
                            marginLeft: 5,
                          }}
                        >
                          <Text> {data.reasonTag}</Text>
                        </View>
                      </View>
                    )}
                    {data.feedbackTag && (
                      <View>
                        <View
                          style={{
                            padding: 3,
                            marginLeft: 30,
                            paddingTop: 10,
                          }}
                        >
                          <Text style={{ color: '#006FF2', fontSize: 15 }}>{data.feedbackTag}</Text>
                        </View>
                      </View>
                    )}
                    <View style={{ paddingLeft: 15, marginTop: 3, marginLeft: 18 }}>
                      <Text>{data.response}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

export default MeetingTile
