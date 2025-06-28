import { User, GameRoom, Event, Feedback, DashboardStats, ChartData, BillingPlan, Subscription } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@hust.edu.vn',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    university: 'Đại học Bách khoa Hà Nội',
    status: 'active',
    role: 'student',
    joinedAt: '2024-01-15',
    lastActive: '2024-01-20',
    gamesPlayed: 45,
    hoursPlayed: 120
  },
  {
    id: '2',
    name: 'Trần Thị Lan',
    email: 'lan.tran@uit.edu.vn',
    avatar: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    university: 'Đại học CNTT TP.HCM',
    status: 'active',
    role: 'moderator',
    joinedAt: '2024-01-10',
    lastActive: '2024-01-20',
    gamesPlayed: 78,
    hoursPlayed: 200
  },
  {
    id: '3',
    name: 'Lê Hoàng Phúc',
    email: 'phuc.le@ftu.edu.vn',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    university: 'Đại học Ngoại thương',
    status: 'inactive',
    role: 'student',
    joinedAt: '2024-01-08',
    lastActive: '2024-01-18',
    gamesPlayed: 23,
    hoursPlayed: 67
  }
];

export const MOCK_ROOMS: GameRoom[] = [
  {
    id: '1',
    name: 'VALORANT Ranked Squad',
    game: 'VALORANT',
    creator: MOCK_USERS[0],
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
    maxParticipants: 5,
    status: 'active',
    createdAt: '2024-01-20T14:30:00',
    duration: 45,
    isVoiceEnabled: true,
    isPrivate: false
  },
  {
    id: '2',
    name: 'League of Legends Flex',
    game: 'League of Legends',
    creator: MOCK_USERS[1],
    participants: [MOCK_USERS[1], MOCK_USERS[2]],
    maxParticipants: 5,
    status: 'waiting',
    createdAt: '2024-01-20T15:00:00',
    duration: 0,
    isVoiceEnabled: true,
    isPrivate: false
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'HUST Gaming Championship 2024',
    description: 'Giải đấu game lớn nhất năm dành cho sinh viên Bách khoa',
    game: 'VALORANT',
    organizer: MOCK_USERS[1],
    startDate: '2024-02-15T09:00:00',
    endDate: '2024-02-17T18:00:00',
    maxParticipants: 64,
    currentParticipants: 45,
    status: 'upcoming',
    prize: '10,000,000 VND',
    registrationDeadline: '2024-02-10T23:59:59'
  },
  {
    id: '2',
    title: 'Mobile Legends Weekly Tournament',
    description: 'Giải đấu hàng tuần cho game Mobile Legends',
    game: 'Mobile Legends',
    organizer: MOCK_USERS[0],
    startDate: '2024-01-25T19:00:00',
    endDate: '2024-01-25T22:00:00',
    maxParticipants: 20,
    currentParticipants: 18,
    status: 'ongoing',
    prize: '500,000 VND',
    registrationDeadline: '2024-01-24T18:00:00'
  }
];

export const MOCK_FEEDBACK: Feedback[] = [
  {
    id: '1',
    user: MOCK_USERS[0],
    type: 'feedback',
    title: 'Giao diện rất đẹp và dễ sử dụng',
    content: 'Tôi rất thích giao diện mới của platform. Tìm kiếm phòng game rất dễ dàng.',
    rating: 5,
    status: 'reviewed',
    createdAt: '2024-01-19T10:30:00',
    respondedAt: '2024-01-19T14:20:00',
    response: 'Cảm ơn bạn đã đánh giá! Chúng tôi sẽ tiếp tục cải thiện.',
    category: 'UI/UX'
  },
  {
    id: '2',
    user: MOCK_USERS[2],
    type: 'complaint',
    title: 'Lag khi join voice chat',
    content: 'Voice chat bị lag và cắt tiếng thường xuyên, ảnh hưởng đến trải nghiệm chơi game.',
    rating: 2,
    status: 'pending',
    createdAt: '2024-01-20T09:15:00',
    category: 'Technical'
  }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalRooms: 156,
  activeRooms: 34,
  totalEvents: 23,
  upcomingEvents: 7,
  monthlyRevenue: 15750000,
  newUsersThisMonth: 234
};

export const MOCK_CHART_DATA: ChartData[] = [
  { name: 'T2', value: 45, date: '2024-01-15' },
  { name: 'T3', value: 52, date: '2024-01-16' },
  { name: 'T4', value: 38, date: '2024-01-17' },
  { name: 'T5', value: 67, date: '2024-01-18' },
  { name: 'T6', value: 78, date: '2024-01-19' },
  { name: 'T7', value: 95, date: '2024-01-20' },
  { name: 'CN', value: 89, date: '2024-01-21' }
];

export const MOCK_BILLING_PLANS: BillingPlan[] = [
  {
    id: '1',
    name: 'Basic',
    price: 0,
    duration: 1,
    features: ['Tham gia phòng game', 'Chat text', 'Tạo profile'],
    isPopular: false,
    status: 'active'
  },
  {
    id: '2',
    name: 'Pro Gamer',
    price: 99000,
    duration: 1,
    features: ['Tất cả tính năng Basic', 'Voice chat chất lượng cao', 'Tạo phòng private', 'Priority support'],
    isPopular: true,
    status: 'active'
  },
  {
    id: '3',
    name: 'Elite',
    price: 199000,
    duration: 1,
    features: ['Tất cả tính năng Pro', 'Tổ chức tournament', 'Analytics chi tiết', 'Custom profile'],
    isPopular: false,
    status: 'active'
  }
];