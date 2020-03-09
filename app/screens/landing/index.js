import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Landing extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log('i am here')
    return (
      <View style={{flex: 1}}>
        <Text >
          I am here
        </Text>
        <Button
        title="Go to Details"
        onPress={() => this.props.navigation.navigate('Diary')}
        >
        </Button>
      </View>
    )
  }
}