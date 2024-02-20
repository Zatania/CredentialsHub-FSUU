/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'student') return '/student/dashboard'
  else if (role === 'staff') return '/staff/transactions'
  else if (role === 'admin') return '/admin/dashboard'
  else if (role === 'student_assistant') return '/student_assistant/dashboard'
  else return '/login'
}

export default getHomeRoute
