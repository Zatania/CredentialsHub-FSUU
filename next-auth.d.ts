import 'next-auth/jwt'
import { DefaultSession } from 'next-auth'

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    role_name: string
    username: string
    firstName: string
    lastName: string
    location: string
    studentNumber: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      role: string
      username: string
      firstName: string
      lastName: string
      location: string
      studentNumber: string
    } & DefaultSession['user']
  }

  interface User {
    id: number
    role_name: string
    username: string
    firstName: string
    lastName: string
    location: string
    studentNumber: string
  }
}
