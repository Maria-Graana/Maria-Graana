import React from 'react';
import styles from './style'
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

class LandingButtonTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { navigateFunction, label, pageName } = this.props
    return (
      <View style={styles.buttonWrap}>
        <TouchableOpacity style={styles.mainbutton} onPress={() => navigateFunction(pageName)}>
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user
  }
}

export default connect(mapStateToProps)(LandingButtonTile)