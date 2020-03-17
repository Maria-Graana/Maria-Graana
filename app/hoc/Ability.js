import role from './role';

const Ability = {
    canView (user, screen) {
		for(let item of role[screen].roles) {
			if (item.role === user) {
				console.log(item.access.v)
				return item.access.v
			} else {
				return false
			}
		}
	},
	canAdd (user, screen) {
		for(let item of role[screen].roles) {
			if (item.role === user) {
				console.log(item.access.v)
				return item.access.a
			} else {
				return false
			}
		}
	},
	canEdit (user, screen) {
		for(let item of role[screen].roles) {
			if (item.role === user) {
				console.log(item.access.v)
				return item.access.e
			} else {
				return false
			}
		}
	},
	canDelete (user, screen) {
		for(let item of role[screen].roles) {
			if (item.role === user) {
				console.log(item.access.v)
				return item.access.d
			} else {
				return false
			}
		}
    },
}

module.exports = Ability;