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
                    <View style={styles.taskTypeWrap}>
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
                      <View style={styles.taskType}>
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
                          data.status !== 'completed' ? { marginLeft: 90 } : { marginLeft: 75 },
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
                      <View style={styles.reasonWrap}>
                        <Text>Reason :</Text>
                        <View style={[styles.reasonTag, { borderColor: data.reason.colorCode }]}>
                          <Text> {data.reasonTag}</Text>
                        </View>
                      </View>
                    )}
                    {data.feedbackTag === data.response ? (
                      <View style={styles.responseWrap}>
                        <Text>{data.response}</Text>
                      </View>
                    ) : (
                      <View>
                        {data.feedbackTag && (
                          <View>
                            <View style={styles.feedbackTag}>
                              <Text style={styles.blueColor}>{data.feedbackTag}</Text>
                            </View>
                          </View>
                        )}
                        {data.response && (
                          <View style={styles.outcomeWrap}>
                            <Text>{data.response}</Text>
                          </View>
                        )}
                      </View>
                    )}
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
