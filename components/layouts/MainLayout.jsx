
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import Sidebar from '@/components/navigation/Sidebar'
import RightSidebar from '@/components/navigation/RightSidebar'
import MobileNav from '@/components/navigation/MobileNav'
import { FaTwitter } from 'react-icons/fa'

export default function MainLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaTwitter className="text-primary text-5xl animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden md:block md:w-64 lg:w-72 border-r border-extraLightGray min-h-screen">
        <div className="fixed h-screen overflow-y-auto w-64 lg:w-72">
          <Sidebar user={user} />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 border-x border-extraLightGray min-h-screen max-w-2xl mx-auto">
        {children}
      </main>
      
      {/* Right Sidebar - Hidden on smaller screens */}
      <div className="hidden lg:block lg:w-80 xl:w-96 min-h-screen">
        <div className="fixed h-screen overflow-y-auto w-80 xl:w-96">
          <RightSidebar />
        </div>
      </div>
      
      {/* Mobile Navigation - Visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-extraLightGray z-10">
        <MobileNav user={user} />
      </div>
    </div>
  )
}
