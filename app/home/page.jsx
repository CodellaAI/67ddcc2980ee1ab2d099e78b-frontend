
'use client'
import { useState, useEffect } from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import TweetForm from '@/components/tweets/TweetForm'
import TweetList from '@/components/tweets/TweetList'
import { useAuth } from '@/lib/AuthContext'
import { fetchTimeline } from '@/lib/api'
import { toast } from 'react-toastify'

export default function Home() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadTweets = async () => {
      try {
        setLoading(true)
        const timelineTweets = await fetchTimeline()
        setTweets(timelineTweets)
      } catch (error) {
        console.error('Error fetching timeline:', error)
        toast.error('Failed to load tweets. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadTweets()
    }
  }, [user])

  const handleNewTweet = (newTweet) => {
    setTweets([newTweet, ...tweets])
  }

  return (
    <MainLayout>
      <div className="border-b border-extraLightGray pb-3">
        <h1 className="text-xl font-bold p-4">Home</h1>
      </div>
      
      <TweetForm onTweetCreated={handleNewTweet} />
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TweetList tweets={tweets} />
      )}
    </MainLayout>
  )
}
