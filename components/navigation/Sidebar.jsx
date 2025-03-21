
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { FaTwitter, FaHome, FaHashtag, FaBell, FaEnvelope, FaBookmark, FaList, FaUser, FaEllipsisH } from 'react-icons/fa'
import Image from 'next/image'

export default function Sidebar({ user }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  
  const isActive = (path) => {
    if (path === '/home' && pathname === '/home') return true
    if (path === '/explore' && pathname === '/explore') return true
    if (path === '/notifications' && pathname === '/notifications') return true
    if (path === '/profile' && pathname.startsWith('/profile')) return true
    return false
  }

  return (
    <div className="flex flex-col h-full p-2 justify-between">
      <div>
        <div className="p-3 mb-2">
          <Link href="/home">
            <FaTwitter className="text-primary text-3xl" />
          </Link>
        </div>
        
        <nav className="mb-4">
          <Link href="/home" className={isActive('/home') ? 'sidebar-item-active' : 'sidebar-item'}>
            <FaHome className="mr-4" />
            <span>Home</span>
          </Link>
          
          <Link href="/explore" className={isActive('/explore') ? 'sidebar-item-active' : 'sidebar-item'}>
            <FaHashtag className="mr-4" />
            <span>Explore</span>
          </Link>
          
          <Link href="/notifications" className={isActive('/notifications') ? 'sidebar-item-active' : 'sidebar-item'}>
            <FaBell className="mr-4" />
            <span>Notifications</span>
          </Link>
          
          <Link href={`/profile/${user.username}`} className={isActive('/profile') ? 'sidebar-item-active' : 'sidebar-item'}>
            <FaUser className="mr-4" />
            <span>Profile</span>
          </Link>
        </nav>
        
        <button className="btn-primary w-full py-3 mt-4">
          Chirp
        </button>
      </div>
      
      <div className="p-3 mt-auto">
        <button 
          onClick={logout}
          className="flex items-center justify-between w-full p-3 rounded-full hover:bg-extraLightGray transition-colors"
        >
          <div className="flex items-center">
            <Image 
              src={user.profileImage || 'https://via.placeholder.com/40'} 
              alt={user.name} 
              width={40} 
              height={40} 
              className="rounded-full mr-3"
            />
            <div className="hidden lg:block">
              <div className="font-bold">{user.name}</div>
              <div className="text-gray-500">@{user.username}</div>
            </div>
          </div>
          <FaEllipsisH className="hidden lg:block text-gray-500" />
        </button>
      </div>
    </div>
  )
}
