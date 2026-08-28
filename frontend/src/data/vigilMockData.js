/*
  VIGIL MOCK DATA
  ----------------
  Temporary frontend data only.

  This file is structured so that the Python/Flask backend
  can later replace these objects with API responses.

  Current scope:
  Nagpur City only.

  IMPORTANT:
  The values below are simulated demonstration values.
  They are NOT real-time official traffic statistics.
*/


/* =========================================================
   CITY SITUATION
   ========================================================= */

export const citySituation = {
  trafficDensity: 74,
  riskScore: 78,

  accidents: 18,
  activeIncidents: 9,
  highRiskAreas: 6,

  policeAvailable: 180,
  policeDeployed: 142,
  policeRequired: 165,
};


/* =========================================================
   AREA SITUATION
   ========================================================= */

export const areaSituation = {
  Sadar: {
    trafficDensity: 82,
    riskScore: 80,
    policeAvailable: 18,
    policeAllocated: 14,
    policeRequired: 17,
  },

  Sitabuldi: {
    trafficDensity: 91,
    riskScore: 94,
    policeAvailable: 20,
    policeAllocated: 15,
    policeRequired: 20,
  },

  Dharampeth: {
    trafficDensity: 74,
    riskScore: 76,
    policeAvailable: 16,
    policeAllocated: 12,
    policeRequired: 15,
  },

  "Civil Lines": {
    trafficDensity: 61,
    riskScore: 58,
    policeAvailable: 12,
    policeAllocated: 9,
    policeRequired: 10,
  },

  Mahal: {
    trafficDensity: 68,
    riskScore: 65,
    policeAvailable: 14,
    policeAllocated: 10,
    policeRequired: 12,
  },

  Itwari: {
    trafficDensity: 87,
    riskScore: 85,
    policeAvailable: 18,
    policeAllocated: 13,
    policeRequired: 17,
  },

  Dhantoli: {
    trafficDensity: 72,
    riskScore: 70,
    policeAvailable: 14,
    policeAllocated: 10,
    policeRequired: 13,
  },

  "Laxmi Nagar": {
    trafficDensity: 66,
    riskScore: 62,
    policeAvailable: 12,
    policeAllocated: 9,
    policeRequired: 11,
  },

  Ambazari: {
    trafficDensity: 59,
    riskScore: 52,
    policeAvailable: 10,
    policeAllocated: 8,
    policeRequired: 9,
  },

  Ajni: {
    trafficDensity: 78,
    riskScore: 76,
    policeAvailable: 15,
    policeAllocated: 11,
    policeRequired: 14,
  },

  "Manish Nagar": {
    trafficDensity: 73,
    riskScore: 70,
    policeAvailable: 14,
    policeAllocated: 10,
    policeRequired: 13,
  },

  "Wardha Road": {
    trafficDensity: 89,
    riskScore: 88,
    policeAvailable: 18,
    policeAllocated: 13,
    policeRequired: 17,
  },

  Ganeshpeth: {
    trafficDensity: 76,
    riskScore: 73,
    policeAvailable: 13,
    policeAllocated: 10,
    policeRequired: 12,
  },

  "Cotton Market": {
    trafficDensity: 79,
    riskScore: 76,
    policeAvailable: 13,
    policeAllocated: 9,
    policeRequired: 12,
  },

  Gandhibagh: {
    trafficDensity: 84,
    riskScore: 82,
    policeAvailable: 15,
    policeAllocated: 11,
    policeRequired: 14,
  },

  Nandanvan: {
    trafficDensity: 63,
    riskScore: 57,
    policeAvailable: 11,
    policeAllocated: 8,
    policeRequired: 10,
  },

  Sakkardara: {
    trafficDensity: 71,
    riskScore: 67,
    policeAvailable: 12,
    policeAllocated: 9,
    policeRequired: 11,
  },

  "Pratap Nagar": {
    trafficDensity: 65,
    riskScore: 60,
    policeAvailable: 11,
    policeAllocated: 8,
    policeRequired: 10,
  },

  "Bajaj Nagar": {
    trafficDensity: 69,
    riskScore: 64,
    policeAvailable: 11,
    policeAllocated: 8,
    policeRequired: 10,
  },

  Mankapur: {
    trafficDensity: 58,
    riskScore: 48,
    policeAvailable: 9,
    policeAllocated: 7,
    policeRequired: 8,
  },

  Gittikhadan: {
    trafficDensity: 55,
    riskScore: 44,
    policeAvailable: 9,
    policeAllocated: 7,
    policeRequired: 8,
  },

  Jaripatka: {
    trafficDensity: 62,
    riskScore: 55,
    policeAvailable: 10,
    policeAllocated: 7,
    policeRequired: 9,
  },

  Wadi: {
    trafficDensity: 57,
    riskScore: 45,
    policeAvailable: 8,
    policeAllocated: 6,
    policeRequired: 7,
  },

  Hudkeshwar: {
    trafficDensity: 64,
    riskScore: 57,
    policeAvailable: 10,
    policeAllocated: 7,
    policeRequired: 9,
  },

  Sonegaon: {
    trafficDensity: 67,
    riskScore: 61,
    policeAvailable: 10,
    policeAllocated: 7,
    policeRequired: 9,
  },

  Lakadganj: {
    trafficDensity: 81,
    riskScore: 79,
    policeAvailable: 15,
    policeAllocated: 10,
    policeRequired: 13,
  },
};


/* =========================================================
   INCIDENTS
   ========================================================= */

export const incidents = [
  {
    id: "INC-001",
    type: "Accident",
    location: "Wardha Road",
    area: "Ajni",
    street: "Wardha Road",
    severity: "Critical",
    status: "Active",
    reportedAt: "12 min ago",

    description:
      "Major road accident causing heavy traffic congestion.",

    officers: 5,
    trafficDensity: 92,
    confidence: 96,

    policeAllocated: 5,
    policeRequired: 8,
  },

  {
    id: "INC-002",
    type: "Traffic Congestion",
    location: "Sitabuldi Square",
    area: "Sitabuldi",
    street: "Sitabuldi Main Road",
    severity: "High",
    status: "Active",
    reportedAt: "27 min ago",

    description:
      "Heavy congestion reported during peak traffic movement.",

    officers: 4,
    trafficDensity: 91,
    confidence: 93,

    policeAllocated: 4,
    policeRequired: 7,
  },

  {
    id: "INC-003",
    type: "Accident",
    location: "Central Avenue",
    area: "Gandhibagh",
    street: "Central Avenue",
    severity: "High",
    status: "Investigating",
    reportedAt: "38 min ago",

    description:
      "Collision involving two vehicles. Traffic movement partially affected.",

    officers: 3,
    trafficDensity: 84,
    confidence: 91,

    policeAllocated: 3,
    policeRequired: 6,
  },

  {
    id: "INC-004",
    type: "Traffic Congestion",
    location: "Manewada Road",
    area: "Manish Nagar",
    street: "Manewada Road",
    severity: "Medium",
    status: "Monitoring",
    reportedAt: "41 min ago",

    description:
      "Moderate congestion detected around the junction.",

    officers: 2,
    trafficDensity: 73,
    confidence: 88,

    policeAllocated: 2,
    policeRequired: 4,
  },

  {
    id: "INC-005",
    type: "Road Obstruction",
    location: "Kamptee Road",
    area: "Jaripatka",
    street: "Kamptee Road",
    severity: "Medium",
    status: "Resolved",
    reportedAt: "1 hr ago",

    description:
      "Temporary obstruction affected one lane of the road.",

    officers: 2,
    trafficDensity: 62,
    confidence: 86,

    policeAllocated: 2,
    policeRequired: 3,
  },

  {
    id: "INC-006",
    type: "Accident",
    location: "Sadar Main Road",
    area: "Sadar",
    street: "Sadar Main Road",
    severity: "High",
    status: "Active",
    reportedAt: "1 hr ago",

    description:
      "Vehicle collision reported near a busy intersection.",

    officers: 4,
    trafficDensity: 82,
    confidence: 94,

    policeAllocated: 4,
    policeRequired: 7,
  },

  {
    id: "INC-007",
    type: "Traffic Congestion",
    location: "Itwari Market",
    area: "Itwari",
    street: "Itwari Main Road",
    severity: "High",
    status: "Monitoring",
    reportedAt: "1 hr ago",

    description:
      "Heavy market-area traffic causing slow movement.",

    officers: 4,
    trafficDensity: 87,
    confidence: 90,

    policeAllocated: 4,
    policeRequired: 7,
  },

  {
    id: "INC-008",
    type: "Road Obstruction",
    location: "Lakadganj",
    area: "Lakadganj",
    street: "Lakadganj Main Road",
    severity: "Medium",
    status: "Resolved",
    reportedAt: "2 hrs ago",

    description:
      "Temporary obstruction affected traffic flow.",

    officers: 2,
    trafficDensity: 81,
    confidence: 84,

    policeAllocated: 2,
    policeRequired: 4,
  },
];


/* =========================================================
   TRAFFIC HISTORY
   ========================================================= */

export const trafficHistory = {
  day: [
    { label: "06:00", traffic: 32 },
    { label: "07:00", traffic: 48 },
    { label: "08:00", traffic: 67 },
    { label: "09:00", traffic: 74 },
    { label: "10:00", traffic: 61 },
    { label: "11:00", traffic: 55 },
    { label: "12:00", traffic: 58 },
    { label: "13:00", traffic: 63 },
    { label: "14:00", traffic: 59 },
    { label: "15:00", traffic: 64 },
    { label: "16:00", traffic: 71 },
    { label: "17:00", traffic: 82 },
    { label: "18:00", traffic: 91 },
    { label: "19:00", traffic: 88 },
    { label: "20:00", traffic: 76 },
    { label: "21:00", traffic: 64 },
    { label: "22:00", traffic: 51 },
  ],

  month: [
    { label: "1", traffic: 54 },
    { label: "2", traffic: 58 },
    { label: "3", traffic: 61 },
    { label: "4", traffic: 57 },
    { label: "5", traffic: 63 },
    { label: "6", traffic: 66 },
    { label: "7", traffic: 62 },
    { label: "8", traffic: 69 },
    { label: "9", traffic: 72 },
    { label: "10", traffic: 68 },
    { label: "11", traffic: 71 },
    { label: "12", traffic: 74 },
    { label: "13", traffic: 70 },
    { label: "14", traffic: 76 },
    { label: "15", traffic: 79 },
    { label: "16", traffic: 73 },
    { label: "17", traffic: 81 },
    { label: "18", traffic: 84 },
    { label: "19", traffic: 78 },
    { label: "20", traffic: 75 },
    { label: "21", traffic: 80 },
    { label: "22", traffic: 83 },
    { label: "23", traffic: 77 },
    { label: "24", traffic: 85 },
    { label: "25", traffic: 88 },
    { label: "26", traffic: 82 },
    { label: "27", traffic: 79 },
    { label: "28", traffic: 86 },
    { label: "29", traffic: 81 },
    { label: "30", traffic: 84 },
    { label: "31", traffic: 87 },
  ],

  year: [
    { label: "Jan", traffic: 58 },
    { label: "Feb", traffic: 61 },
    { label: "Mar", traffic: 64 },
    { label: "Apr", traffic: 60 },
    { label: "May", traffic: 67 },
    { label: "Jun", traffic: 71 },
    { label: "Jul", traffic: 69 },
    { label: "Aug", traffic: 74 },
    { label: "Sep", traffic: 78 },
    { label: "Oct", traffic: 82 },
    { label: "Nov", traffic: 79 },
    { label: "Dec", traffic: 85 },
  ],
};


/* =========================================================
   TRAFFIC BY AREA
   ========================================================= */

export const trafficByArea = [
  {
    name: "Sitabuldi",
    value: 91,
  },
  {
    name: "Wardha Road",
    value: 89,
  },
  {
    name: "Itwari",
    value: 87,
  },
  {
    name: "Gandhibagh",
    value: 84,
  },
  {
    name: "Sadar",
    value: 82,
  },
  {
    name: "Lakadganj",
    value: 81,
  },
  {
    name: "Ajni",
    value: 78,
  },
  {
    name: "Ganeshpeth",
    value: 76,
  },
  {
    name: "Dharampeth",
    value: 74,
  },
  {
    name: "Manish Nagar",
    value: 73,
  },
  {
    name: "Dhantoli",
    value: 72,
  },
  {
    name: "Sakkardara",
    value: 71,
  },
  {
    name: "Bajaj Nagar",
    value: 69,
  },
  {
    name: "Mahal",
    value: 68,
  },
  {
    name: "Sonegaon",
    value: 67,
  },
  {
    name: "Laxmi Nagar",
    value: 66,
  },
  {
    name: "Pratap Nagar",
    value: 65,
  },
  {
    name: "Hudkeshwar",
    value: 64,
  },
  {
    name: "Nandanvan",
    value: 63,
  },
  {
    name: "Jaripatka",
    value: 62,
  },
  {
    name: "Civil Lines",
    value: 61,
  },
  {
    name: "Ambazari",
    value: 59,
  },
  {
    name: "Mankapur",
    value: 58,
  },
  {
    name: "Wadi",
    value: 57,
  },
  {
    name: "Gittikhadan",
    value: 55,
  },
];


/* =========================================================
   TRAFFIC ZONES
   ========================================================= */

export const trafficZones =
  trafficByArea.map((item) => ({
    area: item.name,
    traffic: item.value,
    dataAvailable: true,
  }));


/* =========================================================
   AREA RANKING
   ========================================================= */

export const areaRanking = [
  {
    area: "Sitabuldi",
    traffic: 91,
    risk: 94,
    required: 20,
    allocated: 15,
  },

  {
    area: "Wardha Road",
    traffic: 89,
    risk: 88,
    required: 17,
    allocated: 13,
  },

  {
    area: "Itwari",
    traffic: 87,
    risk: 85,
    required: 17,
    allocated: 13,
  },

  {
    area: "Gandhibagh",
    traffic: 84,
    risk: 82,
    required: 14,
    allocated: 11,
  },

  {
    area: "Sadar",
    traffic: 82,
    risk: 80,
    required: 17,
    allocated: 14,
  },

  {
    area: "Lakadganj",
    traffic: 81,
    risk: 79,
    required: 13,
    allocated: 10,
  },

  {
    area: "Ajni",
    traffic: 78,
    risk: 76,
    required: 14,
    allocated: 11,
  },

  {
    area: "Ganeshpeth",
    traffic: 76,
    risk: 73,
    required: 12,
    allocated: 10,
  },

  {
    area: "Dharampeth",
    traffic: 74,
    risk: 76,
    required: 15,
    allocated: 12,
  },

  {
    area: "Manish Nagar",
    traffic: 73,
    risk: 70,
    required: 13,
    allocated: 10,
  },

  {
    area: "Dhantoli",
    traffic: 72,
    risk: 70,
    required: 13,
    allocated: 10,
  },

  {
    area: "Sakkardara",
    traffic: 71,
    risk: 67,
    required: 11,
    allocated: 9,
  },

  {
    area: "Bajaj Nagar",
    traffic: 69,
    risk: 64,
    required: 10,
    allocated: 8,
  },

  {
    area: "Mahal",
    traffic: 68,
    risk: 65,
    required: 12,
    allocated: 10,
  },

  {
    area: "Sonegaon",
    traffic: 67,
    risk: 61,
    required: 9,
    allocated: 7,
  },

  {
    area: "Laxmi Nagar",
    traffic: 66,
    risk: 62,
    required: 11,
    allocated: 9,
  },

  {
    area: "Pratap Nagar",
    traffic: 65,
    risk: 60,
    required: 10,
    allocated: 8,
  },

  {
    area: "Hudkeshwar",
    traffic: 64,
    risk: 57,
    required: 9,
    allocated: 7,
  },

  {
    area: "Nandanvan",
    traffic: 63,
    risk: 57,
    required: 10,
    allocated: 8,
  },

  {
    area: "Jaripatka",
    traffic: 62,
    risk: 55,
    required: 9,
    allocated: 7,
  },

  {
    area: "Civil Lines",
    traffic: 61,
    risk: 58,
    required: 10,
    allocated: 9,
  },

  {
    area: "Ambazari",
    traffic: 59,
    risk: 52,
    required: 9,
    allocated: 8,
  },

  {
    area: "Mankapur",
    traffic: 58,
    risk: 48,
    required: 8,
    allocated: 7,
  },

  {
    area: "Wadi",
    traffic: 57,
    risk: 45,
    required: 7,
    allocated: 6,
  },

  {
    area: "Gittikhadan",
    traffic: 55,
    risk: 44,
    required: 8,
    allocated: 7,
  },
];


/* =========================================================
   RISK ZONES
   Used by the older RiskRanking component.
   ========================================================= */

export const riskZones = [
  {
    rank: 1,
    location: "Sitabuldi",
    area: "Sitabuldi Main Road",
    riskScore: 94,
    trafficLevel: "Very High",
    accidents: 8,
    congestion: 91,
    status: "Critical",
  },

  {
    rank: 2,
    location: "Wardha Road",
    area: "Wardha Road - Ajni",
    riskScore: 88,
    trafficLevel: "Very High",
    accidents: 6,
    congestion: 86,
    status: "Critical",
  },

  {
    rank: 3,
    location: "Central Avenue",
    area: "Central Avenue Road",
    riskScore: 84,
    trafficLevel: "Very High",
    accidents: 5,
    congestion: 82,
    status: "High",
  },

  {
    rank: 4,
    location: "Itwari",
    area: "Itwari Main Road",
    riskScore: 85,
    trafficLevel: "Very High",
    accidents: 5,
    congestion: 87,
    status: "Critical",
  },

  {
    rank: 5,
    location: "Sadar",
    area: "Sadar Main Road",
    riskScore: 80,
    trafficLevel: "High",
    accidents: 4,
    congestion: 82,
    status: "High",
  },

  {
    rank: 6,
    location: "Gandhibagh",
    area: "Central Avenue",
    riskScore: 82,
    trafficLevel: "High",
    accidents: 4,
    congestion: 84,
    status: "High",
  },

  {
    rank: 7,
    location: "Lakadganj",
    area: "Lakadganj Main Road",
    riskScore: 79,
    trafficLevel: "High",
    accidents: 3,
    congestion: 81,
    status: "High",
  },

  {
    rank: 8,
    location: "Ajni",
    area: "Ajni Square",
    riskScore: 76,
    trafficLevel: "High",
    accidents: 3,
    congestion: 78,
    status: "High",
  },

  {
    rank: 9,
    location: "Dharampeth",
    area: "Dharampeth Main Road",
    riskScore: 76,
    trafficLevel: "High",
    accidents: 2,
    congestion: 74,
    status: "High",
  },

  {
    rank: 10,
    location: "Ganeshpeth",
    area: "Ganeshpeth Road",
    riskScore: 73,
    trafficLevel: "High",
    accidents: 2,
    congestion: 76,
    status: "High",
  },

  {
    rank: 11,
    location: "Manish Nagar",
    area: "Manish Nagar Road",
    riskScore: 70,
    trafficLevel: "High",
    accidents: 2,
    congestion: 73,
    status: "High",
  },

  {
    rank: 12,
    location: "Dhantoli",
    area: "Dhantoli Main Road",
    riskScore: 70,
    trafficLevel: "High",
    accidents: 2,
    congestion: 72,
    status: "High",
  },

  {
    rank: 13,
    location: "Sakkardara",
    area: "Sakkardara Road",
    riskScore: 67,
    trafficLevel: "Medium",
    accidents: 2,
    congestion: 71,
    status: "Medium",
  },

  {
    rank: 14,
    location: "Mahal",
    area: "Mahal Road",
    riskScore: 65,
    trafficLevel: "Medium",
    accidents: 2,
    congestion: 68,
    status: "Medium",
  },

  {
    rank: 15,
    location: "Bajaj Nagar",
    area: "Bajaj Nagar Road",
    riskScore: 64,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 69,
    status: "Medium",
  },

  {
    rank: 16,
    location: "Sonegaon",
    area: "Sonegaon Road",
    riskScore: 61,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 67,
    status: "Medium",
  },

  {
    rank: 17,
    location: "Pratap Nagar",
    area: "Pratap Nagar Road",
    riskScore: 60,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 65,
    status: "Medium",
  },

  {
    rank: 18,
    location: "Civil Lines",
    area: "Civil Lines Road",
    riskScore: 58,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 61,
    status: "Medium",
  },

  {
    rank: 19,
    location: "Nandanvan",
    area: "Nandanvan Road",
    riskScore: 57,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 63,
    status: "Medium",
  },

  {
    rank: 20,
    location: "Hudkeshwar",
    area: "Hudkeshwar Road",
    riskScore: 57,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 64,
    status: "Medium",
  },

  {
    rank: 21,
    location: "Jaripatka",
    area: "Jaripatka Road",
    riskScore: 55,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 62,
    status: "Medium",
  },

  {
    rank: 22,
    location: "Ambazari",
    area: "Ambazari Road",
    riskScore: 52,
    trafficLevel: "Medium",
    accidents: 0,
    congestion: 59,
    status: "Medium",
  },

  {
    rank: 23,
    location: "Mankapur",
    area: "Mankapur Road",
    riskScore: 48,
    trafficLevel: "Medium",
    accidents: 0,
    congestion: 58,
    status: "Low",
  },

  {
    rank: 24,
    location: "Wadi",
    area: "Wadi Road",
    riskScore: 45,
    trafficLevel: "Low",
    accidents: 0,
    congestion: 57,
    status: "Low",
  },

  {
    rank: 25,
    location: "Gittikhadan",
    area: "Gittikhadan Road",
    riskScore: 44,
    trafficLevel: "Low",
    accidents: 0,
    congestion: 55,
    status: "Low",
  },
];


/* =========================================================
   POLICE DEPLOYMENT
   ========================================================= */

export const deploymentData = [
  {
    id: "DEP-001",
    station: "Sitabuldi Police Station",
    zone: "Sitabuldi",
    required: 20,
    available: 20,
    allocated: 15,
    shortage: 5,
    priority: "Critical",
    updated: "5 min ago",
  },

  {
    id: "DEP-002",
    station: "Sadar Police Station",
    zone: "Sadar",
    required: 17,
    available: 18,
    allocated: 14,
    shortage: 3,
    priority: "Critical",
    updated: "8 min ago",
  },

  {
    id: "DEP-003",
    station: "Ajani Police Station",
    zone: "Ajni",
    required: 14,
    available: 15,
    allocated: 11,
    shortage: 3,
    priority: "High",
    updated: "11 min ago",
  },

  {
    id: "DEP-004",
    station: "Dharampeth Police Station",
    zone: "Dharampeth",
    required: 15,
    available: 16,
    allocated: 12,
    shortage: 3,
    priority: "High",
    updated: "15 min ago",
  },

  {
    id: "DEP-005",
    station: "Lakadganj Police Station",
    zone: "Lakadganj",
    required: 13,
    available: 15,
    allocated: 10,
    shortage: 3,
    priority: "High",
    updated: "19 min ago",
  },

  {
    id: "DEP-006",
    station: "Nandanvan Police Station",
    zone: "Nandanvan",
    required: 10,
    available: 11,
    allocated: 8,
    shortage: 2,
    priority: "Medium",
    updated: "23 min ago",
  },
];


/* =========================================================
   CCTV DATA
   ========================================================= */

export const cctvs = [
  {
    id: "CCTV-001",
    cameraNo: "CCTV-001",
    area: "Sitabuldi",
    street: "Sitabuldi Main Road",
    location: "Sitabuldi Square",
    status: "Online",
  },

  {
    id: "CCTV-002",
    cameraNo: "CCTV-002",
    area: "Sadar",
    street: "Sadar Main Road",
    location: "Sadar Main Road",
    status: "Online",
  },

  {
    id: "CCTV-003",
    cameraNo: "CCTV-003",
    area: "Dharampeth",
    street: "Dharampeth Main Road",
    location: "Dharampeth",
    status: "Online",
  },

  {
    id: "CCTV-004",
    cameraNo: "CCTV-004",
    area: "Ajni",
    street: "Wardha Road",
    location: "Ajni Junction",
    status: "Online",
  },

  {
    id: "CCTV-005",
    cameraNo: "CCTV-005",
    area: "Gandhibagh",
    street: "Central Avenue",
    location: "Gandhibagh",
    status: "Offline",
  },

  {
    id: "CCTV-006",
    cameraNo: "CCTV-006",
    area: "Itwari",
    street: "Itwari Main Road",
    location: "Itwari Market",
    status: "Online",
  },

  {
    id: "CCTV-007",
    cameraNo: "CCTV-007",
    area: "Manish Nagar",
    street: "Manish Nagar Road",
    location: "Manish Nagar",
    status: "Online",
  },

  {
    id: "CCTV-008",
    cameraNo: "CCTV-008",
    area: "Lakadganj",
    street: "Lakadganj Main Road",
    location: "Lakadganj",
    status: "Offline",
  },
];


/* =========================================================
   NAGPUR AREA / ROAD STRUCTURE
   Used later by Dashboard search.
   ========================================================= */

export const nagpurTrafficLocations = [
  {
    area: "Sadar",
    streets: [
      "Sadar Main Road",
      "Residency Road",
      "Mount Road",
    ],
  },

  {
    area: "Sitabuldi",
    streets: [
      "Sitabuldi Main Road",
      "Central Avenue",
      "Wardha Road",
    ],
  },

  {
    area: "Dharampeth",
    streets: [
      "Dharampeth Main Road",
      "North Ambazari Road",
      "West High Court Road",
    ],
  },

  {
    area: "Civil Lines",
    streets: [
      "Civil Lines Road",
      "Katol Road",
      "High Court Road",
    ],
  },

  {
    area: "Mahal",
    streets: [
      "Mahal Road",
      "Gandhi Gate Road",
      "Kelibagh Road",
    ],
  },

  {
    area: "Itwari",
    streets: [
      "Itwari Main Road",
      "Gandhi Gate Road",
      "Station Road",
    ],
  },

  {
    area: "Dhantoli",
    streets: [
      "Dhantoli Main Road",
      "Wardha Road",
      "Central Bazar Road",
    ],
  },

  {
    area: "Laxmi Nagar",
    streets: [
      "Laxmi Nagar Main Road",
      "Bajaj Nagar Road",
      "Ring Road",
    ],
  },

  {
    area: "Ambazari",
    streets: [
      "Ambazari Road",
      "Amravati Road",
      "Futala Road",
    ],
  },

  {
    area: "Ajni",
    streets: [
      "Wardha Road",
      "Ajni Road",
      "Ajni Square Road",
    ],
  },

  {
    area: "Manish Nagar",
    streets: [
      "Manish Nagar Road",
      "Manewada Road",
      "Ring Road",
    ],
  },

  {
    area: "Wardha Road",
    streets: [
      "Wardha Road",
      "Airport Road",
      "Chhatrapati Square Road",
    ],
  },

  {
    area: "Ganeshpeth",
    streets: [
      "Ganeshpeth Road",
      "Central Avenue",
      "Cotton Market Road",
    ],
  },

  {
    area: "Cotton Market",
    streets: [
      "Cotton Market Road",
      "Central Avenue",
      "Gandhibagh Road",
    ],
  },

  {
    area: "Gandhibagh",
    streets: [
      "Central Avenue",
      "Gandhibagh Road",
      "Telephone Exchange Road",
    ],
  },

  {
    area: "Nandanvan",
    streets: [
      "Nandanvan Road",
      "Prajapati Nagar Road",
      "Dighori Road",
    ],
  },

  {
    area: "Sakkardara",
    streets: [
      "Sakkardara Road",
      "Umreth Road",
      "Dighori Road",
    ],
  },

  {
    area: "Pratap Nagar",
    streets: [
      "Pratap Nagar Road",
      "Ring Road",
      "Trimurti Nagar Road",
    ],
  },

  {
    area: "Bajaj Nagar",
    streets: [
      "Bajaj Nagar Road",
      "Laxmi Nagar Road",
      "Amravati Road",
    ],
  },

  {
    area: "Mankapur",
    streets: [
      "Mankapur Road",
      "Kamptee Road",
      "Koradi Road",
    ],
  },

  {
    area: "Gittikhadan",
    streets: [
      "Gittikhadan Road",
      "Katol Road",
      "Koradi Road",
    ],
  },

  {
    area: "Jaripatka",
    streets: [
      "Jaripatka Road",
      "Kamptee Road",
      "Indora Road",
    ],
  },

  {
    area: "Wadi",
    streets: [
      "Wadi Road",
      "Amravati Road",
      "Hingna Road",
    ],
  },

  {
    area: "Hudkeshwar",
    streets: [
      "Hudkeshwar Road",
      "Dighori Road",
      "Manewada Road",
    ],
  },

  {
    area: "Sonegaon",
    streets: [
      "Sonegaon Road",
      "Wardha Road",
      "Airport Road",
    ],
  },

  {
    area: "Lakadganj",
    streets: [
      "Lakadganj Main Road",
      "Kalmana Road",
      "Kamptee Road",
    ],
  },
];


/* =========================================================
   LEGACY / COMPATIBILITY DATA
   ========================================================= */

/*
  Older dashboard versions used a simpler traffic ranking
  structure. Keep this export so those components do not
  break if they are still present in the project.
*/

export const trafficRanking = areaRanking.map(
  (area, index) => ({
    area: area.area,
    level:
      area.risk >= 85
        ? "Critical"
        : area.risk >= 70
        ? "Very High"
        : area.risk >= 50
        ? "High"
        : "Moderate",
    score: area.risk,
    color:
      area.risk >= 85
        ? "bg-red-500"
        : area.risk >= 70
        ? "bg-orange-500"
        : area.risk >= 50
        ? "bg-yellow-400"
        : "bg-green-500",
    rank: index + 1,
  })
);


/*
  Older dashboard versions used latestAccidents and cctvs.
*/

export const latestAccidents =
  incidents
    .filter(
      (incident) =>
        incident.type === "Accident"
    )
    .map((incident) => ({
      area: incident.area,
      street:
        incident.street ||
        incident.location,
      time: incident.reportedAt,
      severity: incident.severity,
    }));