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
    path: '/admin/students',
    title: 'Clients',
    action: 'read',
    subject: 'admin-students-page',
    icon: 'mdi:account-school'
  },
  {
    path: '/admin/transactions',
    title: 'Transactions',
    action: 'read',
    subject: 'admin-transactions-page',
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
    path: '/admin/departments',
    title: 'Departments',
    action: 'read',
    subject: 'departments-page',
    icon: 'mdi:text-box-multiple'
  },
  {
    path: '/admin/staffs',
    title: 'Staff',
    action: 'read',
    subject: 'staffs-list-page',
    icon: 'mdi:account-multiple'
  },
  {
    path: '/admin/student_assistants',
    title: 'Student Assistant',
    action: 'read',
    subject: 'sa-list-page',
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
    path: '/admin/staff_logs',
    title: 'Staff Logs',
    action: 'read',
    subject: 'staff-logs-page',
    icon: 'mdi:note-text'
  },
  {
    path: '/admin/student_assistant_logs',
    title: 'SA Logs',
    action: 'read',
    subject: 'sa-logs-page',
    icon: 'mdi:note-text'
  },
  {
    path: '/admin/prompt',
    title: 'Edit Prompt',
    action: 'read',
    subject: 'prompt-page',
    icon: 'mdi:note-text'
  },
  {
    title: 'Dashboard',
    path: '/student/dashboard',
    action: 'read',
    subject: 'student-page',
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
    path: '/staff/students',
    title: 'Clients',
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
  {
    path: '/staff/logs',
    title: 'Logs',
    action: 'read',
    subject: 'staff-logs',
    icon: 'mdi:note-text'
  },
  {
    path: '/student_assistant/dashboard',
    title: 'Dashboard',
    action: 'read',
    subject: 'sa-page',
    icon: 'mdi:home-outline'
  },
  {
    path: '/student_assistant/transactions',
    title: 'Transactions',
    action: 'read',
    subject: 'sa-transactions-page',
    icon: 'mdi:text-box'
  },
]

export default navigation
