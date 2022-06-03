/** @format */

import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import AppStyles from '../../AppStyles'
import styles from './style'
import ErrorMessage from '../ErrorMessage'

export default function TextFilterComponent({
  name,
  type,
  searchText,
  setTextSearch,
  changeStatusType,
  numeric,
}) {
  const [checkValidation, setCheckValidation] = useState(false)
  return (
    <View style={styles.textView}>
      <Text style={styles.textTitle}>{`Search by ${name}`}</Text>
      <TextInput
        mode="outlined"
        activeOutlineColor={AppStyles.colors.primaryColor}
        outlineColor={AppStyles.colors.primary}
        label={name}
        value={searchText}
        onChangeText={(text) => setTextSearch(text)}
        keyboardType={numeric ? 'numeric' : 'default'}
        theme={{ colors: { text: 'black', background: 'white' } }}
      />

      {searchText === '' && checkValidation ? (
        <ErrorMessage errorMessage={`Please enter ${name}!`} />
      ) : null}
      <Pressable
        onPress={() => {
          searchText != '' ? changeStatusType(searchText, type) : setCheckValidation(true)
        }}
        style={styles.textButton}
      >
        <Text style={styles.textElement}>Search</Text>
      </Pressable>
    </View>
  )
}
