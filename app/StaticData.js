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
        { value: '1', name: '01' },
        { value: '2', name: '02' },
        { value: '3', name: '03' },
        { value: '4', name: '04' },
        { value: '5', name: '05' },
        { value: '6', name: '06' },
        { value: '7', name: '07' },
        { value: '8', name: '08' },
        { value: '9', name: '09' },
        { value: '10', name: '10' },
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
    projectType : [
        { value: 'shop', name: 'shop' },
        { value: 'office', name: 'Office' },
        { value: 'other', name: 'other' },
        { value: 'food Court', name: 'Food Court' },
        { value: 'hotel Suite', name: 'Hotel Suite' },
        { value: 'harley Center', name: 'Harley Center' },
        { value: 'other', name: 'other' },
      ]
}
