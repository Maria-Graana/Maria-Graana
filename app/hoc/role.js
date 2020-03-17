export default role = {
    'admin 1': [
        {
            screen: "diary",
            access: {
                e: true,
                d: true,
                v: true,
                a: true
            }
        },
        {
            screen: "Leads",
            access: {
                e: true,
                d: true,
                v: true,
                a: true
            }
        },
    ],
    'admin 2': [
        {
            screen: "diary",
            access: {
                e: false,
                d: false,
                v: true,
                a: false
            }
        },
        {
            screen: "Leads",
            access: {
                e: false,
                d: false,
                v: true,
                a: true
            }
        },
    ],
    'admin 3': [
        {
            screen: "diary",
            access: {
                e: false,
                d: false,
                v: true,
                a: false
            }
        },
        {
            screen: "Leads",
            access: {
                e: false,
                d: false,
                v: true,
                a: true
            }
        },
    ],
    'sub_admin 1': [
        {
            screen: "diary",
            access: {
                e: false,
                d: false,
                v: true,
                a: false
            }
        },
        {
            screen: "Leads",
            access: {
                e: false,
                d: false,
                v: true,
                a: true
            }
        },
    ]
}