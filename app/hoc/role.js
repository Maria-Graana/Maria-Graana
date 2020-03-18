const role = {
    Diary: {
        roles: [
            { role: 'sub_admin 1', access: { v: true, a: true, e: false, d: false} },
            { role: 'sub_admin 2', access: { v: true, a: true, e: false, d: false} },
        ],
    },
    Inventory: {
        roles: [
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true} },
            { role: 'sub_admin 2', access: { v: true, a: true, e: true, d: true} },
            { role: 'sub_admin 4', access: { v: true, a: true, e: true, d: true} },
        ],
    },
    TeamDiary: {
        roles: [
            { role: 'admin 1', access: { v: true, a: false, e: false, d: false} },
            { role: 'admin 2', access: { v: true, a: false, e: false, d: false} },
            { role: 'admin 3', access: { v: true, a: false, e: false, d: false} },
            { role: 'sub_admin 1', access: { v: true, a: true, e: false, d: false} },
        ],
    }
}

module.exports = role;
