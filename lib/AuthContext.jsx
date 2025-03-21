
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token')
      
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          setUser(response.data)
        } catch (error) {
          console.error('Authentication error:', error)
          Cookies.remove('token')
        }
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      email,
      password
    })
    
    const { token, user } = response.data
    Cookies.set('token', token, { expires: 7 })
    setUser(user)
    
    return user
  }

  const register = async (name, username, email, password) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      name,
      username,
      email,
      password
    })
    
    return response.data
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
