
export interface HackathonEvent {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'virtual' | 'offline' | 'hybrid';
  registrationOpen: boolean;
  maxParticipants?: number;
  prize?: string;
  description: string;
  website?: string;
  organizer: string;
}

export const hackathonEvents: HackathonEvent[] = [
  {
    name: "Smart India Hackathon 2024",
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    location: "Pan India (Multiple Centers)",
    type: "hybrid",
    registrationOpen: true,
    maxParticipants: 50000,
    prize: "₹1,00,000",
    description: "The world's biggest hackathon for students to solve real-world problems",
    website: "https://sih.gov.in",
    organizer: "Government of India"
  },
  {
    name: "HackBengaluru 2024",
    startDate: "2024-12-15",
    endDate: "2024-12-17",
    location: "Bangalore, Karnataka",
    type: "offline",
    registrationOpen: true,
    maxParticipants: 2000,
    prize: "₹5,00,000",
    description: "Bangalore's premier hackathon focusing on urban tech solutions",
    website: "https://hackbengaluru.in",
    organizer: "Karnataka Innovation Hub"
  },
  {
    name: "Mumbai FinTech Hack",
    startDate: "2024-12-18",
    endDate: "2024-12-19",
    location: "Mumbai, Maharashtra",
    type: "offline",
    registrationOpen: true,
    maxParticipants: 800,
    prize: "₹3,00,000",
    description: "Building the future of financial technology in India",
    website: "https://mumbaifintech.hack",
    organizer: "FinTech Alliance"
  },
  {
    name: "Delhi Climate Tech Challenge",
    startDate: "2024-12-25",
    endDate: "2024-12-27",
    location: "New Delhi",
    type: "hybrid",
    registrationOpen: true,
    maxParticipants: 1500,
    prize: "₹2,50,000",
    description: "Innovative solutions for climate change and sustainability",
    website: "https://delhiclimatetech.org",
    organizer: "Climate Innovation Foundation"
  },
  {
    name: "Pune AI/ML Hackathon",
    startDate: "2025-01-05",
    endDate: "2025-01-07",
    location: "Pune, Maharashtra",
    type: "offline",
    registrationOpen: true,
    maxParticipants: 1200,
    prize: "₹4,00,000",
    description: "Advancing AI and Machine Learning applications for social good",
    website: "https://puneai.hack",
    organizer: "Pune Tech Society"
  },
  {
    name: "Virtual India EdTech Hack",
    startDate: "2025-01-10",
    endDate: "2025-01-12",
    location: "Online",
    type: "virtual",
    registrationOpen: true,
    maxParticipants: 5000,
    prize: "₹2,00,000",
    description: "Revolutionizing education technology across India",
    website: "https://edtechindia.hack",
    organizer: "EdTech India Alliance"
  },
  {
    name: "Hyderabad HealthTech Innovation",
    startDate: "2025-01-15",
    endDate: "2025-01-17",
    location: "Hyderabad, Telangana",
    type: "offline",
    registrationOpen: true,
    maxParticipants: 1000,
    prize: "₹3,50,000",
    description: "Healthcare technology solutions for rural and urban India",
    website: "https://hyderabadhealthtech.in",
    organizer: "HealthTech Consortium"
  },
  {
    name: "Chennai Smart Mobility Hack",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    location: "Chennai, Tamil Nadu",
    type: "hybrid",
    registrationOpen: true,
    maxParticipants: 1800,
    prize: "₹6,00,000",
    description: "Transforming urban mobility with innovative technology",
    website: "https://chennaismartmobility.tech",
    organizer: "Tamil Nadu Innovation Mission"
  },
  {
    name: "Kolkata Cultural Tech Fest",
    startDate: "2025-01-25",
    endDate: "2025-01-27",
    location: "Kolkata, West Bengal",
    type: "offline",
    registrationOpen: false,
    maxParticipants: 800,
    prize: "₹1,50,000",
    description: "Preserving and promoting Indian culture through technology",
    website: "https://kolkataculturaltech.org",
    organizer: "Bengal Digital Heritage"
  },
  {
    name: "Ahmedabad AgriTech Challenge",
    startDate: "2025-02-01",
    endDate: "2025-02-03",
    location: "Ahmedabad, Gujarat",
    type: "hybrid",
    registrationOpen: true,
    maxParticipants: 1500,
    prize: "₹4,50,000",
    description: "Agricultural technology for sustainable farming in India",
    website: "https://ahmedabadagritech.in",
    organizer: "Gujarat AgriTech Board"
  },
  {
    name: "Kochi Maritime Tech Hack",
    startDate: "2025-02-05",
    endDate: "2025-02-07",
    location: "Kochi, Kerala",
    type: "offline",
    registrationOpen: true,
    maxParticipants: 600,
    prize: "₹2,75,000",
    description: "Innovation in maritime and port technology",
    website: "https://kochimaritime.tech",
    organizer: "Kerala Maritime Board"
  },
  {
    name: "Jaipur Heritage Tech Innovation",
    startDate: "2025-02-10",
    endDate: "2025-02-12",
    location: "Jaipur, Rajasthan",
    type: "offline",
    registrationOpen: true,
    maxParticipants: 900,
    prize: "₹2,25,000",
    description: "Technology solutions for heritage conservation and tourism",
    website: "https://jaipurheritage.tech",
    organizer: "Rajasthan Heritage Foundation"
  }
];
