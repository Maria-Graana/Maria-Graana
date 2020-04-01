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
            name: 'Day Structure',
            value: 'day structure'
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
    attachmentsRows: [
        {
            id: 1,
            title: 'Contract',
            fileName: 'Contract_20thMarch.PDF',
            dateCreated: '9:30 am, Mar 29'
        },
        {
            id: 2,
            title: 'Receipt',
            fileName: 'Payment_Receipt2.JPG',
            dateCreated: '1:30 pm, Mar 30'
        }
    ]
}