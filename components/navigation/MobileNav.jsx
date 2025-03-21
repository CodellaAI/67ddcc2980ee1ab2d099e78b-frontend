
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaHashtag, FaBell, FaUser } from 'react-icons/fa'

export default function MobileNav({ user }) {
  const pathname = usePathname()
  
  const isActive = (path) => {
    if (path === '/home' && pathname === '/home') return true
    if (path === '/explore' && pathname === '/explore') return true
    if (path === '/notifications' && pathname === '/notifications') return true
    if (path === '/profile' && pathname.startsWith('/profile')) return true
    return false
  }

  return (
    <nav className="flex justify-around items-center py-3">
      <Link 
        href="/home" 
        className={`p-2 ${isActive('/home') ? 'text-primary' : 'text-gray-500'}`}
      >
        <FaHome className="text-2xl" />
      </Link>
      
      <Link 
        href="/explore" 
        className={`p-2 ${isActive('/explore') ? 'text-primary' : 'text-gray-500'}`}
      >
        <FaHashtag className="text-2xl" />
      </Link>
      
      <Link 
        href="/notifications" 
        className={`p-2 ${isActive('/notifications') ? 'text-primary' : 'text-gray-500'}`}
      >
        <FaBell className="text-2xl" />
      </Link>
      
      <Link 
        href={`/profile/${user.username}`} 
        className={`p-2 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}
      >
        <FaUser className="text-2xl" />
      </Link>
    </nav>
  )
}
