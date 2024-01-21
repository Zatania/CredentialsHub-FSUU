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
    status: string
    image: string
    remarks: string
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
      status: string
      image: string
      remarks: string
    } & DefaultSession['user']
  }

  interface User {
    id: number
    role_name: string
    username: string
    firstName: string
    lastName: string
    location: string
    homeAddress: string
    studentNumber: string
    employeeNumber: string
    status: string
    image: string
    remarks: string
  }
}
