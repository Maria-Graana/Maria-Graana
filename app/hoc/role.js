const role = {
    Diary: {
        roles: [
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 2', access: { v: true, a: true, e: true, d: true } },
        ],
    },
    Inventory: {
        roles: [
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 2', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 4', access: { v: true, a: true, e: true, d: true } },
        ],
    },
    TeamDiary: {
        roles: [
            { role: 'admin 1', access: { v: true, a: false, e: false, d: false } },
            { role: 'admin 2', access: { v: true, a: false, e: false, d: false } },
            { role: 'admin 3', access: { v: true, a: false, e: false, d: false } },
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
        ],
    },
    Client: {
        roles: [
            { role: 'admin 3', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 2', access: { v: true, a: true, e: true, d: true } },
        ],
    },
    Targets: {
        roles: [
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 2', access: { v: true, a: false, e: false, d: false } },
        ],
    },
    Leads: {
        roles: [
            { role: 'admin 3', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
            { role: 'sub_admin 2', access: { v: true, a: true, e: true, d: true } },
        ],
    },
    CreateUser: {
        roles: [
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
        ],
    },
    AssignLead: {
        roles: [
            { role: 'sub_admin 1', access: { v: true, a: true, e: true, d: true } },
        ],
    }
}

module.exports = role;
