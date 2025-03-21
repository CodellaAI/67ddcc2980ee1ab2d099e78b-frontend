
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layouts/MainLayout'
import Tweet from '@/components/tweets/Tweet'
import TweetForm from '@/components/tweets/TweetForm'
import TweetList from '@/components/tweets/TweetList'
import { fetchTweet, fetchTweetReplies } from '@/lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

export default function TweetDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [tweet, setTweet] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTweet = async () => {
      try {
        setLoading(true)
        const tweetData = await fetchTweet(id)
        setTweet(tweetData)
        
        const repliesData = await fetchTweetReplies(id)
        setReplies(repliesData)
      } catch (error) {
        console.error('Error fetching tweet:', error)
        toast.error('Failed to load tweet. Please try again later.')
        router.push('/home')
      } finally {
        setLoading(false)
      }
    }

    loadTweet()
  }, [id, router])

  const handleNewReply = (newReply) => {
    setReplies([newReply, ...replies])
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center p-8">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!tweet) {
    return (
      <MainLayout>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">Tweet not found</h2>
          <p className="text-gray-600 mt-2">The tweet you're looking for doesn't exist</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="border-b border-extraLightGray">
        <div className="p-4 flex items-center gap-4">
          <Link href="/home" className="p-2 rounded-full hover:bg-extraLightGray">
            <FaArrowLeft />
          </Link>
          <h1 className="text-xl font-bold">Chirp</h1>
        </div>
      </div>
      
      <Tweet tweet={tweet} showActions={true} isDetail={true} />
      
      <div className="border-t border-b border-extraLightGray py-4 px-4">
        <TweetForm 
          onTweetCreated={handleNewReply} 
          replyTo={tweet._id} 
          placeholder={`Reply to @${tweet.user.username}`}
        />
      </div>
      
      {replies.length > 0 ? (
        <TweetList tweets={replies} />
      ) : (
        <div className="p-6 text-center text-gray-500">
          No replies yet. Be the first to reply!
        </div>
      )}
    </MainLayout>
  )
}
