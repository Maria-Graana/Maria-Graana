/** @format */

import role from './role'
import PPRole from './PPRole'

const Ability = {
  canView(user, screen, isOrganization = false) {
    let roleFound = false
    console.log('isOrganization: ', isOrganization)
    let userRoles = isOrganization ? PPRole : role
    for (let item of userRoles[screen].roles) {
      if (item.role === user) {
        roleFound = true
        return item.access.v
      }
    }
    if (!roleFound) return false
  },
  canAdd(user, screen, isOrganization = false) {
    let roleFound = false
    let userRoles = isOrganization ? PPRole : role
    for (let item of userRoles[screen].roles) {
      if (item.role === user) {
        roleFound = true
        return item.access.a
      }
    }
    if (!roleFound) return false
  },
  canEdit(user, screen, isOrganization = false) {
    let roleFound = false
    let userRoles = isOrganization ? PPRole : role
    for (let item of userRoles[screen].roles) {
      if (item.role === user) {
        roleFound = true
        return item.access.e
      }
    }
    if (!roleFound) return false
  },
  canDelete(user, screen, isOrganization = false) {
    let roleFound = false
    let userRoles = isOrganization ? PPRole : role
    for (let item of userRoles[screen].roles) {
      if (item.role === user) {
        roleFound = true
        return item.access.d
      }
    }
    if (!roleFound) return false
  },
}

module.exports = Ability
