import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Calendar,
  MessageSquare,
  CreditCard,
  Settings,
  Bell,
  Shield,
  BarChart3,
  Trophy,
  Star
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    title: 'Overview',
    items: [
      {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        badge: null
      },
      {
        name: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        badge: null
      },
      {
        name: 'Transactions',
        href: '/admin/transactions',
        icon: CreditCard,
        badge: 7
      },
        {
            name: 'Membership ',
            href: '/admin/membership-management',
            icon: Users,
            badge: null
        }
        ,{
            name: 'Payments ',
            href: '/admin/payments-management',
            icon: CreditCard,
            badge: null
      }
    ]
  },
  {
    title: 'Management',
    items: [
      {
        name: 'Users',
        href: '/admin/users',
        icon: Users,
        badge: null
      },
      {
        name: 'Game Rooms',
        href: '/admin/rooms',
        icon: Gamepad2,
        badge: 12
      },
      {
        name: 'Events',
        href: '/admin/events',
        icon: Calendar,
        badge: 3
      },
      {
        name: 'Tournaments',
        href: '/admin/tournaments',
        icon: Trophy,
        badge: null
      },
      {
        name: 'Community',
        href: '/admin/community-management',
        icon: Users,
        badge: null
      },
        {
            name: 'Club',
            href: '/admin/club-management',
            icon: Users,
            badge: null
        },
        {
            name: 'Game',
            href: '/admin/game-management',
            icon: Gamepad2,
            badge: null
        }
    ]
  },
  {
    title: 'Support',
    items: [
      {
        name: 'Feedback',
        href: '/admin/feedback',
        icon: MessageSquare,
        badge: 5
      },
      {
        name: 'Reviews',
        href: '/admin/reviews',
        icon: Star,
        badge: null
      }
    ]
  },
  {
    title: 'Business',
    items: [
      {
        name: 'Billing',
        href: '/admin/billing',
        icon: CreditCard,
        badge: null
      },
      {
        name: 'Moderation',
        href: '/admin/moderation',
        icon: Shield,
        badge: 2
      }
    ]
  },
  {
    title: 'System',
    items: [
      {
        name: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
        badge: null
      },
      {
        name: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        badge: null
      }
    ]
  }
];