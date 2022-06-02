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

  const headerSearch = () => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          marginVertical: 10,
          borderRadius: 20,
        }}
      >
        <TextInput
          mode="outlined"
          activeOutlineColor={AppStyles.colors.primaryColor}
          outlineColor={AppStyles.colors.primary}
          value={query}
          onChangeText={(queryText) => handleSearch(queryText)}
          placeholder="Search"
          theme={{ colors: { text: 'black', background: 'white' } }}
        />
      </View>
    )
  }

  return (
    <View style={styles.listView}>
      {name ? <Text style={styles.listTitle}>{name}</Text> : null}
      {name ? <View style={styles.listborder}></View> : null}
      <FlatList
        data={dataValues}
        style={styles.listStyle}
        ListHeaderComponent={show && headerSearch}
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
