import type { User } from '../types'
import axios from './client'

export async function login(email: string, password: string): Promise<{ user: User, token: string }> {
  const response = await axios.get<User[]>('/users', {
    params: { email, password },
  })

  if (response.data.length === 0) {
    throw new Error('Invalid credentials')
  }

  return {
    user: response.data[0],
    token: 'mocked-jwt-token-123',
  }
}