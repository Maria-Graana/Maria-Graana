/** @format */

import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import AppStyles from '../../AppStyles'
import styles from './style'

export default function TextFilterComponent({
  name,
  type,
  searchText,
  setTextSearch,
  changeStatusType,
}) {
  return (
    <View style={styles.textView}>
      <Text style={styles.textTitle}>{`Search by ${name}`}</Text>
      <TextInput
        mode="outlined"
        activeOutlineColor={AppStyles.colors.primaryColor}
        label={name}
        value={searchText}
        onChangeText={(text) => setTextSearch(text)}
      />
      <Pressable
        onPress={() => {
          changeStatusType(type, searchText)
        }}
        style={styles.textButton}
      >
        <Text style={styles.textElement}>Search</Text>
      </Pressable>
    </View>
  )
}
