/** @format */

import * as React from 'react'
import { StackActions } from '@react-navigation/native'

export const navigationRef = React.createRef()

export function navigate(name) {
  navigationRef.current?.navigate(name, { screen: name })
}

export function navigateTo(name, params) {
  navigationRef.current?.navigate(name, params)
}

export function navigateToSpecificTab(name, tab) {
  navigationRef.current?.navigate(name, { screen: tab })
}

export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop())
}
