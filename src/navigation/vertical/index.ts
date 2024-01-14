// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
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
      icon: 'mdi:text-box-plus'
    },
    {
      path: '/student/transactions',
      title: 'Transactions',
      action: 'read',
      subject: 'student-transactions-page',
      icon: 'mdi:text-box'
    },
    {
      path: '/admin/credentials',
      title: 'Credentials',
      action: 'read',
      subject: 'credentials-page',
      icon: 'mdi:text-box-multiple'
    },
    {
      path: '/admin/staffs',
      title: 'Staffs',
      action: 'read',
      subject: 'staffs-list-page',
      icon: 'mdi:account-multiple'
    },
    {
      path: '/admin/logs',
      title: 'Logs',
      action: 'read',
      subject: 'logs-page',
      icon: 'mdi:note-text'
    },
    {
      path: '/staff/students',
      title: 'Students',
      action: 'read',
      subject: 'students-page',
      icon: 'mdi:account-school'
    },
    {
      path: '/staff/transactions',
      title: 'Transactions',
      action: 'read',
      subject: 'transactions-page',
      icon: 'mdi:text-box'
    },
  ]
}

export default navigation
