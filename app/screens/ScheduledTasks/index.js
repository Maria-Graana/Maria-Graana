/** @format */

import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import DiaryTile from '../../components/DiaryTile'
import style from './style'

function ScheduledTasks(props) {
  const diaryData = props.scheduledTasks !== '' ? props.scheduledTasks : null
  const [selectedDiary, setSelectedDiary] = useState(null)
  const [showMenu, setshowMenu] = useState(null)

  useEffect(() => {
    console.log(diaryData)
  }, [])

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

mapStateToProps = (store) => {
  return {
    scheduledTasks: store.slotManagement.setScheduled,
  }
}

export default connect(mapStateToProps)(ScheduledTasks)
