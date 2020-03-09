import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

class Landing extends React.Component {
  constructor(props) {
	super(props)
	console.log(this.props)
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

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(Landing)