/** @format */

import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import DiaryTile from '../../components/DiaryTile'
import style from './style'

export default function ScheduledTasks({ route }) {
  const diaryData = route.params.diary
  const [selectedDiary, setSelectedDiary] = useState(null)
  const [showMenu, setshowMenu] = useState(null)

  // useEffect(() => {
  //   const { params } = route
  //   console.log(params.diary)
  // }, [])

  const showMenuOptions = (data) => {
    setSelectedDiary(data)
    setshowMenu(true)
  }

  const hideMenu = () => {
    setSelectedDiary(null)
    setshowMenu(false)
  }

  return (
    <View style={style.container}>
      {diaryData && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={diaryData.diary}
          renderItem={({ item, index }) => (
            <DiaryTile
              diary={item}
              showMenu={showMenu}
              showMenuOptions={(value) => showMenuOptions(value)}
              selectedDiary={selectedDiary}
              hideMenu={() => hideMenu()}
              setClassification={(value) => setSelectedDiary(value)}
            />
          )}
          keyExtractor={(item, index) => item.id.toString()}
        />
      )}
    </View>
  )
}
