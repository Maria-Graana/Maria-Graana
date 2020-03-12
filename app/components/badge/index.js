import React from 'react';
import styles from './style'
import { Text } from 'react-native';
import { connect } from 'react-redux';

class Badges extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { badges, customStyling } = this.props
    let mainStyle = customStyling || styles.badegesWrap
    return (
      <Text style={[styles.badegesWrap, customStyling]}>{badges}</Text>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user
  }
}

export default connect(mapStateToProps)(Badges)