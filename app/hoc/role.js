const role = {
    diary: {
        roles: [
            { role: 'sub admin 1', access: { v: true, a: true, e: true, d: false} },
            { role: 'sub admin 2', access: {v: true, a: false, e: false, d: false} },
        ],
    },
}

module.exports = role;