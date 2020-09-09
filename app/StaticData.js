export default StaticData = {
    diaryRows: [
        {
            createdAt: "2020-03-10T09:31:01.000Z",
            taskType: "Meeting",
            start: "2020-03-10T15:10:00.000Z",
            end: "2020-03-10T15:50:00.000Z",
            notes: "The first of many",
            date: "2020-03-10T15:10:00.000Z",
            time: "03:10 pm",
            subject: "Sprint One demo",
            status: 'Open',
            id: 895,
            hour: "03PM",
        },
        {
            createdAt: "2020-03-10T09:32:06.000Z",
            taskType: "Viewing",
            start: "2020-03-10T15:20:00.000Z",
            end: "2020-03-10T15:30:00.000Z",
            notes: "Secondly ",
            date: "2020-03-10T15:20:00.000Z",
            time: "03:20 pm",
            subject: "Discussion on Current Projects",
            status: "In Progress",
            leadLink: true,
            id: 896,
            hour: "03PM",
        }
    ],
    teamDiaryRows: [
        {
            id: 1,
            image: '../assets/img/avatar/jpeg',
            name: 'Irfan Lashari',
            subRole: 'Zonal Manager'
        },
        {
            id: 2,
            image: '../assets/img/avatar/jpeg',
            name: 'Zaigham Abbas',
            subRole: 'Zonal Manager'
        }
    ],
    taskValues: [
        {
            name: 'Meeting',
            value: 'meeting'
        },
        {
            name: 'Follow Up',
            value: 'follow up'
        },
        {
            name: 'Other',
            value: 'other'
        }
    ],
    taskValuesCMLead: [
        {
            name: 'Follow Up',
            value: 'follow up'
        },
        {
            name: 'Other',
            value: 'other'
        }
    ],
    oneToTen: [
        { value: '1', name: '1' },
        { value: '2', name: '2' },
        { value: '3', name: '3' },
        { value: '4', name: '4' },
        { value: '5', name: '5' },
        { value: '6', name: '6' },
        { value: '7', name: '7' },
        { value: '8', name: '8' },
        { value: '9', name: '9' },
        { value: '10+', name: '10+' },
    ],
    sizeUnit: [
        { value: 'sqm', name: 'M²' },
        { value: 'sqft', name: 'Ft²' },
        { value: 'sqyd', name: 'Yd²' },
        { value: 'kanal', name: 'Kanal' },
        { value: 'marla', name: 'Marla' },
    ],
    purpose: [
        { value: 'sale', name: 'Sale' },
        { value: 'rent', name: 'Rent' }
    ],
    type: [
        { value: 'residential', name: 'Residential' },
        { value: 'plot', name: 'Plot' },
        { value: 'commercial', name: 'Commercial' },
    ],
    subType: {
        residential: [
            { value: 'house', name: 'House' }, { value: 'guest house', name: 'Guest house' },
            { value: 'apartment', name: 'Apartment' }, { value: 'upper portion', name: 'Upper portion' },
            { value: 'lower portion', name: 'Lower portion' }, { value: 'farm house', name: 'Farm house' },
            { value: 'room', name: 'Room' }, { value: 'penthouse', name: 'Penthouse' },
            { value: 'hotel suites', name: 'Hotel suites' }, { value: 'basement', name: 'Basement' },
            { value: 'annexe', name: 'Annexe' }, { value: 'hostel', name: 'Hostel' },
            { value: 'other', name: 'Other' },
        ],
        plot: [
            { value: 'residential plot', name: 'Residential Plot' }, { value: 'commercial plot', name: 'Commercial Plot' },
            { value: 'agricultural land', name: 'Agricultural Land' }, { value: 'industrial land', name: 'Industrial Land' },
            { value: 'plot file', name: 'Plot File' }, { value: 'farmhouse plot', name: 'Farmhouse Plot' },
        ],
        commercial: [
            { value: 'office', name: 'Office' },
            { value: 'shop', name: 'Shop' },
            { value: 'warehouse', name: 'Warehouse' },
            { value: 'factory', name: 'Factory' },
            { value: 'building', name: 'Building' },
            { value: 'theatre', name: 'Theatre' },
            { value: 'Gym', name: 'Gym' },
            { value: 'Food Court', name: 'Food Court' },
            { value: 'other', name: 'Other' },
        ]
    },
    floors: [
        // { id: '', name: 'Select Floor' },
        { value: 'basement', name: 'Basement' },
        { value: 'mezzanine', name: 'Mezzanine' },
        { value: 'ground', name: 'Ground' },
        { value: '1st', name: '1st' },
        { value: '2nd', name: '2nd' },
        { value: '3rd', name: '3rd' },
        { value: '4th', name: '4th' },
        { value: '5th', name: '5th' },
        { value: '6th', name: '6th' },
        { value: '7th', name: '7th' },
        { value: '8th', name: '8th' },
        { value: '9th', name: '9th' },
        { value: '10th', name: '10th' },
        { value: '11th', name: '11th' },
        { value: '12th', name: '12th' },
        { value: '13th', name: '13th' },
        { value: '14th', name: '14th' },
        { value: '15th', name: '15th' },
        { value: '16th', name: '16th' },
        { value: '18th', name: '18th' },
        { value: '19th', name: '19th' },
        { value: '20th', name: '20th' },
        { value: '21st', name: '21st' },
        { value: 'rooftop', name: 'Rooftop' },
        { value: 'foodCourt', name: 'Food Court' },
    ],
    units: [
        { value: 'instalments', name: 'Installments' },
        { value: 'commisionPayment', name: 'Commision Payment' },
        { value: 'downPayment', name: 'Down Payment' },
    ],
    attachmentsRows: [
        {
            id: 1,
            title: 'Contract',
            fileName: 'Contract_20thMarch.PDF',
            size: '',
            uri: '',
            dateCreated: '9:30 am, Mar 29'
        },
        {
            id: 2,
            title: 'Receipt',
            fileName: 'Payment_Receipt2.JPG',
            size: '',
            uri: '',
            dateCreated: '1:30 pm, Mar 30'
        }
    ],
    getInstallments: [
        { value: '4', name: '1 Year' },
        { value: '8', name: '2 Years' },
        { value: '12', name: '3 Years' },
        { value: '16', name: '4 Years' },
        { value: '20', name: '5 Years' },
        { value: '24', name: '6 Years' },
        { value: '28', name: '7 Years' },
        { value: '32', name: '8 Years' },
        { value: '36', name: '9 Years' },
        { value: '40', name: '10 Years' },
    ],
    getInstallmentsMonthly: [
        { value: '12', name: '1 Year' },
        { value: '24', name: '2 Years' },
        { value: '36', name: '3 Years' },
        { value: '48', name: '4 Years' },
        { value: '60', name: '5 Years' },
        { value: '72', name: '6 Years' },
        { value: '84', name: '7 Years' },
        { value: '96', name: '8 Years' },
        { value: '108', name: '9 Years' },
        { value: '120', name: '10 Years' },
    ],
    propsurePackages: [
        {
            name: 'SILVER PACKAGE',
            value: 'silver'
        },
        {
            name: 'GOLD PACKAGE',
            value: 'gold'
        }
    ],
    leadCloseReasons: [
        {
            name: 'Client not responding',
            value: 'client_not_responding'
        },
        {
            name: 'Client withdrew requirements',
            value: 'client_withdrew_requirements'
        },
        {
            name: 'No property found',
            value: 'no_property_found'
        },
        {
            name: 'Client got property from some other source',
            value: 'property_other_source'
        }, {
            name: 'Client not satisfied with options',
            value: 'client_not_satisfied'
        }
    ],
    leadCloseReasonsWithPayment: [
        {
            name: 'Payment Done',
            value: 'payment_done'
        },
        {
            name: 'Client not responding',
            value: 'client_not_responding'
        },
        {
            name: 'Client withdrew requirements',
            value: 'client_withdrew_requirements'
        },
        {
            name: 'No property found',
            value: 'no_property_found'
        },
        {
            name: 'Client got property from some other source',
            value: 'property_other_source'
        }, {
            name: 'Client not satisfied with options',
            value: 'client_not_satisfied'
        }
    ],
    paymentPopupDone: [
        {
            name: 'Payment Done',
            value: 'payment_done'
        },
        {
            name: 'Client not responding',
            value: 'client_not_responding'
        },
        {
            name: 'Client not satisfied with options',
            value: 'client_not_satisfied'
        }
    ],
    paymentPopup: [
        {
            name: 'Client not responding',
            value: 'client_not_responding'
        },
        {
            name: 'Client not satisfied with options',
            value: 'client_not_satisfied'
        }
    ],
    projectType: [
        { value: 'shop', name: 'Shop' },
        { value: 'office', name: 'Office' },
        { value: 'food Court', name: 'Food Court' },
        { value: 'hotel Suite', name: 'Hotel Suite' },
        { value: 'harley Center', name: 'Harley Center' },
        { value: 'other', name: 'Other' },
    ],
    oneToTwelve: [
        { value: '1', name: '1' },
        { value: '2', name: '2' },
        { value: '3', name: '3' },
        { value: '4', name: '4' },
        { value: '5', name: '5' },
        { value: '6', name: '6' },
        { value: '7', name: '7' },
        { value: '8', name: '8' },
        { value: '9', name: '9' },
        { value: '10', name: '10' },
        { value: '11', name: '11' },
        { value: '12', name: '12' },
    ],
    callStatus: [
        { value: 'no_response', name: 'No Response' },
        { value: 'powered_off', name: 'Powered Off' },
        { value: 'invalid_number', name: 'Invalid Number' },
        { value: 'follow_up', name: 'Follow-up' },
        { value: 'DNC', name: 'DNC' },
        { value: 'details_texted', name: 'No Response but Details Sent' },
        { value: 'other_agent', name: 'In contact with some other agent' },
        { value: 'call_back', name: 'Call Back' },
        { value: 'awaiting_call', name: 'Awaiting Response' },
        { value: 'details_sent', name: 'Details Sent' },
        { value: 'expected_visit', name: 'Expected Visit' },
        { value: 'not_interested', name: 'Not Interested' },
    ],
    meetingStatus: [
        { value: 'visited', name: 'Visited' },
        { value: 'deal_expected', name: 'Deal Expected' },
        { value: 'deal_signed', name: 'Deal Signed' },
        { value: 'cancel_meeting', name: 'Cancel Meeting' },
    ],
    buyRentFilter: [
        { value: 'all', name: 'All' },
        { value: 'open', name: 'Open' },
        { value: 'called', name: 'Called' },
        { value: 'viewing', name: 'Viewing' },
        { value: 'offer', name: 'Offer' },
        { value: 'propsure', name: 'Propsure' },
        { value: 'token', name: 'Deal Signed - Token' },
        { value: 'payment', name: 'Payments' },
        { value: 'closed', name: 'Closed' },
    ],
    investmentFilter: [
        { value: 'all', name: 'All' },
        { value: 'open', name: 'Open' },
        { value: 'called', name: 'Called' },
        { value: 'no_response', name: 'No Response' },
        { value: 'powered_off', name: 'Powered Off' },
        { value: 'invalid_number', name: 'Invalid Number' },
        { value: 'not_interested', name: 'Not Interested' },
        { value: 'DNC', name: 'DNC' },
        { value: 'details_texted', name: 'No Response but Details Sent' },
        { value: 'other_agent', name: 'In contact with some other agent' },
        { value: 'call_back', name: 'Call Back' },
        { value: 'awaiting_call', name: 'Awaiting Response' },
        { value: 'follow_up', name: 'Follow up' },
        { value: 'details_sent', name: 'Details Sent' },
        { value: 'expected_visit', name: 'Expected Visit' },
        { value: 'meeting_planned', name: 'Meeting Planned' },
        { value: 'visited', name: 'Visited' },
        { value: 'deal_expected', name: 'Deal Expected' },
        { value: 'deal_signed', name: 'Deal Signed' },
        { value: 'token', name: 'Token' },
        { value: 'payment', name: 'Payment' },
        { value: 'closed_won', name: 'Closed Won' },
        { value: 'closed_lost', name: 'Closed Lost' },
    ],
    cmLeadBtnOption: [
        { value: 'attachment', name: 'Attachment' },
        { value: 'comment', name: 'Comment' },
        { value: 'task', name: 'Task' },
    ],
    rcmProgressBar: {
        open: 0.2,
        viewing: 0.4,
        offer: 0.6,
        propsure: 0.8,
        token: 1,
        payment: 1,
        closed: 1
    },
    cmProgressBar: {
        open: 0,
        called: 0.5,
        call_no_response: 0.5,
        call_powered_off: 0.5,
        call_invalid_number: 0.5,
        call_follow_up: 0.5,
        call_awaiting_response: 0.5,
        call_details_sent: 0.5,
        call_expected_visit: 0.5,
        call_not_interested: 0.5,
        meeting: 0.5,
        meeting_visited: 0.5,
        meeting_expected_conversion: 0.5,
        meeting_deal_signed: 0.5,
        Token: 1,
        payment: 1,
        closed: 1,
    },
    sortData: [
        { name: 'Newest First', value: '&order=Desc&field=createdAt' },
        { name: 'Newest Last', value: '&order=Asc&field=createdAt' },
        { name: 'Recently Modified First', value: '&order=Desc&field=updatedAt' },
        { name: 'Recently Modified Last', value: '&order=Asc&field=updatedAt' },
    ],
    barCharData: {
        labels: ['Open', 'Call', 'Meeting', 'Token', 'Payment', 'Won', 'Lost'],
        datasets: [{
            data: [
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` // optional
        }]
    },
    rcmBarCharData: {
        labels: ['Open', 'Called', 'Viewing', 'Offer', 'Propsure', 'Token', 'Payment', 'Won', 'Lost'],
        datasets: [{
            data: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` // optional
        }]
    },
    paymentOptions: [
        { value: 'full_payment', name: 'Full Payment' },
        { value: 'installments', name: 'Installments' }
    ],
    Constants: {
        lead_closed_won: 'closed_won',
        lead_closed_lost: 'closed_lost',
        any_value: 10000000000,
    },
    PricesProject: [
        500000,
        1000000,
        2000000,
        3000000,
        4000000,
        5000000,
        6000000,
        7000000,
        8000000,
        10000000,
        12500000,
        15000000,
        20000000,
        25000000,
        30000000,
        40000000,
        50000000,
        100000000,
        250000000,
        500000000,
        1000000000,
        10000000000,
    ],
    PricesBuy: [
        0,
        500000,
        1000000,
        2000000,
        3000000,
        4000000,
        5000000,
        6000000,
        7000000,
        8000000,
        10000000,
        15000000,
        20000000,
        25000000,
        30000000,
        40000000,
        50000000,
        100000000,
        250000000,
        500000000,
        1000000000,
        10000000000,
    ],
    PricesRent: [
        0,
        5000,
        10000,
        15000,
        20000,
        25000,
        30000,
        35000,
        40000,
        45000,
        50000,
        60000,
        70000,
        80000,
        90000,
        100000,
        125000,
        150000,
        200000,
        250000,
        300000,
        400000,
        500000,
        1000000,
        10000000000,

    ],
    searchTeamBy: [
        { value: 'myTeam', name: 'My Team' },
        { value: 'others', name: 'Others' },
    ],
    planOptions: [
        { name: 'Investment Plan', value: 'Sold on Investment Plan' },
        { name: 'Rental Plan', value: 'Sold on Rental Plan' },
    ],
    installmentDue: [
        { name: 'Quarterly', value: 'quarterly' },
        { name: 'Monthly', value: 'monthly' },
    ],
    onlyQuarterly: [
        { name: 'Quarterly', value: 'quarterly' },
    ],
    residentialFeatures: [
        'Central Heating',
        'TV Lounge',
        'Dining Room',
        'Drawing Room',
        'Kitchen',
        'Store Room',
        'Central Cooling',
        'Lawn',
        'Swimming Pool',
        'Fully Furnished',
        'Semi Furnished',
        'Wifi',
        'Balcony',
        'Laundry Room',
        'Servant Quarter',
        'Dirty Kitchen',
        'Elevators',
        'Study Room',
        'Powder Room',
        'Security Staff',
        'Accessible For Specially-Abled Persons',
        'Nearby Landmark'
    ],
    residentialUtilities: [
        'Electricity',
        'Gas',
        'Maintenance',
        'Water'
    ],
    plotFeatures: [
        'Possession',
        'Corner',
        'Park Facing',
        'Boundary Wall',
        'Extra Land',
        'Main Boulevard'
    ],
    plotUtilities: [
        'Electricity',
        'Gas',
        'Sewerage',
        'Water'
    ],
    facing: [
        'North',
        'North West',
        'North East',
        'South',
        'South West',
        'South East',
        'East',
        'West'
    ],
    commercialFeatures: [
        'Central Heating',
        'Central Cooling',
        'Elevator/Lift',
        'Public Parking',
        'UnderGround Parking',
        'Internet',
        'CCTV Camera',
        'Backup Generator'
    ],
    commercialUtilities: [
        'Electricity',
        'Gas',
        'Maintenance',
        'Water'
    ]
}


