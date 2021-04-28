import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'
import styles from './style';
import AppStyles from '../../AppStyles';
import { Menu } from 'react-native-paper'
import moment from 'moment';
import StaticData from '../../StaticData'
import helper from '../../helper'

class MeetingTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, editFunction, leadClosedCheck, toggleMenu, sendStatus } = this.props
    let taskTypeData = []
    data.taskType === 'meeting' ?
      taskTypeData = StaticData.meetingStatus
      :
      taskTypeData = StaticData.callStatus

    let response = data && data.response != null && data.response.replace(/_+/g, " ");

    return (
      <TouchableOpacity onPress={() => { data.taskType === 'meeting' && leadClosedCheck && editFunction(data.id) }}>
        <View style={[styles.mainTileView,]}>
          <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
            <View style={styles.border}>
              <Text style={[AppStyles.mrTen, styles.meetingCon]}>{data.taskType} @</Text>
              <Text style={[styles.fontBold]}>{helper.formatTime(data.start)} </Text>
              <Text style={[styles.fontBold]}>{moment(data.date).format("MMM DD")}</Text>
            </View>
            <View style={[styles.dotsWrap]}>
            
              {
                leadClosedCheck && data.taskType === 'meeting' ?
                  <Menu
                    visible={data.showMenu}
                    onDismiss={() => toggleMenu(false, data.id)}
                    anchor={
                      <Entypo
                        onPress={() => toggleMenu(true, data.id)}
                        name="dots-three-vertical"
                        size={20}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                       toggleMenu(false, data.id)
                       sendStatus('meeting_done', data.id)
                      }}
                      title="Meeting Done"
                    />

                    <Menu.Item
                      onPress={() => {
                        toggleMenu(false, data.id)
                        sendStatus('cancel_meeting', data.id)
                      }}
                      title="Cancel Meeting"
                    />
                  </Menu>
                  : null
              }


              {/* <TouchableOpacity style={[styles.doneBtn]} onPress={() => { openStatus(data) }}>
                <Image source={dots} style={styles.dotsImg} />
              </TouchableOpacity>
            </View>
              } */}
            </View>
          </View>
          {
                data.taskType === 'called' && data.response != 'pending' &&
                <View>
                  <Text style={[styles.doneText, response != 'DNC' && styles.uperCase]}>{data.response !== null ? helper.showStatus(response) : 'Called'}</Text>
                </View>
              }

              {
                data.taskType === 'meeting' &&
                <View>
                  <Text style={[styles.doneText, styles.uperCase]}>{data.response != null ? response : 'Meeting Planned'}</Text>
                </View>
              }
        </View>
      </TouchableOpacity >
    )
  }
}

export default MeetingTile;