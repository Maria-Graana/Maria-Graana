/** @format */

import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal'
import StaticData from '../../StaticData'
import { useDispatch, connect } from 'react-redux'
import { getDiaryTasks, setSortValue } from '../../actions/diary'

export function DiarySortModal({
  isSortModalVisible,
  selectedDate,
  agentId,
  isOverdue,
  isFiltered,
  sortValue,
  showSortModalVisible,
}) {
  const dispatch = useDispatch()
  return (
    <Modal isVisible={isSortModalVisible} onBackdropPress={() => showSortModalVisible(false)}>
      <View style={[styles.dropDownMain]}>
        {StaticData.diarySortValues.map((item, key) => {
          return (
            <TouchableOpacity
              style={[styles.doneBtnBottom]}
              onPress={() => {
                dispatch(setSortValue(item.value)).then((result) => {
                  if (result) {
                    dispatch(getDiaryTasks(selectedDate, agentId, isOverdue, isFiltered))
                    showSortModalVisible(false)
                  }
                })
              }}
              key={key}
            >
              <View style={AppStyles.flexDirectionRow}>
                <Text style={[styles.textStyle, sortValue === item.value && styles.textColorBlue]}>
                  {item.name}
                </Text>
                {sortValue === item.value && (
                  <Image
                    source={require('../../../assets/img/tick.png')}
                    style={styles.tickImageStyle}
                  />
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  dropDownMain: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4,
    padding: 10,
    // paddingTop: 30,
  },
  textStyle: {
    fontSize: AppStyles.fontSize.medium,
    marginHorizontal: 5,
    letterSpacing: 0.5,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  timesBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  tickImageStyle: {
    width: 10,
    height: 10,
    marginTop: 3,
    resizeMode: 'contain',
    position: 'relative',
    top: 1,
  },
  textColorBlue: {
    color: '#0E73EE',
  },
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: AppStyles.fontSize.medium,
    marginHorizontal: 5,
    letterSpacing: 0.5,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  timesBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  tickImageStyle: {
    width: 10,
    height: 10,
    marginTop: 3,
    resizeMode: 'contain',
    position: 'relative',
    top: 1,
  },
  textColorBlue: {
    color: '#0E73EE',
  },
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  doneBtnBottom: {
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 7,
    marginTop: 7,
    alignItems: 'center',
    width: '100%',
  },
})
