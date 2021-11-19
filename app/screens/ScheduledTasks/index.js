/** @format */

import React, { useEffect } from 'react'
import { View } from 'react-native'

export default function ScheduledTasks({ route }) {
  useEffect(() => {
    const { params } = route
    console.log(params.diary)
  }, [])
  return <View></View>
}
