import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class Landing extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
		<SafeAreaView >
			<Text >
				I am here
			</Text>
			<Button
			title="Go to Details"
			onPress={() => this.props.navigation.navigate('Diary')}
			>
			</Button>
      	</SafeAreaView>
    )
  }
}