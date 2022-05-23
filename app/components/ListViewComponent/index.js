/** @format */

import React from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import styles from './style'

export default function ({ name, data, onPress, type }) {
  return (
    <View style={styles.listView}>
      {name ? <Text style={styles.listTitle}>{name}</Text> : null}
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => onPress(type ? item.phone : item.value, item.name)}
            style={styles.listButton}
          >
            <Text style={styles.listElement}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}
