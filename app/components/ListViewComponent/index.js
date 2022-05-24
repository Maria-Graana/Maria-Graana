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
        style={styles.listStyle}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
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
