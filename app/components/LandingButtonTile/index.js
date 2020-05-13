import React from 'react';
import styles from './style'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Badge from '../../components/badge'

class LandingButtonTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { navigateFunction, label, pagePath, buttonImg, badges, screenName } = this.props
    
    return (
      <TouchableOpacity style={styles.mainbutton} onPress={() => navigateFunction(pagePath, screenName)}>
        <Image source={buttonImg} style={styles.buttonImg} />
        <Text style={styles.buttonText}>{label}</Text>
        {badges > 0 && <Badge badges={String(badges)} />}
      </TouchableOpacity>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user
  }
}

export default connect(mapStateToProps)(LandingButtonTile)