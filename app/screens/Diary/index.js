import React from 'react';
import { View, Text } from 'react-native';

export default class Diary extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Text >
          I am here
        </Text>
      </View>
    )
  }
}