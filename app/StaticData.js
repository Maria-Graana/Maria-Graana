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
            name:'Meeting',
            value: 'Meeting'
        },
        {
            name:'Follow Up',
            value: 'Follow Up'
        },
        {
            name:'Day Structure',
            value: 'Day Structure'
        },
        {
            name:'Other',
            value: 'Other'
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
        { value: 'sqm', name: 'sqm' },
        { value: 'sqft', name: 'sqft' },
        { value: 'sqyd', name: 'sqyd' },
        { value: 'kanal', name: 'kanal' },
        { value: 'marla', name: 'marla' },
    ],
    type: [
        { value: 'residential', name: 'Residential' },
        { value: 'plot', name: 'Plot' },
        { value: 'commercial', name: 'Commercial' },
    ],
    subType: {
        residential: [
            { value: 'house', name: 'house' }, { value: 'guest house', name: 'guest house' },
            { value: 'apartment', name: 'apartment' }, { value: 'upper portion', name: 'upper portion' },
            { value: 'lower portion', name: 'lower portion' }, { value: 'farm house', name: 'farm house' },
            { value: 'room', name: 'room' }, { value: 'penthouse', name: 'penthouse' },
            { value: 'hotel suites', name: 'hotel suites' }, { value: 'basement', name: 'basement' },
            { value: 'annexe', name: 'annexe' }, { value: 'hostel', name: 'hostel' },
            { value: 'other', name: 'other' },
        ],
        plot: [
            { value: 'residential plot', name: 'residential plot' }, { value: 'commercial plot', name: 'commercial plot' },
            { value: 'agricultural land', name: 'agricultural land' }, { value: 'industrial land', name: 'industrial land' },
            { value: 'plot file', name: 'plot file' }, { value: 'farmhouse plot', name: 'farmhouse plot' },
        ],
        commercial: [
            { value: 'office', name: 'office' },
            { value: 'shop', name: 'shop' },
            { value: 'warehouse', name: 'warehouse' },
            { value: 'factory', name: 'factory' },
            { value: 'building', name: 'building' },
            { value: 'theatre', name: 'theatre' },
            { value: 'Gym', name: 'Gym' },
            { value: 'Food Court', name: 'Food Court' },
            { value: 'other', name: 'other' },
        ]
    }
}