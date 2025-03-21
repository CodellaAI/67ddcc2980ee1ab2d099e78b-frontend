
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { FaRegComment, FaRetweet, FaRegHeart, FaHeart, FaShareAlt, FaEllipsisH } from 'react-icons/fa'
import { likeTweet, unlikeTweet, retweet, unretweet } from '@/lib/api'
import { useAuth } from '@/lib/AuthContext'
import { toast } from 'react-toastify'

export default function Tweet({ tweet, showActions = true, isDetail = false }) {
  const { user } = useAuth()
  const [tweetData, setTweetData] = useState(tweet)
  const [actionLoading, setActionLoading] = useState(false)
  
  const handleLike = async () => {
    if (actionLoading) return
    
    try {
      setActionLoading(true)
      
      if (tweetData.isLiked) {
        await unlikeTweet(tweetData._id)
        setTweetData({
          ...tweetData,
          isLiked: false,
          likeCount: tweetData.likeCount - 1
        })
      } else {
        await likeTweet(tweetData._id)
        setTweetData({
          ...tweetData,
          isLiked: true,
          likeCount: tweetData.likeCount + 1
        })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to process your action')
    } finally {
      setActionLoading(false)
    }
  }
  
  const handleRetweet = async () => {
    if (actionLoading) return
    
    try {
      setActionLoading(true)
      
      if (tweetData.isRetweeted) {
        await unretweet(tweetData._id)
        setTweetData({
          ...tweetData,
          isRetweeted: false,
          retweetCount: tweetData.retweetCount - 1
        })
      } else {
        await retweet(tweetData._id)
        setTweetData({
          ...tweetData,
          isRetweeted: true,
          retweetCount: tweetData.retweetCount + 1
        })
      }
    } catch (error) {
      console.error('Error toggling retweet:', error)
      toast.error('Failed to process your action')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className={`tweet-card ${isDetail ? 'border-none' : ''}`}>
      {tweetData.isRetweet && (
        <div className="flex items-center text-gray-500 text-sm mb-2 ml-6">
          <FaRetweet className="mr-2" />
          <span>{tweetData.retweetedBy.name} retweeted</span>
        </div>
      )}
      
      <div className="flex">
        <div className="mr-3">
          <Link href={`/profile/${tweetData.user.username}`}>
            <Image 
              src={tweetData.user.profileImage || 'https://via.placeholder.com/40'} 
              alt={tweetData.user.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Link href={`/profile/${tweetData.user.username}`} className="font-bold hover:underline">
                {tweetData.user.name}
              </Link>
              <span className="text-gray-500 mx-1">@{tweetData.user.username}</span>
              <span className="text-gray-500 mx-1">·</span>
              <Link href={`/tweet/${tweetData._id}`} className="text-gray-500 hover:underline">
                {format(new Date(tweetData.createdAt), 'MMM d')}
              </Link>
            </div>
            
            <button className="p-2 text-gray-500 rounded-full hover:bg-extraLightGray hover:text-primary">
              <FaEllipsisH />
            </button>
          </div>
          
          {tweetData.replyTo && (
            <div className="text-gray-500 text-sm mb-1">
              Replying to{' '}
              <Link href={`/profile/${tweetData.replyTo.user.username}`} className="text-primary hover:underline">
                @{tweetData.replyTo.user.username}
              </Link>
            </div>
          )}
          
          <Link href={`/tweet/${tweetData._id}`} className="block">
            <p className={`text-gray-900 ${isDetail ? 'text-xl mb-4' : ''}`}>
              {tweetData.content}
            </p>
          </Link>
          
          {showActions && (
            <div className="flex justify-between mt-3 max-w-md">
              <Link href={`/tweet/${tweetData._id}`} className="flex items-center text-gray-500 hover:text-primary group">
                <div className="p-2 group-hover:bg-blue-50 rounded-full">
                  <FaRegComment />
                </div>
                <span className="ml-1 text-sm">{tweetData.replyCount}</span>
              </Link>
              
              <button 
                onClick={handleRetweet}
                disabled={actionLoading}
                className={`flex items-center ${tweetData.isRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'} group`}
              >
                <div className="p-2 group-hover:bg-green-50 rounded-full">
                  <FaRetweet />
                </div>
                <span className="ml-1 text-sm">{tweetData.retweetCount}</span>
              </button>
              
              <button 
                onClick={handleLike}
                disabled={actionLoading}
                className={`flex items-center ${tweetData.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} group`}
              >
                <div className="p-2 group-hover:bg-red-50 rounded-full">
                  {tweetData.isLiked ? <FaHeart /> : <FaRegHeart />}
                </div>
                <span className="ml-1 text-sm">{tweetData.likeCount}</span>
              </button>
              
              <button className="flex items-center text-gray-500 hover:text-primary group">
                <div className="p-2 group-hover:bg-blue-50 rounded-full">
                  <FaShareAlt />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
