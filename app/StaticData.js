/** @format */

export default StaticData = {
  taskValues: [
    {
      name: 'Meeting',
      value: 'meeting',
    },
    {
      name: 'Follow Up',
      value: 'follow up',
    },
    {
      name: 'Other',
      value: 'other',
    },
  ],
  taskValuesCMLead: [
    {
      name: 'Follow Up',
      value: 'follow up',
    },
    {
      name: 'Other',
      value: 'other',
    },
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
    { value: 'rent', name: 'Rent' },
  ],
  type: [
    { value: 'residential', name: 'Residential' },
    { value: 'plot', name: 'Plot' },
    { value: 'commercial', name: 'Commercial' },
  ],
  subType: {
    residential: [
      { value: 'house', name: 'House' },
      { value: 'guest house', name: 'Guest house' },
      { value: 'apartment', name: 'Apartment' },
      { value: 'upper portion', name: 'Upper portion' },
      { value: 'lower portion', name: 'Lower portion' },
      { value: 'farm house', name: 'Farm house' },
      { value: 'room', name: 'Room' },
      { value: 'penthouse', name: 'Penthouse' },
      { value: 'hotel suites', name: 'Hotel suites' },
      { value: 'basement', name: 'Basement' },
      { value: 'annexe', name: 'Annexe' },
      { value: 'hostel', name: 'Hostel' },
      { value: 'other', name: 'Other' },
    ],
    plot: [
      { value: 'residential plot', name: 'Residential Plot' },
      { value: 'commercial plot', name: 'Commercial Plot' },
      { value: 'agricultural land', name: 'Agricultural Land' },
      { value: 'industrial land', name: 'Industrial Land' },
      { value: 'plot file', name: 'Plot File' },
      { value: 'farmhouse plot', name: 'Farmhouse Plot' },
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
      { value: 'hall', name: 'Hall' },
      { value: 'land', name: 'Land' },
      { value: 'plaza', name: 'Plaza' },
      { value: 'other', name: 'Other' },
    ],
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
      dateCreated: '9:30 am, Mar 29',
    },
    {
      id: 2,
      title: 'Receipt',
      fileName: 'Payment_Receipt2.JPG',
      size: '',
      uri: '',
      dateCreated: '1:30 pm, Mar 30',
    },
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
      value: 'silver',
    },
    {
      name: 'GOLD PACKAGE',
      value: 'gold',
    },
  ],
  leadCloseReasons: [
    {
      name: 'Client not responding',
      value: 'client_not_responding',
    },
    {
      name: 'Client withdrew requirements',
      value: 'client_withdrew_requirements',
    },
    {
      name: 'No property found',
      value: 'no_property_found',
    },
    {
      name: 'Client got property from some other source',
      value: 'property_other_source',
    },
    {
      name: 'Client not satisfied with options',
      value: 'client_not_satisfied',
    },
    {
      name: 'Client not interested',
      value: 'client_not_interested',
    },
    { value: 'low_budget', name: 'Low Budget' },
    { value: 'different_city', name: 'Different City' },
  ],
  leadCloseReasonsWithPayment: [
    {
      name: 'Payment Done',
      value: 'payment_done',
    },
    // {
    //     name: 'Client not responding',
    //     value: 'client_not_responding'
    // },
    // {
    //     name: 'Client withdrew requirements',
    //     value: 'client_withdrew_requirements'
    // },
    // {
    //     name: 'No property found',
    //     value: 'no_property_found'
    // },
    // {
    //     name: 'Client got property from some other source',
    //     value: 'property_other_source'
    // }, {
    //     name: 'Client not satisfied with options',
    //     value: 'client_not_satisfied'
    // }
  ],
  paymentPopupDone: [
    {
      name: 'Payment Done',
      value: 'payment_done',
    },
    // {
    //     name: 'Client not responding',
    //     value: 'client_not_responding'
    // },
    // {
    //     name: 'Client not satisfied with options',
    //     value: 'client_not_satisfied'
    // }
  ],
  paymentPopup: [
    {
      name: 'Client not responding',
      value: 'client_not_responding',
    },
    {
      name: 'Client not interested',
      value: 'client_not_interested',
    },
    {
      name: 'Client not satisfied with options',
      value: 'client_not_satisfied',
    },
    {
      name: 'Duplicate Lead',
      value: 'duplicate_lead',
    },
    {
      name: 'Client is an Agent',
      value: 'client_is_an_agent',
    },
    { value: 'low_budget', name: 'Low Budget' },
    { value: 'different_city', name: 'Different City' },
  ],
  paymentPopupAnyPaymentAdded: [
    {
      name: 'Refund',
      value: 'refund',
    },
    {
      name: 'Adjustment',
      value: 'adjustment',
    },
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
    { value: 'no_response_busy', name: 'No Response - Busy' },
    { value: 'no_response_no_signals', name: 'No Response - No signals' },
    { value: 'not_interested', name: 'Not Interested' },
    { value: 'not_interested_low_budget', name: 'Not Interested - Low Budget' },
    { value: 'not_interested_re_only', name: 'Not Interested - Interested in RE Only' },
    { value: 'not_interested_out_of_city', name: 'Not Interested - Out of City' },
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
    { value: 'number_not_on_whatsapp', name: 'Number not on WhatsApp' },

  ],
  meetingStatus: [
    { value: 'visited', name: 'Visited' },
    { value: 'deal_expected', name: 'Deal Expected' },
    { value: 'deal_signed', name: 'Deal Signed' },
    { value: 'cancel_meeting', name: 'Cancel Meeting' },
  ],
  ppbuyRentFilter: [
    { value: 'open', name: 'Open' },
    { value: 'called', name: 'Called' },
    { value: 'viewing', name: 'Viewing' },
    { value: 'closed_won', name: 'Closed Won' },
    { value: 'closed_lost', name: 'Closed Lost' },
  ],
  buyRentFilter: [
    { value: 'all', name: 'All' },
    { value: 'open', name: 'Open' },
    { value: 'called', name: 'Called' },
    { value: 'no_response', name: 'No Response' },
    { value: 'no_response_busy', name: 'No Response - Busy' },
    { value: 'no_response_no_signals', name: 'No Response - No signals' },
    { value: 'not_interested', name: 'Not Interested' },
    { value: 'not_interested_low_budget', name: 'Not Interested - Low Budget' },
    { value: 'not_interested_re_only', name: 'Not Interested - Interested in RE Only' },
    { value: 'not_interested_out_of_city', name: 'Not Interested - Out of City' },
    { value: 'powered_off', name: 'Powered Off' },
    { value: 'invalid_number', name: 'Invalid Number' },
    { value: 'DNC', name: 'DNC' },
    { value: 'details_texted', name: 'No Response but Details Sent' },
    { value: 'other_agent', name: 'In contact with some other agent' },
    { value: 'call_back', name: 'Call Back' },
    { value: 'awaiting_call', name: 'Awaiting Response' },
    { value: 'follow up', name: 'Follow up' },
    { value: 'details_sent', name: 'Details Sent' },
    { value: 'expected_visit', name: 'Expected Visit' },
    { value: 'viewing', name: 'Viewing' },
    { value: 'offer', name: 'Offer' },
    { value: 'propsure', name: 'Propsure' },
    { value: 'token', name: 'Deal Signed - Token' },
    { value: 'payment', name: 'Payments' },
    { value: 'closed_won', name: 'Closed Won' },
    { value: 'closed_lost', name: 'Closed Lost' },
    { value: 'low_budget', name: 'Low Budget' },
    { value: 'different_city', name: 'Different City' },
  ],
  ppBuyRentFilter: [
    { value: 'all', name: 'All' },
    { value: 'called', name: 'Called' },
    { value: 'viewing', name: 'Viewing' },
    { value: 'closed_won', name: 'Closed Won' },
    { value: 'closed_lost', name: 'Closed Lost' },
  ],
  investmentFilter: [
    { value: 'all', name: 'All' },
    { value: 'open', name: 'Open' },
    { value: 'called', name: 'Called' },
    { value: 'no_response', name: 'No Response' },
    { value: 'no_response_busy', name: 'No Response - Busy' },
    { value: 'no_response_no_signals', name: 'No Response - No signals' },
    { value: 'not_interested', name: 'Not Interested' },
    { value: 'not_interested_low_budget', name: 'Not Interested - Low Budget' },
    { value: 'not_interested_re_only', name: 'Not Interested - Interested in RE Only' },
    { value: 'not_interested_out_of_city', name: 'Not Interested - Out of City' },
    { value: 'powered_off', name: 'Powered Off' },
    { value: 'invalid_number', name: 'Invalid Number' },
    { value: 'DNC', name: 'DNC' },
    { value: 'details_texted', name: 'No Response but Details Sent' },
    { value: 'other_agent', name: 'In contact with some other agent' },
    { value: 'call_back', name: 'Call Back' },
    { value: 'awaiting_call', name: 'Awaiting Response' },
    { value: 'follow_up', name: 'Follow up' },
    { value: 'details_sent', name: 'Details Sent' },
    { value: 'expected_visit', name: 'Expected Visit' },
    { value: 'meeting', name: 'Meeting Planned' },
    { value: 'visited', name: 'Visited' },
    { value: 'deal_expected', name: 'Deal Expected' },
    { value: 'deal_signed', name: 'Deal Signed' },
    { value: 'token', name: 'Token' },
    { value: 'payment', name: 'Payment' },
    { value: 'closed_won', name: 'Closed Won' },
    { value: 'closed_lost', name: 'Closed Lost' },
    { value: 'low_budget', name: 'Low Budget' },
    { value: 'different_city', name: 'Different City' },
    { value: 'number_not_on_whatsapp', name: 'Number not on WhatsApp' },
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
    closed_won: 1,
    closed_lost: 1,
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
    token: 1,
    payment: 1,
    closed_won: 1,
    closed_lost: 1,
  },
  sortData: [
    { name: 'Newest First', value: '&order=Desc&field=createdAt' },
    { name: 'Newest Last', value: '&order=Asc&field=createdAt' },
    { name: 'Recently Modified First', value: '&order=Desc&field=updatedAt' },
    { name: 'Recently Modified Last', value: '&order=Asc&field=updatedAt' },
    { name: 'Status Based', value: '&order=sort&field=status' },
  ],
  sortDataSellRent: [
    { name: 'Newest First', value: '&order=Desc&field=createdAt' },
    { name: 'Newest Last', value: '&order=Asc&field=createdAt' },
    { name: 'Recently Modified First', value: '&order=Desc&field=updatedAt' },
    { name: 'Recently Modified Last', value: '&order=Asc&field=updatedAt' },
  ],
  barCharData: {
    labels: ['Created', 'Call', 'Meeting', 'Token', 'Payment', 'Won', 'Lost'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      },
    ],
  },
  rcmBarCharData: {
    labels: ['Created', 'Called', 'Viewing', 'Offer', 'Propsure', 'Payment', 'Won', 'Lost'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      },
    ],
  },
  paymentOptions: [
    { value: 'full_payment', name: 'Full Payment' },
    { value: 'installments', name: 'Installments' },
  ],
  Constants: {
    lead_closed_won: 'closed_won',
    lead_closed_lost: 'closed_lost',
    any_value: 10000000000,
    size_any_value: 10000000,
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
  bedBathRange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1000],
  sizeMarla: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 40, 50, 10000000],
  sizeKanal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 30, 40, 50, 100, 10000000],
  sizeSqft: [
    0,
    1,
    100,
    500,
    1000,
    2000,
    3000,
    4000,
    5000,
    6000,
    7000,
    8000,
    9000,
    10000,
    15000,
    10000000,
  ],
  sizeSqm: [
    0,
    1,
    10,
    20,
    30,
    40,
    50,
    100,
    200,
    300,
    400,
    500,
    1000,
    2000,
    3000,
    4000,
    5000,
    10000,
    20000,
    30000,
    40000,
    50000,
    60000,
    10000000,
  ],
  searchTeamBy: [
    { value: 'myTeam', name: 'My Team' },
    { value: 'others', name: 'Others' },
  ],
  rentalPlanOptions: [
    { name: 'Investment Plan', value: 'Sold on Investment Plan' },
    { name: 'Rental Plan', value: 'Sold on Rental Plan' },
  ],
  planOptions: [{ name: 'Investment Plan', value: 'Sold on Investment Plan' }],
  installmentDue: [
    { name: 'Quarterly', value: 'quarterly' },
    { name: 'Monthly', value: 'monthly' },
  ],
  onlyQuarterly: [{ name: 'Quarterly', value: 'quarterly' }],
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
    'Nearby Landmark',
  ],
  residentialUtilities: ['Electricity', 'Gas', 'Maintenance', 'Water'],
  plotFeatures: [
    'Possession',
    'Corner',
    'Park Facing',
    'Boundary Wall',
    'Extra Land',
    'Main Boulevard',
  ],
  plotUtilities: ['Electricity', 'Gas', 'Sewerage', 'Water'],
  facing: [
    'North',
    'North West',
    'North East',
    'South',
    'South West',
    'South East',
    'East',
    'West',
  ],
  commercialFeatures: [
    'Central Heating',
    'Central Cooling',
    'Elevator/Lift',
    'Public Parking',
    'UnderGround Parking',
    'Internet',
    'CCTV Camera',
    'Backup Generator',
  ],
  commercialUtilities: ['Electricity', 'Gas', 'Maintenance', 'Water'],
  bedBathList: [
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
  ],
  fullPaymentType: [
    { value: 'cash', name: 'Cash' },
    { value: 'cheque', name: 'Cheque' },
    { value: 'pay-Order', name: 'Pay-Order' },
    { value: 'Remittance', name: 'Remittance' },
    { value: 'bank-Transfer', name: 'Bank-Transfer' },
    { value: 'e-Gateway', name: 'E-Gateway' },
  ],
  investFullPaymentType: [
    { value: 'cash', name: 'Cash' },
    { value: 'cheque', name: 'Cheque' },
    { value: 'pay-Order', name: 'Pay-Order' },
    { value: 'Remittance', name: 'Remittance' },
    { value: 'bank-Transfer', name: 'Bank-Transfer' },
    { value: 'e-Gateway', name: 'E-Gateway' },
    { value: 'Buy Back Adjustment', name: 'Buy Back Adjustment' },
    { value: 'Rebate Adjustment', name: 'Rebate Adjustment' },
    { value: 'Rent Adjustment', name: 'Rent Adjustment' },
    { value: 'Inter-Mall Adjustment', name: 'Inter-Mall Adjustment' },
  ],
  unitType: [
    { value: 'fullUnit', name: 'Full Unit' },
    { value: 'pearl', name: 'Pearl' },
  ],
  onlyUnitType: [{ value: 'fullUnit', name: 'Full Unit' }],
  paymentTypeForToken: [
    { value: 'Token', name: 'Token' },
    { value: 'Payment', name: 'Other Payment' },
  ],
  statusOptions: [
    { label: 'Open', value: 'open' },
    { label: 'Pending Account', value: 'pendingAccount' },
    { label: 'Pending Account HQ', value: 'pendingAccountHq' },
    { label: 'Pending Sales', value: 'pendingSales' },
    { label: 'Pending at Bank', value: 'bankPending' },
    { label: 'Not Cleared', value: 'notCleared' },
    { label: 'Cleared', value: 'cleared' },
  ],
  tokenStatusOptions: [
    { label: 'At Buyer Agent', value: 'at_buyer_agent' },
    {
      label: `At Property Agent${'\n'}(Pending Verification)`,
      value: 'at_property_agent_pending_verification',
    },
    {
      label: `At Buyer Agent${'\n'}(Pending Verification)`,
      value: 'at_buyer_agent_pending_verification',
    },

    { label: 'Give back to buyer', value: 'given_back_to_buyer' },
    { label: 'Given to Property Owner', value: 'given_to_property_owner' },
    { label: 'At Property Agent', value: 'at_property_agent' },
    { label: 'Pending Account', value: 'pendingAccount' },
    { label: 'Pending Account HQ', value: 'pendingAccountHq' },
    { label: 'Pending Sales', value: 'pendingSales' },
    { label: 'Pending at Bank', value: 'bankPending' },
    { label: 'Not Cleared', value: 'notCleared' },
    { label: 'Cleared', value: 'cleared' },
  ],
  paymentStatuses: [
    'pendingAccount',
    'pendingAccountHq',
    'pendingSales',
    'bankPending',
    'notCleared',
    'cleared',
  ],
  singleBuyerTokenStatuses: [
    { label: 'Given to Property Owner', value: 'given_to_property_owner' },
    { label: 'Deposit to Accounts', value: 'pendingAccount' },
    { label: 'Give back to Buyer', value: 'given_back_to_buyer' },
  ],
  singlePropertyOwner: [{ label: 'Take Back from Property Owner', value: 'at_buyer_agent' }],
  addToken: [{ label: 'Add New Token', value: 'add_new_token' }],
  buyerTokenStatuses: [
    { label: 'Give to Property Agent', value: 'at_property_agent_pending_verification' },
    { label: 'Deposit to Accounts', value: 'pendingAccount' },
    { label: 'Give back to Buyer', value: 'given_back_to_buyer' },
  ],
  buyerTokenReceived: [
    { label: 'Received', value: 'at_buyer_agent' },
    { label: 'Not Received', value: 'at_property_agent' },
  ],
  sellerTokenStatuses: [
    { label: 'Give To Property Owner', value: 'given_to_property_owner' },
    { label: 'Deposit to Accounts', value: 'pendingAccount' },
    { label: 'Given Back to Buyer Agent', value: 'at_buyer_agent_pending_verification' },
  ],
  sellerTokenReceived: [
    { label: 'Received', value: 'at_property_agent' },
    { label: 'Not Received', value: 'at_buyer_agent' },
  ],
  sellerTakeBackToken: [{ label: 'Take back from Property Owner', value: 'at_property_agent' }],
  leadClearedStatus: 'cleared',
  propsureReportTypes: [
    { name: 'Basic Property Survey Report', price: '100' },
    { name: 'Title Report', price: '100' },
    { name: 'Master Plan Report', price: '100' },
    { name: 'By-Laws Report', price: '100' },
    { name: 'Demarcation Report', price: '100' },
    { name: 'Market Price Report', price: '100' },
    { name: 'Structure Survey Report', price: '100' },
    { name: 'Utility Services Report', price: '100' },
    { name: 'Regulatory Report', price: '100' },
    { name: 'Urban Hazard Report', price: '100' },
    { name: 'Livability Report', price: '100' },
    { name: 'Floor Plan Report', price: '100' },
    { name: 'Energy Efficiency Report', price: '100' },
  ],
  graanaPropertiesStatusForRent: [
    { label: 'Available for Rent', value: 'available_for_rent' },
    { label: 'Rented', value: 'rented' },
  ],
  graanaPropertiesStatusForSale: [
    { label: 'Available for Sale', value: 'available_for_sale' },
    { label: 'Sold', value: 'sold' },
  ],
  areaManagerCheckList: [
    'Client Pre-Viewing Follow Up Call - 30 Minutes Prior to Viewing',
    'PP/POC Pre-Viewing Follow Up Call - 30 Minutes Prior to Viewing',
    'Reach viewing location - 15 Minutes Prior to Viewing',
    'Ensure Key by PP/POC',
    'Visit the property before viewing with the client',
    'Sell core features of property as required by client',
    'Brief and try to sign-up on service charge agreeement SCA by the client',
    'Pitch Propsure Service/Brochure',
    'Up Sell other services (As and when Applicable)',
  ],
  realEstateAgentsCheckList: [
    'Client Pre-Viewing Follow Up Call (For Keys/Visit) - 1 Hrs Prior to Viewing',
    'Coordination Call with Graana AM/Buyer Side - 30 Minutes Prior to Viewing',
    'Reach viewing location - 15 Minutes Prior to Viewing',
    'Ensure Key from owner',
    'Sell core features of property as required by client',
  ],
  fieldAppStatusFilters: [
    { value: 'onhold', name: 'Pending' },
    { value: 'pending', name: 'Approved' },
    { value: 'rejected', name: 'Rejected' },
  ],
  searchBy: [
    { value: 'id', name: 'ID' },
    { value: 'area', name: 'Area' },
  ],
  searchByIdOnly: [{ value: 'id', name: 'ID' }],

  graanaStatusFilters: [
    { value: 'published', name: 'All' },
    { value: 'pendingVerification', name: 'Pending Re-verification' },
    { value: 'geotagged', name: 'Geo Tagged' },
  ],
  graanaStatusFiltersPP: [{ value: 'published', name: 'All' }],
  legalData: [
    {
      fileName: '20210121_171317_0.jpg',
      size: 2586345,
      title: 'Hdhdhd',
      uri:
        'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540graanadevteam%252Farms/DocumentPicker/58004b03-9a72-431d-9311-8f5bc6732d21.jpg',
      status: 'pending',
    },
    {
      fileName: '20210121_171317_0.jpg',
      size: 2586345,
      title: 'Hdhdhd',
      uri:
        'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540graanadevteam%252Farms/DocumentPicker/58004b03-9a72-431d-9311-8f5bc6732d21.jpg',
      status: 'approved',
    },
    {
      fileName: '20210121_171317_0.jpg',
      size: 2586345,
      title: 'Hdhdhd',
      uri:
        'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540graanadevteam%252Farms/DocumentPicker/58004b03-9a72-431d-9311-8f5bc6732d21.jpg',
      status: 'approved',
    },
  ],
  BuyerLegalDocumentsList: [
    {
      category: 'service_charge_agreement',
      name: 'SERVICE CHARGE AGREEMENT',
      status: 'pending',
      fileKey: null,
      id: 1,
    },
    { category: 'cnic', name: 'CNIC', status: 'pending', fileKey: null, id: 2 },
    {
      category: 'property_report_propsure',
      name: 'PROPERTY REPORT - PROPSURE',
      status: 'pending',
      fileKey: null,
      id: 3,
    },
    {
      category: 'sales_rent_agreement',
      name: 'SALES/RENT AGREEMENT',
      status: 'pending',
      fileKey: null,
      id: 4,
    },
    {
      category: 'initial_payment_receipt',
      name: 'INITIAL PAYMENT RECEIPT',
      status: 'pending',
      fileKey: null,
      id: 5,
    },
  ],
  SellerLegalDocumentsList: [
    {
      category: 'sole_multi_agency_agreement',
      name: 'SOLE/MULTI AGENCY AGREEMENT',
      status: 'pending',
      fileKey: null,
      id: 1,
    },
    { category: 'cnic', name: 'CNIC', status: 'pending', fileKey: null, id: 2 },
    {
      category: 'base_property_report_propsure',
      name: 'BASIC PROPERTY REPORT - PROPSURE',
      status: 'pending',
      fileKey: null,
      id: 3,
    },
    {
      category: 'sales_rent_agreement',
      name: 'SALES/RENT AGREEMENT',
      status: 'pending',
      fileKey: null,
      id: 4,
    },
    {
      category: 'initial_payment_receipt',
      name: 'INITIAL PAYMENT RECEIPT',
      status: 'pending',
      fileKey: null,
      id: 5,
    },
  ],
  checkListData: {
    category: 'legal_checklist',
    name: 'CHECKLIST',
    status: 'pending',
    fileKey: null,
    id: 5,
  },
  legalStatuses: [
    { value: 'pending', name: 'pending' },
    { value: 'pending_legal', name: 'pending legal' },
    { value: 'rejected', name: 'Rejected' },
    { value: 'approved', name: 'Approved' },
  ],
}
