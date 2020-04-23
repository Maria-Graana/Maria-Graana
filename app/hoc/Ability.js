import role from './role';

const Ability = {
    canView (user, screen) {
		let roleFound= false
		for(let item of role[screen].roles) {
			if (item.role === user) {
				roleFound= true
				return item.access.v
			}
		}
		if (!roleFound) return false
	},
	canAdd (user, screen) {
		let roleFound= false
		for(let item of role[screen].roles) {
			if (item.role === user) {
				roleFound= true
				return item.access.a
			}
		}
		if (!roleFound) return false
	},
	canEdit (user, screen) {
		let roleFound= false
		for(let item of role[screen].roles) {
			if (item.role === user) {
				roleFound= true
				return item.access.e
			}
		}
		if (!roleFound) return false
	},
	canDelete (user, screen) {
		let roleFound= false
		for(let item of role[screen].roles) {
			if (item.role === user) {
				roleFound= true
				return item.access.d
			}
		}
		if (!roleFound) return false
    },
}

module.exports = Ability;