import React from 'react';
import styles from './style'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';

class LandingButtonTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { navigateFunction, label, pagePath, buttonImg, badges } = this.props
    return (
      <View style={styles.buttonWrap}>
        <TouchableOpacity style={styles.mainbutton} onPress={() => navigateFunction(pagePath)}>
          <Image source={buttonImg} style={styles.buttonImg} />
          <Text style={styles.buttonText}>{label}</Text>
          <Text style={styles.badegesWrap}>{badges}</Text>
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