// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    action: 'read',
    subject: 'admin-page',
    icon: 'mdi:home-outline'
  },
  {
    title: 'Dashboard',
    path: '/student/dashboard',
    action: 'read',
    subject: 'student-page',
    icon: 'mdi:home-outline'
  },
  {
    title: 'Dashboard',
    path: '/staff/dashboard',
    action: 'read',
    subject: 'staff-page',
    icon: 'mdi:home-outline'
  },
  {
    path: '/student/request',
    title: 'Request Credentials',
    action: 'read',
    subject: 'request-page',
    icon: 'mdi:shield-outline'
  },
  {
    path: '/student/transactions',
    title: 'Transactions',
    action: 'read',
    subject: 'student-transactions-page',
    icon: 'mdi:shield-outline'
  },
  {
    path: '/admin/credentials',
    title: 'Credentials',
    action: 'read',
    subject: 'credentials-page',
    icon: 'mdi:shield-outline'
  },
  {
    path: '/staff/students',
    title: 'Students',
    action: 'read',
    subject: 'students-page',
    icon: 'mdi:shield-outline'
  },
  {
    path: '/staff/transactions',
    title: 'Transactions',
    action: 'read',
    subject: 'transactions-page',
    icon: 'mdi:shield-outline'
  },
  {
    path: '/admin/staff/add',
    title: 'Add Staff',
    action: 'read',
    subject: 'add-staff-page',
    icon: 'mdi:shield-outline'
  }
]

export default navigation
