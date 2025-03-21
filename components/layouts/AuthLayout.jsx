
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { FaTwitter } from 'react-icons/fa'

export default function AuthLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/home')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaTwitter className="text-primary text-5xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center">
        <FaTwitter className="text-white text-9xl" />
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  )
}
