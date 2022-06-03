/** @format */

import React, { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import styles from './style'
import { filter } from 'lodash'
import { TextInput } from 'react-native-paper'

export default function ({ name, data, onPress, type, show }) {
  const [query, setQuery] = useState('')
  const [dataValues, setDataValues] = useState(data)

  const fullData = data

  const handleSearch = (text) => {
    const formattedQuery = text.toLowerCase()
    const filteredData = filter(fullData, (data) => {
      return contains(data, formattedQuery)
    })
    setDataValues(filteredData)
    setQuery(text)
  }

  const contains = ({ name }, query) => {
    const queryName = name.toLowerCase()
    return queryName.includes(query)
  }

  return (
    <View style={styles.listView}>
      {name ? <Text style={styles.listTitle}>{name}</Text> : null}
      {name ? <View style={styles.listborder}></View> : null}
      {show && (
        <TextInput
          mode="outlined"
          activeOutlineColor={AppStyles.colors.primaryColor}
          outlineColor={AppStyles.colors.primary}
          value={query}
          onChangeText={(queryText) => handleSearch(queryText)}
          placeholder="Search"
          theme={{ colors: { text: 'black', background: 'white' } }}
          style={{ marginBottom: 10 }}
        />
      )}
      <FlatList
        data={dataValues}
        style={styles.listStyle}
        keyExtractor={(item, index) => 'key' + index}
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
