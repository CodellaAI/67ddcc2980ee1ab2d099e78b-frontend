
'use client'
import { useState, useEffect } from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import TweetList from '@/components/tweets/TweetList'
import { fetchExplore, searchTweets } from '@/lib/api'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'

export default function Explore() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadExplore = async () => {
      try {
        setLoading(true)
        const exploreTweets = await fetchExplore()
        setTweets(exploreTweets)
      } catch (error) {
        console.error('Error fetching explore tweets:', error)
        toast.error('Failed to load tweets. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadExplore()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return
    
    try {
      setLoading(true)
      const results = await searchTweets(searchQuery)
      setTweets(results)
    } catch (error) {
      console.error('Error searching tweets:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="border-b border-extraLightGray pb-3">
        <h1 className="text-xl font-bold p-4">Explore</h1>
        
        <form onSubmit={handleSearch} className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Chirp"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lightGray" />
            <button type="submit" className="sr-only">Search</button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : tweets.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          {searchQuery ? 'No tweets found for your search' : 'No tweets to display'}
        </div>
      ) : (
        <TweetList tweets={tweets} />
      )}
    </MainLayout>
  )
}
