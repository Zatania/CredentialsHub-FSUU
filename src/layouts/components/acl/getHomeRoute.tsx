/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'student') return '/student/dashboard'
  else if (role === 'staff') return '/staff/dashboard'
  else if (role === 'admin') return '/admin/dashboard'
  else return '/login'
}

export default getHomeRoute
