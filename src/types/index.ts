export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university: string;
  status: 'active' | 'inactive' | 'banned';
  role: 'student' | 'admin' | 'moderator';
  joinedAt: string;
  lastActive: string;
  gamesPlayed: number;
  hoursPlayed: number;
  tokenExp?: number; // Optional: JWT expiry timestamp (seconds) for session UI
}

export interface GameRoom {
  id: string;
  name: string;
  game: string;
  creator: User; // Full User for creator (key entity)
  participantIds: string[]; // Array of User IDs (lightweight for lists)
  participants?: User[]; // Optional full users (fetch via /rooms/{id}/participants)
  maxParticipants: number;
  status: 'active' | 'waiting' | 'full' | 'ended';
  createdAt: string;
  duration: number;
  isVoiceEnabled: boolean;
  isPrivate: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  game: string;
  organizer: User;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  prize?: string;
  registrationDeadline: string;
  location?: string; // Optional: e.g., "Online" or "SGH Campus Room 101"
}

export interface Feedback {
  id: string;
  user: User;
  type: 'feedback' | 'survey' | 'complaint';
  title: string;
  content: string;
  rating?: number;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  respondedAt?: string;
  response?: string;
  category: string;
  attachment?: string; // Optional: URL to screenshot/file
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
  isPopular: boolean;
  status: 'active' | 'inactive';
}

export interface Subscription {
  id: string;
  user: User;
  plan: BillingPlan;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentMethod: string;
  amount: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRooms: number;
  activeRooms: number;
  totalEvents: number;
  upcomingEvents: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}