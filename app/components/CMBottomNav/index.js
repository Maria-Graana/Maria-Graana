import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AppStyles from '../../AppStyles';
import styles from './style'
import { connect } from 'react-redux';
import Avatar from '../Avatar';

class CMBottomNav extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    const {
      navigateTo,
      goToComments,
      goToDiaryForm,
      goToAttachments,
      closedLeadEdit,
      closeLead,
      alreadyClosedLead
    } = this.props
    return (
      <View style={styles.bottomNavMain}>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => navigateTo()}>
          <Image style={styles.bottomNavImg} source={require('../../../assets/img/details.png')} />
          <Text style={styles.bottomNavBtnText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => goToComments()}>
          <Image style={styles.bottomNavImg} source={require('../../../assets/img/msg.png')} />
          <Text style={styles.bottomNavBtnText}>Comments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => goToAttachments()}>
          <Image style={styles.bottomNavImg} source={require('../../../assets/img/files.png')} />
          <Text style={styles.bottomNavBtnText}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => goToDiaryForm()}>
          <Image style={styles.bottomNavImg} source={require('../../../assets/img/roundPlus.png')} />
          <Text style={styles.bottomNavBtnText}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => { closedLeadEdit == true ? closeLead() : alreadyClosedLead() }}>
          <Image style={styles.bottomNavImg} source={require('../../../assets/img/roundCheck.png')} />
          <Text style={styles.bottomNavBtnText}>Close</Text>
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

export default connect(mapStateToProps)(CMBottomNav)