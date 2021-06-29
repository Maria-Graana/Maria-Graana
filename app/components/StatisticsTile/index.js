/** @format */

import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import AppStyles from '../../AppStyles'

const displayValue = (value) => {
  if (value === 0) return 'N/A'
  else if (value === null || value === undefined) return '-'
  else return value
}

const StatisticsTile = ({ value, title, imagePath, unit = '', double = false, secondValue }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.flexView}>
        {title && (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        )}
        {imagePath && <Image source={imagePath} style={styles.containerImg} />}
      </View>
      {!double ? (
        <View style={styles.flexView}>
          <Text numberOfLines={1} style={styles.value}>
            {displayValue(value)}
          </Text>
          <Text style={[styles.value, { marginLeft: 2 }]}>{unit}</Text>
        </View>
      ) : (
        <View style={styles.flexView}>
          <Text numberOfLines={1} style={styles.value}>
            {value}
          </Text>
          {secondValue && secondValue !== 0 ? (
            <Text numberOfLines={1} style={styles.value}>
              /{secondValue}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  )
}

export default StatisticsTile

const styles = StyleSheet.create({
  flexView: {
    flex: 0.5,
    flexDirection: 'row',
    marginRight: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginHorizontal: 15,
    flex: 1,
  },
  value: {
    fontSize: AppStyles.fontSize.medium,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.textColor,
    textAlign: 'left',
  },
  title: {
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: AppStyles.fontSize.medium,
    paddingRight: 10,
  },
  containerImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
})
