/** @format */

import React from 'react'
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import BackButton from '../../components/BackButton'
import HistoryTile from '../HistoryTile'
import LoadingNoResult from '../LoadingNoResult'

class HistoryModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  render() {
    const { openPopup, data } = this.props
    return (
      <Modal visible={openPopup} animationType="slide" onRequestClose={this.props.closePopup}>
        <SafeAreaView style={[AppStyles.mb1, styles.container]}>
          <View style={styles.topHeader}>
            <BackButton
              onClick={() => {
                this.props.closePopup(false)
              }}
            />
            <View style={styles.header}>
              <Text style={styles.headerText}>ACTIVITY HISTORY</Text>
            </View>
          </View>
          {data.length ? (
            <FlatList
              style={styles.flatStyle}
              data={data}
              renderItem={({ item }, index) => <HistoryTile data={item} />}
              keyExtractor={(_, index) => index}
            />
          ) : (
            <LoadingNoResult loading={false} />
          )}
        </SafeAreaView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e7ecf0',
  },
  topHeader: {
    flexDirection: 'row',
    margin: 10,
  },
  backImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    paddingRight: 30,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
  },
  flatStyle: {
    padding: 10,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(HistoryModal)
