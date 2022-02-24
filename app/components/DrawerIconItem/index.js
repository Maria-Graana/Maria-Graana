/** @format */

import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Badges from '../badge/index'
import {
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Platform,
} from 'react-native'
import { Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base'

export default class DrawerIconItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { screen, badges, isSub, isSuper, imageIcon, display } = this.props

    return (
      <TouchableWithoutFeedback
        activeOpacity={0.7}
        onPress={() => {
          this.props.navigateTo()
        }}
      >
        <ListItem icon style={{ marginBottom: 10 }}>
          {isSub && (
            <Left>
              <Image
                style={{ height: Platform.OS ? 20 : 16, width: Platform.OS ? 20 : 16 }}
                source={imageIcon}
              />
            </Left>
          )}
          <Body style={{ borderBottomColor: 'white' }}>
            <Text style={{ color: 'black', fontSize: 15, marginLeft: isSub && 10 }}>{screen}</Text>
          </Body>
          {badges > 0 && (
            <Right style={{ borderBottomColor: 'white', marginBottom: 25 }}>
              <Badges
                badges={String(badges)}
                customStyling={{
                  borderColor: 'black',
                  color: 'black',
                  borderRadius: Platform.OS ? 10 : 15,
                  height: Platform.OS ? 20 : 16,
                }}
              />
            </Right>
          )}
          {isSuper && (
            <Right style={{ borderBottomColor: 'white', marginBottom: 25, marginRight: 10 }}>
              <Image
                style={{ height: Platform.OS ? 20 : 16, width: Platform.OS ? 20 : 16 }}
                source={
                  display
                    ? require('../../../assets/icons/down-arrow.png')
                    : require('../../../assets/img/dropArrow.png')
                }
              />
            </Right>
          )}
        </ListItem>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  viewWrap: {
    paddingLeft: 5,
    width: 40,
  },
  iconWrap: {
    paddingLeft: 5,
  },
  imageViewWrap: {
    paddingLeft: 10,
    width: 10,
    flexDirection: 'row',
  },
  imageStyle: {
    resizeMode: 'contain',
    width: 100,
    tintColor: '#484848',
    height: 100,
  },
})
