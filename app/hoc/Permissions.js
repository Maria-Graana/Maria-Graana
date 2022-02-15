/** @format */

// import { store } from '../store'

// const permissions = select(store.getState())

export const getPermissionValue = (feature, action, permissions) => {
  let permission = false
  if (permissions && permissions.rows) {
    let featurePermissions = permissions.rows[feature]
    if (featurePermissions) {
      let actionPermission = featurePermissions.find((element) => {
        return element.action === action
      })
      if (actionPermission) {
        permission = actionPermission.value
      }
    }
  }
  return permission
}

// function select(state) {
//   return state.user.permissions
// }

// function handleChange() {
//   let currentValue = select(store.getState())
//   console.log('currentValue: ', currentValue)
// }

// const unsubscribe = store.subscribe(handleChange)
// unsubscribe()
