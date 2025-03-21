
import { useState, useEffect } from 'react'
import { fetchTrends, fetchSuggestedUsers, followUser } from '@/lib/api'
import { FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-toastify'

export default function RightSidebar() {
  const [trends, setTrends] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [trendsData, usersData] = await Promise.all([
          fetchTrends(),
          fetchSuggestedUsers()
        ])
        setTrends(trendsData)
        setSuggestedUsers(usersData)
      } catch (error) {
        console.error('Error loading sidebar data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleFollow = async (userId) => {
    try {
      await followUser(userId)
      setSuggestedUsers(suggestedUsers.filter(user => user._id !== userId))
      toast.success('User followed successfully')
    } catch (error) {
      console.error('Error following user:', error)
      toast.error('Failed to follow user')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    window.location.href = `/explore?q=${encodeURIComponent(searchQuery)}`
  }

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Chirp"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 bg-gray-100"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lightGray" />
          <button type="submit" className="sr-only">Search</button>
        </div>
      </form>
      
      <div className="bg-gray-100 rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">What's happening</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {trends.map((trend) => (
              <Link 
                key={trend._id} 
                href={`/explore?q=${encodeURIComponent(trend.hashtag)}`}
                className="block hover:bg-gray-200 rounded-lg p-2 transition-colors"
              >
                <div className="text-xs text-gray-500">{trend.category}</div>
                <div className="font-bold">{trend.hashtag}</div>
                <div className="text-sm text-gray-500">{trend.tweetCount} Chirps</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded-full w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <Link href={`/profile/${user.username}`} className="flex items-center">
                  <Image 
                    src={user.profileImage || 'https://via.placeholder.com/40'} 
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-bold hover:underline">{user.name}</div>
                    <div className="text-gray-500">@{user.username}</div>
                  </div>
                </Link>
                
                <button 
                  onClick={() => handleFollow(user._id)}
                  className="btn-primary text-sm py-1 px-3"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <div className="flex flex-wrap gap-2">
          <Link href="#" className="hover:underline">Terms of Service</Link>
          <Link href="#" className="hover:underline">Privacy Policy</Link>
          <Link href="#" className="hover:underline">Cookie Policy</Link>
          <Link href="#" className="hover:underline">Accessibility</Link>
          <Link href="#" className="hover:underline">Ads info</Link>
          <Link href="#" className="hover:underline">More</Link>
        </div>
        <div className="mt-2">© 2023 Chirp Social</div>
      </div>
    </div>
  )
}
